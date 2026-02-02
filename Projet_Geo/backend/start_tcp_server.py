#!/usr/bin/env python
"""Script de démarrage du serveur TCP GPS"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from listeners.tcp_server import TCPServer

if __name__ == '__main__':
    server = TCPServer(host='0.0.0.0', port=5027)
    try:
        print("Démarrage serveur TCP GPS sur port 5027...")
        server.start()
    except KeyboardInterrupt:
        print("\nArrêt du serveur...")
        server.stop()
