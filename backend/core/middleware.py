class CompanyIsolationMiddleware:
    """Middleware pour isolation automatique par entreprise"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.user.is_authenticated and not request.user.is_super_admin():
            request.company = request.user.company
        else:
            request.company = None
        
        response = self.get_response(request)
        return response
