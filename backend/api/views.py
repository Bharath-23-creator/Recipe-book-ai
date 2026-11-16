from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SavedRecipe
from .serializers import SavedRecipeSerializer
import json
from django.conf import settings
from google import genai
from google.genai import types

@api_view(['POST'])
def register(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response({'error': 'All fields are required'}, status=400)

    email = email.lower()

    if User.objects.filter(username=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )
    return Response({'message': 'Account created successfully'}, status=201)


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    user = authenticate(username=email.lower(), password=password)

    if user is None:
        return Response({'error': 'Invalid email or password'}, status=400)

    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'name': user.first_name})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def recipes(request):
    if request.method == 'GET':
        saved = SavedRecipe.objects.filter(user=request.user).order_by('-created_at')
        serializer = SavedRecipeSerializer(saved, many=True)
        return Response(serializer.data)

    serializer = SavedRecipeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_recipe(request, recipe_id):
    try:
        recipe = SavedRecipe.objects.get(id=recipe_id, user=request.user)
    except SavedRecipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=404)

    recipe.delete()
    return Response({'message': 'Recipe deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_recipe(request):
    ingredients = request.data.get('ingredients', [])
    dish = request.data.get('dish', '')

    if not isinstance(ingredients, list) or len(ingredients) == 0:
        return Response({'error': 'Add at least one ingredient'}, status=400)

    prompt = (
        'You are a helpful cooking assistant. '
        f"The user has these ingredients: {', '.join(ingredients)}. "
    )
    if dish:
        prompt += f'They want to make: {dish}. '
    else:
        prompt += 'Suggest one simple dish they can make. '
    prompt += (
        'Reply only with JSON in this format: '
        '{"title": "dish name", "ingredients": ["item with quantity"], '
        '"steps": ["step 1", "step 2"]}'
    )

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            ),
        )
        recipe = json.loads(response.text)
    except Exception as e:
        print('AI error:', e)
        return Response({'error': 'Could not generate recipe. Try again.'}, status=500)

    return Response(recipe)