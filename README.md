MonoDMS – Document Management System

MonoDMS is a full-stack Document Management System built using the MEAN stack.
The project focuses on secure document handling, version control, role-based access, and responsive UI design, inspired by real-world tools such as Google Drive and SharePoint.

Features

User Authentication

Secure user registration and login using JWT

Document Management

Upload, view, update, and delete documents

Version Control

Maintains multiple versions of documents

Allows downloading previous versions

Role-Based Access Control (RBAC)

Owner: Full access to documents

Editor: Edit and upload new versions

Viewer: Read-only access

Search & Filtering

Search documents by title, tags, or owner

Responsive Design

Works across desktop, tablet, and mobile devices

Tech Stack
Backend

Node.js

Express.js

MongoDB (Mongoose ODM)

JWT Authentication

Multer (File Uploads)

Frontend

Angular 16+

Standalone Components

Angular Router with Auth Guards

RxJS for state handling

Custom responsive CSS

Prerequisites

Ensure the following are installed locally:

Node.js v14 or above

MongoDB (local or MongoDB Atlas)

Angular CLI

npm install -g @angular/cli

Installation & Local Setup
1. Clone the Repository
git clone <repository-url>
cd monodms

2. Backend Setup
cd backend
npm install


Create a .env file inside the backend directory:

PORT=5000
MONGO_URI=mongodb://localhost:27017/monodms
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d


Start the backend server:

npm run dev


Backend runs on:
http://localhost:5000

3. Frontend Setup
cd frontend
npm install
ng serve


Frontend runs on:
http://localhost:4200

API Endpoints (Backend)
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

GET /api/documents/:id/versions – View version history

GET /api/documents/:id/versions/:versionId/download – Download version

Screenshots

The following screenshots are included in the submission email:

Login Page

Registration Page

Document Dashboard

Document Upload Page

Search & Filter Functionality

Document Details View

Version History View

Permission Management

Responsive Mobile View

Design Decisions

Standalone Angular Components were used to reduce boilerplate and improve maintainability.

Service-based state management using RxJS was chosen over NgRx to keep the application simple and scalable.

Backend permission checks are enforced at middleware level to prevent unauthorized access.

Local file storage was used for simplicity, with a structure that can be extended to cloud storage if needed.

License

This project is developed as part of an assignment and is licensed under the MIT License.
