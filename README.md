# Bus Booking System

A modern bus booking platform built with Next.js and Django. This system allows users to search for buses, view available seats, and make bookings with an intuitive interface.

## Documentation

please refer to:
[Project Documentation](https://docs.google.com/document/d/1ZUqnbHmVsD1V8dlTMW-q6Mlf9z4De-pIxZNpDoh7EyE/edit?tab=t.0)

## Features

- Search buses by source, destination, and date
- Real-time seat availability
- Interactive seat selection
- Responsive design
- User authentication
- Booking management
## DB Diagram
![image](https://github.com/user-attachments/assets/7f244b8a-56fc-4558-8c02-ae687d8455de)

## Colour for Seat Availabilty
![image](https://github.com/user-attachments/assets/95aa1bfe-a2a2-4177-8c56-feccb53b8953)
![image](https://github.com/user-attachments/assets/61b0315c-256b-4817-9f46-c01cf8ad369f)
![image](https://github.com/user-attachments/assets/b2803a8d-ae55-4d91-8825-0b833e0c748c)

## Seat Selection
![image](https://github.com/user-attachments/assets/53c47d8b-ea71-48f7-965d-7d06d307cc45)

## Manage Your Ticket
![image](https://github.com/user-attachments/assets/9af502ac-5aa8-48dc-89e9-249fea4278a9)


## Download Your E-ticket
![image](https://github.com/user-attachments/assets/5490b613-e1f8-4e2e-bf0f-5090d5db589e)



## Tech Stack

### Frontend
- Next.js 13+
- Tailwind CSS
- React Hooks
- Next Router

### Backend
- Django 4.2+
- Django REST Framework
- SQLite (default) / PostgreSQL
- Python 3.8+

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (16.x or higher)
- Python (3.8 or higher)
- pip (Python package manager)
- Git

## Installation

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd bus-booking-system
```

2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up database
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser (Optional)
```bash
python manage.py createsuperuser
```

6. Start Django server
```bash
python manage.py runserver
```

The backend server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install Node.js dependencies
```bash
npm install
# or
yarn install
```


3. Start the development server
```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:3000`

## Project Structure

```
bus-booking-system/
├── backend/
│   ├── accounts/        # Django project directory
│   ├── booking/               # Django app directory
│   ├── bus_booking
│   └── requirements.txt
│
└── frontend/
    ├── src
        ├── components/        # React components
        ├── pages/            # Next.js pages
        ├── public/           # Static files
        ├── styles/           # CSS styles
    └── package.json
```

## API Endpoints

# API Endpoints List

## Authentication
```
POST /api/token/
```

## User Management
```
POST /api/register/
```

## Booking Operations
```
POST /api/create_booking/
POST /api/orders/${order.id}/cancel/
```

## Trip Management
```
GET /api/user-trips/
GET /api/trips/?source=${source}&destination=${destination}&travel_date=${date}
```

## API URL Reference Table

| Endpoint | Method | URL |
|----------|--------|-----|
| Token | POST | http://localhost:8000/api/token/ |
| Register | POST | http://localhost:8000/api/register/ |
| Create Booking | POST | http://localhost:8000/api/create_booking/ |
| Cancel Order | POST | http://localhost:8000/api/orders/${order.id}/cancel/ |
| User Trips | GET | http://localhost:8000/api/user-trips/ |
| Search Trips | GET | http://localhost:8000/api/trips/?source=${source}&destination=${destination}&travel_date=${date} |



## Acknowledgments

- Next.js Documentation
- Django Documentation
- Tailwind CSS
