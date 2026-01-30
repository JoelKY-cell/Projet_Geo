from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Position, Trip, StopPoint

class PositionSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source='vehicle.license_plate', read_only=True)
    
    class Meta:
        model = Position
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.CharField(source='vehicle.license_plate', read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'

class StopPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = StopPoint
        fields = '__all__'

class PositionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['vehicle']
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current positions for all vehicles"""
        latest_positions = []
        vehicles = Position.objects.values('vehicle').distinct()
        for v in vehicles:
            pos = Position.objects.filter(vehicle=v['vehicle']).order_by('-timestamp').first()
            if pos:
                latest_positions.append(pos)
        serializer = self.get_serializer(latest_positions, many=True)
        return Response(serializer.data)

class TripViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['vehicle', 'is_completed']

class StopPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StopPoint.objects.all()
    serializer_class = StopPointSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['trip']