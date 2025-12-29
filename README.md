# MonoDMS - Enterprise Document Management System

MonoDMS is a robust, full-stack Document Management System (DMS) designed to handle enterprise-grade document lifecycles. It features secure authentication, role-based access control (RBAC), version control, and a responsive user interface.

## 🚀 Features

*   **User Authentication**: Secure Login and Registration using JWT (JSON Web Tokens).
*   **Document Management**: Upload, view, edit, and delete documents.
*   **Version Control**: Maintain history of document changes with the ability to download previous versions.
*   **Role-Based Access Control (RBAC)**:
    *   **Owners**: Full control over their documents.
    *   **Admins**: System-wide control (can be extended).
    *   **Shared Access**: Granular permissions (Read, Write, Admin) for specific users.
*   **Search & Filtering**: Find documents by title, tags, or owner.
*   **Responsive Design**: Optimized for both desktop and mobile devices.
*   **Security**: Implements Helmet, CORS, Mongo Sanitize, and XSS protection.

## 🛠️ Tech Stack

### Backend (Node.js & Express)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (with Mongoose ODM)
*   **Authentication**: JWT & bcryptjs
*   **File Handling**: Multer
*   **Security**: Helmet, CORS, XSS-Clean, Express-Mongo-Sanitize

### Frontend (Angular)
*   **Framework**: Angular 16+
*   **Architecture**: Standalone Components
*   **Styling**: Custom CSS with CSS Variables (Responsive)
*   **State Management**: RxJS (Services & Observables)
*   **Routing**: Angular Router with Auth Guards

## 📋 Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas connection string)
*   Angular CLI (`npm install -g @angular/cli`)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd monodms
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/monodms
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the application:
```bash
ng serve
```
Navigate to `http://localhost:4200`.

## 🔌 API Endpoints

### Auth
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login user

### Documents
*   `GET /api/documents` - Get all documents (with search/filter)
*   `POST /api/documents` - Upload a new document
*   `GET /api/documents/:id` - Get document details
*   `PUT /api/documents/:id` - Update document metadata
*   `DELETE /api/documents/:id` - Delete document
*   `POST /api/documents/:id/share` - Share document with user

### Versions
*   `POST /api/documents/:id/versions` - Upload new version
*   `GET /api/documents/:id/versions` - Get version history
*   `GET /api/documents/:id/versions/:versionId/download` - Download specific version

## 💡 Design Decisions

*   **Standalone Components**: Used Angular's latest standalone component architecture to reduce boilerplate (NgModules) and improve tree-shaking.
*   **Service-Based State**: Authentication and Document state are managed via RxJS BehaviorSubjects in services, providing a reactive data flow without the complexity of NgRx for this scale.
*   **Security First**: The backend enforces permissions at the middleware level (`checkDocumentPermission`), ensuring that API endpoints are secure regardless of frontend UI states.
*   **Scalable File Storage**: While currently using local disk storage (`/uploads`), the `uploadMiddleware` is abstracted to easily switch to cloud storage (AWS S3, Azure Blob) in the future.

## 📄 License

This project is licensed under the MIT License.
