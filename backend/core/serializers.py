from rest_framework import serializers
from core.models import Company
from users.models import User
from django.contrib.auth.hashers import make_password

class CompanySerializer(serializers.ModelSerializer):
    user_count = serializers.SerializerMethodField()
    admin_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'is_active', 'created_at', 'user_count', 'admin_name']
        read_only_fields = ['id', 'created_at']
    
    def get_user_count(self, obj):
        return obj.users.count()
    
    def get_admin_name(self, obj):
        admin = obj.users.filter(role='admin').first()
        return admin.username if admin else None

class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'company', 'company_name', 'phone', 'is_active', 'password']
        read_only_fields = ['id']
        extra_kwargs = {'company': {'required': False}}
    
    def validate(self, data):
        request = self.context.get('request')
        user = request.user if request else None
        
        # Validation selon le rôle de l'utilisateur connecté
        if user:
            role = data.get('role', self.instance.role if self.instance else None)
            company = data.get('company', self.instance.company if self.instance else None)
            
            # Super Admin peut tout faire
            if user.is_super_admin():
                # Super Admin ne doit pas avoir de company
                if role == 'super_admin' and company:
                    raise serializers.ValidationError("Un Super Admin ne peut pas avoir d'entreprise")
                # Admin doit avoir une company
                if role in ['admin', 'supervisor', 'user'] and not company:
                    raise serializers.ValidationError(f"Le rôle {role} nécessite une entreprise")
            
            # Admin d'entreprise ou Superviseur
            elif user.is_admin() or user.is_supervisor():
                # Auto-assigner la company de l'utilisateur connecté
                data['company'] = user.company
                
                # Validation des rôles
                if user.is_admin():
                    if role not in ['supervisor', 'user']:
                        raise serializers.ValidationError("Vous ne pouvez créer que des superviseurs et utilisateurs")
                elif user.is_supervisor():
                    if role != 'user':
                        raise serializers.ValidationError("Vous ne pouvez créer que des utilisateurs simples")
        
        return data
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.password = make_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance
