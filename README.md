MonoDMS – Document Management System

MonoDMS is a full-stack Document Management System (DMS) built using the MEAN stack.
The project focuses on secure document storage, version control, role-based access, and a clean, responsive user interface inspired by real-world systems such as Google Drive and SharePoint.

✨ Key Features

Authentication & Authorization

Secure login and registration using JWT

Role-based access control (Owner, Editor, Viewer)

Document Management

Upload, view, update, and delete documents

Tagging and categorization support

Version Control

Maintain complete document version history

Download older versions when required

Search & Filtering

Search documents by title, tags, or owner

Permission-aware results

Responsive UI

Optimized for desktop, tablet, and mobile devices

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (File uploads)

Frontend

Angular 16+

Standalone Components

Angular Router & Guards

RxJS

Custom CSS (Responsive Design)

📁 Project Structure
monodms/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── uploads/
├── frontend/
│   ├── src/
│   └── angular.json
└── README.md

⚙️ Local Setup
Prerequisites

Node.js v14+

MongoDB (Local or Atlas)

Angular CLI

npm install -g @angular/cli

Backend Setup
cd backend
npm install


Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/monodms
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d


Start backend:

npm run dev

Frontend Setup
cd frontend
npm install
ng serve


Access app at:
http://localhost:4200

🔌 API Overview
Auth

POST /api/auth/register

POST /api/auth/login

Documents

GET /api/documents

POST /api/documents

GET /api/documents/:id

PUT /api/documents/:id

DELETE /api/documents/:id

POST /api/documents/:id/share

Versions

POST /api/documents/:id/versions

GET /api/documents/:id/versions

GET /api/documents/:id/versions/:versionId/download

🖼 Screenshots

Screenshots of the following pages are included:

Login & Registration

Document Dashboard

Upload & Versioning

Search & Filtering

Permission Management

Responsive Mobile View

🧠 Design Choices

Used Angular standalone components to reduce boilerplate.

Chose service-based RxJS state handling for simplicity over heavy state libraries.

Enforced permissions at backend middleware level for security.

File storage is modular and can be extended to cloud storage services.

📌 Future Improvements

Cloud storage integration (AWS S3 / Azure Blob)

Audit logs for document activity

Advanced full-text search

📄 License

MIT License
