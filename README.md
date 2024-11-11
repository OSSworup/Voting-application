# Voting Application

A web-based voting application that allows users to sign up, log in, and vote for candidates. Each user is uniquely identified by their Aadhaar card number, ensuring one vote per user. An admin can manage candidates but cannot participate in voting.

### Features

 -User Authentication: Sign up and log in with Aadhaar card number and password.
 -Candidate Voting: View a list of candidates and cast a vote.
 -Live Vote Counts: Get a live, sorted view of candidates by vote count.
 -Admin Management: Admin can create, update, or delete candidates but cannot vote.
 -Profile Management: Users can view and change their passwords.
 -Access Control: Users can only log in with Aadhaar and password, and each user is limited to a single vote.

### Tech Stack

-Backend: Node.js, Express.js
-Database: MongoDB
-Authentication: JSON Web Token (JWT)

### Project Structure

└── VOTING APPLICATION/
    ├── models/
    │   ├── User.js         # User model, includes Aadhaar-based authentication
    │   └── Candidate.js    # Candidate model, tracks vote counts
    ├── routes/
    │   ├── candidateRoute.js # Routes for voting and candidate management
    │   └── userRoute.js   # Routes for user profile and password management
    ├── db.js               # Database connection module
    ├── jwt.js              # JWT authentication middleware
    └── server.js           # Server setup and configuration


## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or MongoDB Atlas URI

### Installation
1. Clone the repository:
    ```
   git clone https://github.com/OSSworup/Task-Management-System
    ```
   
2. Navigate to the project directory:
   ```
   cd Task Management System
   ```
3. Install dependencies:
  "dependencies": {
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.7.0",
    "nodemon": "^3.1.7"
  },
   ```
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-secret-key
     ```

5. Start the server:
   ```
   node server.js
   ```

## API Endpoints

### User Authentication:
    /signup: POST - Create a new user account.
    /login: POST - Log in to an existing account. [ aadhar card number + password]

### Voting:
    /candidates: GET - Get the list of candidates.
    /vote/:candidateId: POST - Vote for a specific candidate.

### Vote Counts:
    /vote/counts: GET - Get the list of candidates sorted by their vote counts.

### User Profile:
    /profile: GET - Get the user's profile information.
    /profile/password: PUT - Change the user's password.

### Admin Candidate Management:
    /candidates: POST - Create a new candidate.
    /candidates/:candidateId: PUT - Update an existing candidate.
    /candidates/:candidateId: DELETE - Delete a candidate from the list.