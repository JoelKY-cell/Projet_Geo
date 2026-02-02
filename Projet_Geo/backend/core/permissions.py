from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """Accès réservé aux Super Admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_super_admin()

class IsAdmin(permissions.BasePermission):
    """Accès réservé aux Admins de leur entreprise"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_super_admin() or request.user.is_admin()
        )

class IsSupervisor(permissions.BasePermission):
    """Accès réservé aux Superviseurs et supérieurs"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['super_admin', 'admin', 'supervisor']

class CompanyIsolationPermission(permissions.BasePermission):
    """Isolation stricte par entreprise"""
    def has_object_permission(self, request, view, obj):
        if request.user.is_super_admin():
            return True
        
        if hasattr(obj, 'company'):
            return obj.company == request.user.company
        
        if hasattr(obj, 'vehicle') and hasattr(obj.vehicle, 'company'):
            return obj.vehicle.company == request.user.company
        
        return False
