# Django React Blog App

A full stack blog application built with Django REST Framework and React.

## Features
- User registration and login with JWT
- Create, read, update, delete blog posts
- Only post owners can edit or delete their posts
- Beautiful UI with Tailwind CSS

## Tech Stack
**Backend:** Django, Django REST Framework, Simple JWT

**Frontend:** React, React Router, Tailwind CSS

## Setup

### Backend
```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```