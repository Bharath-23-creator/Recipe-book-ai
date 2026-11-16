# Recipe Book AI

A full stack web app where users add the ingredients they have at home
and get an AI-generated recipe. Users can save recipes and view them later.

## Tech Stack
- Frontend: React, React Router
- Backend: Python, Django, Django REST Framework
- Database: MySQL
- AI: Google Gemini API

## Features
- Register and login with token authentication
- Add and remove ingredients
- Generate a recipe from ingredients (optionally for a specific dish)
- Save, view, and delete recipes

## How to run

### Backend
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. Create a MySQL database named recipe_book_db
6. Copy .env.example to .env and fill in your values
7. python manage.py migrate
8. python manage.py runserver

### Frontend
1. cd frontend
2. npm install
3. npm run dev