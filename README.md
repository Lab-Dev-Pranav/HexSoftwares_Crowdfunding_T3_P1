# Crowdfunding Platform

A full-stack web application for project fundraising and contributions.

## Features
- User authentication (register/login)
- Project creation and management
- Contribution to projects
- Display of top invested project on homepage
- Protected routes for project details and contributions
- Real-time funding progress

## Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT

## Folder Structure
```
PROJECT/
  client/
	 src/
		components/
		pages/
		assets/
	 public/
	 ...
  server/
	 models/
	 routes/
	 ...
```

## Setup Instructions

### Backend
1. Navigate to `PROJECT/server`
2. Install dependencies:
	```bash
	npm install
	```
3. Create a `.env` file with:
	```env
	PORT=5000
	MONGO_URI=<your_mongo_uri>
	JWT_SECRET=<your_jwt_secret>
	RAZORPAY_KEY_ID=<your_razorpay_key_id>
	RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
	```
4. Start the backend:
	```bash
	nodemon index.js
	```

### Frontend
1. Navigate to `PROJECT/client`
2. Install dependencies:
	```bash
	npm install
	```
3. Start the frontend:
	```bash
	npm run dev
	```

### API Proxy
Vite is configured to proxy `/api` requests to the backend (`localhost:5000`).

## Usage
- Register or login as a user or creator.
- Creators can launch projects.
- Users can contribute to projects.
- Homepage displays the most invested project and stats.

## License
MIT
ENV file for backend

PORT=5000 <br>
MONGO_URI= Add MongoDB Link <br>
JWT_SECRET= Add JWT Secret Key <br>
RAZORPAY_KEY_ID=your_razorpay_key_id <br>
RAZORPAY_KEY_SECRET=your_razorpay_key_secret <br>


NOTE - Razorpay system is not built in this poroject....
