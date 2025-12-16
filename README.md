# Student Management System

A full-stack web application with Django backend and React frontend.

## Features

- Add, view, delete students
- Student details: Name, Age, Gender, Email
- Real-time updates
- Responsive design

## Tech Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Bootstrap
- **Database:** SQLite (development)

## Setup Instructions

### Backend Setup

```bash
cd student-project
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
