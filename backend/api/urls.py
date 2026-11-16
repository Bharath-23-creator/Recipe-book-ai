from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login_user),
    path('recipes/', views.recipes),
    path('recipes/<int:recipe_id>/', views.delete_recipe),
    path('generate/', views.generate_recipe),
]