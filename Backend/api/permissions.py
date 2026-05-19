from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthorOrReadOnly(BasePermission):
    """
    Allow anyone to read (GET)
    Only the author can edit/delete their own post
    """

    def has_object_permission(self, request, view, obj):
        # GET, HEAD, OPTIONS → allow everyone
        if request.method in SAFE_METHODS:
            return True

        # POST, PUT, DELETE → only allow the author
        return obj.author == request.user