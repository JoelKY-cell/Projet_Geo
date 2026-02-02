from datetime import datetime

class SinotrackParser:
    """Parser pour protocole Sinotrack"""
    
    def parse(self, data):
        """Parse données Sinotrack"""
        positions = []
        
        try:
            message = data.decode('utf-8', errors='ignore')
            
            # Format: ST300STT;IMEI;Date;Time;Lat;Lon;Speed;Heading;...
            
            if message.startswith('ST'):
                pos = self.parse_st_message(message)
                if pos:
                    positions.append(pos)
        
        except Exception as e:
            print(f"Erreur parsing Sinotrack: {e}")
        
        return positions
    
    def parse_st_message(self, message):
        """Parse message ST"""
        try:
            parts = message.split(';')
            
            # Date/Time
            date_str = parts[2]
            time_str = parts[3]
            timestamp = datetime.strptime(f"{date_str} {time_str}", '%Y%m%d %H%M%S')
            
            # Latitude
            lat = float(parts[4])
            
            # Longitude
            lon = float(parts[5])
            
            # Speed
            speed = float(parts[6])
            
            # Heading
            heading = int(float(parts[7]))
            
            return {
                'timestamp': timestamp,
                'latitude': lat,
                'longitude': lon,
                'speed': speed,
                'heading': heading,
                'engine_on': True,
                'ignition': True
            }
        except:
            return None
    
    def get_ack(self, data):
        """Génère ACK pour Sinotrack"""
        return b'OK'
