import struct
from datetime import datetime

class TeltonikaParser:
    """Parser pour protocole Teltonika (binaire)"""
    
    def parse(self, data):
        """Parse données Teltonika"""
        positions = []
        
        try:
            # Codec 8 / 8E / 16
            # Structure simplifiée
            offset = 0
            
            # Preamble (4 bytes)
            offset += 4
            
            # Data length (4 bytes)
            data_length = struct.unpack('>I', data[offset:offset+4])[0]
            offset += 4
            
            # Codec ID (1 byte)
            codec_id = data[offset]
            offset += 1
            
            # Number of records
            num_records = data[offset]
            offset += 1
            
            for _ in range(num_records):
                pos = self.parse_record(data, offset, codec_id)
                if pos:
                    positions.append(pos)
                    offset = pos['next_offset']
        
        except Exception as e:
            print(f"Erreur parsing Teltonika: {e}")
        
        return positions
    
    def parse_record(self, data, offset, codec_id):
        """Parse un enregistrement"""
        try:
            # Timestamp (8 bytes)
            timestamp_ms = struct.unpack('>Q', data[offset:offset+8])[0]
            timestamp = datetime.fromtimestamp(timestamp_ms / 1000)
            offset += 8
            
            # Priority (1 byte)
            offset += 1
            
            # Longitude (4 bytes)
            longitude = struct.unpack('>i', data[offset:offset+4])[0] / 10000000
            offset += 4
            
            # Latitude (4 bytes)
            latitude = struct.unpack('>i', data[offset:offset+4])[0] / 10000000
            offset += 4
            
            # Altitude (2 bytes)
            altitude = struct.unpack('>h', data[offset:offset+2])[0]
            offset += 2
            
            # Angle (2 bytes)
            heading = struct.unpack('>H', data[offset:offset+2])[0]
            offset += 2
            
            # Satellites (1 byte)
            offset += 1
            
            # Speed (2 bytes)
            speed = struct.unpack('>H', data[offset:offset+2])[0]
            offset += 2
            
            # IO Elements (skip for now)
            # ...
            
            return {
                'timestamp': timestamp,
                'latitude': latitude,
                'longitude': longitude,
                'altitude': altitude,
                'speed': speed,
                'heading': heading,
                'engine_on': True,
                'ignition': True,
                'next_offset': offset
            }
        except:
            return None
    
    def get_ack(self, data):
        """Génère ACK pour Teltonika"""
        try:
            num_records = data[9]
            return struct.pack('>I', num_records)
        except:
            return b'\x00\x00\x00\x01'
