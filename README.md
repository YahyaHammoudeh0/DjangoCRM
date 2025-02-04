# Sales CRM System

## Overview
A comprehensive Customer Relationship Management (CRM) system designed to streamline sales processes, lead management, and team performance tracking.

## Key Features
- Automated lead creation and assignment
- Intelligent lead scoring system using DeepSeek AI
- Sales team performance tracking
- Django backend with RESTful API
- React frontend with Material UI

## Technologies
- Backend: Django 4.x
- Frontend: React
- UI Framework: Material UI
- API Integration: DeepSeek
- Database: Django ORM (PostgreSQL recommended)

## System Architecture
### Lead Management
- Create leads manually or through automated channels
- Assign leads to sales team members based on AI-powered scoring algorithm
- Track lead progression through sales funnel

### Scoring System
Utilizes DeepSeek AI to:
- Evaluate lead potential
- Predict conversion probability
- Optimize sales team resource allocation

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- DeepSeek API Credentials

### Backend Installation
```bash
git clone https://github.com/[your-org]/sales-crm.git
cd sales-crm/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

### Frontend Installation
```bash
cd ../frontend
npm install
npm start
```

### Configuration
1. Create `.env` files in backend and frontend directories
2. Add DeepSeek API credentials
3. Configure database settings

## API Documentation
- Django REST Framework Swagger
- DeepSeek API Reference: https://api-docs.deepseek.com/

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create pull request
