from django.contrib import admin
from .models import Ingredient, SavedRecipe

admin.site.register(Ingredient)
admin.site.register(SavedRecipe)