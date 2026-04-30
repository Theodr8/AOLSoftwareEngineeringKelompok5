Kelompok 5
Anggota 
* Derrick Gunawan
* Johansen Tan
* Kevin Tan
* Rayyan
* Theodore Alexander
# Godev

A full-stack Single Page Application (SPA) built with React (Vite), Express, Typescript, and PostgreSQL.

## Prerequisites
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v20.x or higher recommended)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)

## Local Setup Instructions
### 1. Clone the Repository
git clone https://github.com/Theodr8/AOLSoftwareEngineeringKelompok5.git

### 2. (Backend) Environment Configuration
``` bash
# Inside backend folder
cd backend
cp .env.example .env
```

### 3. Install Dependencies
``` bash
# Inside backend folder
cd ../backend
npm install
# Inside frontend folder
cd ../frontend
npm install
```

### 4. Start the Database
``` bash
# Inside root dirrectory
cd ..
docker-compose up -d
```

### 5. Run the application
Run the Backend
```bash
# Inside backend folder
cd backend
npm run dev
```
Run the Frontend
```bash
# Inside frontend folder
cd frontend
npm run dev
```
