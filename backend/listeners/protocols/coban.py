from datetime import datetime

class CobanParser:
    """Parser pour protocole Coban (ASCII)"""
    
    def parse(self, data):
        """Parse données Coban"""
        positions = []
        
        try:
            message = data.decode('utf-8', errors='ignore')
            
            # Format: ##,imei:XXXXXXXXXXXXXXX,A;
            # ou: imei:XXXXXXXXXXXXXXX,tracker,YYMMDD HHMMSS,V,lat,N,lon,E,speed,heading;
            
            if 'tracker' in message:
                pos = self.parse_tracker_message(message)
                if pos:
                    positions.append(pos)
        
        except Exception as e:
            print(f"Erreur parsing Coban: {e}")
        
        return positions
    
    def parse_tracker_message(self, message):
        """Parse message tracker"""
        try:
            parts = message.split(',')
            
            # Date/Time
            datetime_str = parts[2]
            timestamp = datetime.strptime(datetime_str, '%y%m%d %H%M%S')
            
            # GPS Valid
            gps_valid = parts[3] == 'A'
            
            if not gps_valid:
                return None
            
            # Latitude
            lat = float(parts[4])
            lat_dir = parts[5]
            if lat_dir == 'S':
                lat = -lat
            
            # Longitude
            lon = float(parts[6])
            lon_dir = parts[7]
            if lon_dir == 'W':
                lon = -lon
            
            # Speed (knots to km/h)
            speed = float(parts[8]) * 1.852
            
            # Heading
            heading = int(float(parts[9]))
            
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
        """Génère ACK pour Coban"""
        return b'ON'
