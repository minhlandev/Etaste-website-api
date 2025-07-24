# 🏡 Estate - Real Estate Platform Backend

A robust RESTful API backend for a real estate listing platform built with **Node.js**, **Express**, and **MongoDB**.

## ✨ Features

- 🔐 **Authentication & Authorization** (JWT-based)
- 👤 **User Management** (Admin & Regular Users)
- 🏨 **Property Listing Management** with Image Upload
- 📂 **Category & Type Management** (e.g., Apartment, Villa, Land)
- 📍 **Location-based Search & Filters**
- 💬 **Comment & Rating System**
- ✍️ **Post Management** for agents and admins
- ☁️ **Cloudinary Integration** for Image Hosting
- 📚 **Swagger API Documentation**

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for Authentication
- **Cloudinary** for Image Storage
- **Swagger** for API Documentation
- **Multer** for File Uploads
- **Bcrypt** for Password Hashing

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- Optional: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

## 📁 Environment Variables

Read the provided `env.example` file and create your own `.env` file.

```bash
cp env.example .env
```

Update all required fields such as:

```
DATABASE_URL=
JWT_SECRET_KEY = 
CLIENT_URL = http://localhost:5173/
GOOGLE_CLIENT_ID=
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/estate-backend.git
cd backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
node app.js
# or
console-ninja node --watch app.js
```

---

## 🐳 Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Using Docker

```bash
docker-compose up --build
```

---


## 🌐 Accessing the Application

- Frontend (if connected): `http://localhost:5173/`
- Backend API: `http://localhost:8800`
- API Docs (Swagger): `http://localhost:3002/api-docs`

---

## 🧪 Development (Optional Frontend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Socket Setup

```bash
cd socket
npm install
node app.js
```

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using **Node.js**, **Express**, and **MongoDB**
- Inspired by modern real estate platforms like Zillow, Realtor.com
- Thanks to all open-source contributors
