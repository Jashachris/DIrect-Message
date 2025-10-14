# DIrect-Message

A full-stack direct messaging application with user authentication built using Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Password Security**: Passwords hashed using bcrypt
- **Direct Messaging**: Send and receive messages between users
- **Real-time Updates**: Messages auto-refresh every 3 seconds
- **User List**: Browse all registered users
- **Conversation History**: View complete message history with any user
- **Responsive UI**: Clean and modern interface

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **Vanilla JavaScript** - Client-side logic
- **HTML/CSS** - UI structure and styling

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Jashachris/DIrect-Message.git
cd DIrect-Message
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/direct-message
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

5. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

6. Start the application:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

7. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Messages

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user_id",
  "content": "Hello, how are you?"
}
```

#### Get Conversation
```http
GET /api/messages/conversation/:userId
Authorization: Bearer <token>
```

#### Get All Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

#### Get Users List
```http
GET /api/messages/users
Authorization: Bearer <token>
```

#### Mark Message as Read
```http
PATCH /api/messages/:messageId/read
Authorization: Bearer <token>
```

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Project Structure

```
DIrect-Message/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── messageController.js   # Messaging logic
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Message.js             # Message schema
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   └── messages.js            # Message routes
│   └── server.js                  # Express server setup
├── public/
│   ├── index.html                 # Frontend HTML
│   ├── styles.css                 # Frontend CSS
│   └── app.js                     # Frontend JavaScript
├── tests/
│   ├── auth.test.js               # Authentication tests
│   └── messages.test.js           # Messaging tests
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── jest.config.js                 # Jest configuration
├── package.json                   # Project dependencies
└── README.md                      # Documentation
```

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Browse Users**: View list of all registered users
4. **Select User**: Click on a user to start a conversation
5. **Send Messages**: Type your message and click Send or press Enter
6. **View Messages**: Messages auto-refresh every 3 seconds

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens for secure authentication
- Protected API routes requiring authentication
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## License

ISC

## Author

Jashachris