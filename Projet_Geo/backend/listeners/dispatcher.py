import logging
from .protocols.teltonika import TeltonikaParser
from .protocols.coban import CobanParser
from .protocols.sinotrack import SinotrackParser

logger = logging.getLogger(__name__)

class DataDispatcher:
    """Dispatcher pour router les données vers le bon parser"""
    
    def __init__(self):
        self.parsers = {
            'teltonika': TeltonikaParser(),
            'coban': CobanParser(),
            'sinotrack': SinotrackParser(),
        }
    
    def process(self, device, data, socket):
        """Traitement des données selon le protocole du device"""
        protocol = device.protocol
        
        if protocol not in self.parsers:
            logger.error(f"Protocole {protocol} non supporté")
            return
        
        parser = self.parsers[protocol]
        
        try:
            # Parsing des données
            positions = parser.parse(data)
            
            # Envoi ACK
            ack = parser.get_ack(data)
            if ack:
                socket.send(ack)
            
            # Sauvegarde en DB
            if positions:
                self.save_positions(device, positions)
                logger.info(f"Device {device.imei}: {len(positions)} positions enregistrées")
        
        except Exception as e:
            logger.error(f"Erreur parsing {protocol} pour {device.imei}: {e}")
    
    def save_positions(self, device, positions):
        """Sauvegarde des positions en base"""
        from plugins.tracking.models import Position
        
        position_objects = []
        for pos_data in positions:
            position_objects.append(Position(
                vehicle=device.vehicle,
                device=device,
                latitude=pos_data['latitude'],
                longitude=pos_data['longitude'],
                altitude=pos_data.get('altitude'),
                speed=pos_data.get('speed', 0),
                heading=pos_data.get('heading', 0),
                engine_on=pos_data.get('engine_on', False),
                ignition=pos_data.get('ignition', False),
                timestamp=pos_data['timestamp']
            ))
        
        Position.objects.bulk_create(position_objects, ignore_conflicts=True)
