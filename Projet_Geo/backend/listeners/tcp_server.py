import socket
import threading
import logging
from django.utils import timezone
from plugins.devices.models import Device
from .dispatcher import DataDispatcher

logger = logging.getLogger(__name__)

class TCPServer:
    """Serveur TCP pour réception données GPS"""
    
    def __init__(self, host='0.0.0.0', port=5027):
        self.host = host
        self.port = port
        self.server_socket = None
        self.running = False
        self.dispatcher = DataDispatcher()
    
    def start(self):
        """Démarrage du serveur TCP"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(100)
        self.running = True
        
        logger.info(f"TCP Server démarré sur {self.host}:{self.port}")
        
        while self.running:
            try:
                client_socket, address = self.server_socket.accept()
                logger.info(f"Connexion depuis {address}")
                
                client_thread = threading.Thread(
                    target=self.handle_client,
                    args=(client_socket, address)
                )
                client_thread.daemon = True
                client_thread.start()
            except Exception as e:
                logger.error(f"Erreur serveur: {e}")
    
    def handle_client(self, client_socket, address):
        """Gestion d'une connexion client"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
            
            # Extraction IMEI et validation
            imei = self.extract_imei(data)
            if not imei:
                logger.warning(f"IMEI invalide depuis {address}")
                client_socket.close()
                return
            
            # Vérification Device existe
            try:
                device = Device.objects.select_related('company', 'vehicle').get(
                    imei=imei,
                    is_active=True
                )
            except Device.DoesNotExist:
                logger.warning(f"Device {imei} non trouvé")
                client_socket.close()
                return
            
            # Mise à jour dernière communication
            device.last_communication = timezone.now()
            device.save(update_fields=['last_communication'])
            
            # Dispatch vers parser approprié
            self.dispatcher.process(device, data, client_socket)
            
        except Exception as e:
            logger.error(f"Erreur traitement client {address}: {e}")
        finally:
            client_socket.close()
    
    def extract_imei(self, data):
        """Extraction IMEI depuis données brutes"""
        try:
            # Logique d'extraction selon protocole
            # À adapter selon format
            return data[:15].decode('utf-8', errors='ignore')
        except:
            return None
    
    def stop(self):
        """Arrêt du serveur"""
        self.running = False
        if self.server_socket:
            self.server_socket.close()
        logger.info("TCP Server arrêté")
