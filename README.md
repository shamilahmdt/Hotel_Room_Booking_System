# 🏨 Hotel Room Booking System (HRBS)

![HRBS Banner](C:\Users\ASUS\.gemini\antigravity\brain\e58a9973-ff46-4725-b649-35b55f2eadd4\hrbs_banner_1778049629553.png)

A modern, high-performance, and feature-rich Hotel Room Booking System designed for luxury and efficiency. HRBS provides a seamless experience for both hotel managers and customers, offering real-time room management, secure bookings, and an elegant user interface.

---

## 🚀 Features

### For Customers
- **Intuitive Hotel Discovery**: Browse and search through a curated list of hotels with detailed amenities and location info.
- **Detailed Room Views**: Explore room types, pricing, and high-quality images.
- **Seamless Booking**: Simple, multi-step booking process with real-time availability checks.
- **Booking History**: Keep track of all past and upcoming reservations.
- **Personalized Profile**: Manage personal details and profile imagery.

### For Hotel Managers
- **Comprehensive Dashboard**: Overview of hotel performance and booking status.
- **Room Management**: Add, update, or remove rooms with ease.
- **Booking Oversight**: Monitor and manage customer reservations (Pending, Confirmed, Cancelled).

---

## 🛠️ Tech Stack

### Backend (The Brain)
- **Framework**: [Django 5.1](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
- **Authentication**: JWT (JSON Web Tokens) via SimpleJWT
- **Database**: PostgreSQL (for robust relational data management)
- **Static Assets**: WhiteNoise & Pillow

### Frontend (The Face)
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State & Routing**: React Router Dom 7 & Axios
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: React Icons (Lucide/FontAwesome)

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Server**: Gunicorn
- **Deployment**: GitHub Actions CI/CD

---

## 📁 Project Structure

```text
Hotel_Room_Booking_System/
├── Backend/                # Django REST API
│   ├── src/
│   │   └── HRBS/           # Core Project Logic
│   │       ├── users/      # Custom User & Auth
│   │       ├── hotels/     # Hotel & Room Models
│   │       ├── booking/    # Reservation Logic
│   │       └── api/        # RESTful Endpoints
├── Frontend/               # React SPA
│   ├── HRBS_Frontend/
│   │   ├── src/
│   │   │   ├── api/        # API Service Layer
│   │   │   ├── pages/      # Page Components
│   │   │   └── components/ # Reusable UI Components
└── docker-compose.yml      # Orchestration
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (Optional but recommended)
- PostgreSQL

### Local Setup (Manual)

#### 1. Backend Setup
```bash
cd Backend/src/HRBS
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 2. Frontend Setup
```bash
cd Frontend/HRBS_Frontend
npm install
npm run dev
```

### Docker Setup (Recommended)
```bash
docker-compose up --build
```

---

## 🔐 Security Note
The system uses JWT for secure communication between the frontend and backend. Ensure you set a unique `SECRET_KEY` in your environment variables before deploying to production.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Shamil Ahammed T](https://github.com/shamilahmdt)
