# MonoDMS  
### Document Management System (MEAN Stack)

MonoDMS is a full-stack **Document Management System (DMS)** built using the **MEAN stack**.  
It focuses on secure document handling, version control, role-based access, and a clean, responsive user interface inspired by real-world systems such as Google Drive and SharePoint.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login using **JWT**
- Role-based access control:
  - **Owner** – full access
  - **Editor** – edit and upload new versions
  - **Viewer** – read-only access

### 📄 Document Management
- Upload, view, update, and delete documents
- Tagging and categorization support

### 🕒 Version Control
- Maintains complete version history
- Allows downloading previous versions of documents

### 🔍 Search & Filtering
- Search documents by **title**, **tags**, or **owner**
- Permission-aware search results

### 📱 Responsive UI
- Optimized for desktop, tablet, and mobile devices

---

## 🛠 Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT Authentication**
- **Multer** (File uploads)

### Frontend
- **Angular 16+**
- Standalone Components
- Angular Router with Auth Guards
- RxJS for state handling
- Custom responsive CSS

---

## 📁 Project Structure

monodms/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── uploads/
├── frontend/
│ ├── src/
│ └── angular.json
└── README.md

yaml
Copy code

---

## ⚙️ Local Setup

### Prerequisites
- **Node.js** v14 or higher  
- **MongoDB** (local or Atlas)  
- **Angular CLI**

```bash
npm install -g @angular/cli
Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file inside the backend directory:

env
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/monodms
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
Start the backend server:

bash
Copy code
npm run dev
Backend runs on:
http://localhost:5000

Frontend Setup
bash
Copy code
cd frontend
npm install
ng serve
Frontend runs on:
http://localhost:4200

🔌 API Overview
Authentication
POST /api/auth/register – Register user

POST /api/auth/login – Login user

Documents
GET /api/documents – Fetch documents (search & filter supported)

POST /api/documents – Upload document

GET /api/documents/:id – Get document details

PUT /api/documents/:id – Update document metadata

DELETE /api/documents/:id – Delete document

POST /api/documents/:id/share – Share document with permissions

Versions
POST /api/documents/:id/versions – Upload new version

GET /api/documents/:id/versions – Get version history

GET /api/documents/:id/versions/:versionId/download – Download specific version

🖼 Screenshots
Screenshots included for:

Login & Registration

Document Dashboard

Upload & Versioning

Search & Filtering

Permission Management

Responsive Mobile View

🧠 Design Choices
Standalone Angular components reduce boilerplate and improve maintainability.

Service-based RxJS state management keeps the app simple without heavy libraries.

Backend-level permission enforcement ensures secure access control.

File storage is modular and can be extended to cloud services if required.

🚀 Future Improvements
Cloud storage integration (AWS S3 / Azure Blob)

Audit logs for document activity

Advanced full-text search

📄 License
This project is licensed under the MIT License.
