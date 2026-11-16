from rest_framework import serializers
from .models import SavedRecipe


class SavedRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedRecipe
        fields = ['id', 'title', 'ingredients', 'steps', 'created_at']