# DIrect-Message

A simple and elegant direct messaging application with user profile image upload functionality.

## Features

- 👤 User management (create users, view user profiles)
- 📸 Profile image upload for users
- 💬 Direct messaging between users
- 🎨 Beautiful and responsive UI
- 💾 SQLite database for data persistence
- ✅ Comprehensive API testing

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **File Upload**: Multer
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Jashachris/DIrect-Message.git
cd DIrect-Message
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Development

To run the server in development mode with auto-restart:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
npm test
```

## API Endpoints

### Users

- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get a specific user
- **POST** `/api/users` - Create a new user
  - Body: `{ "username": "string" }`
- **POST** `/api/users/:id/upload-image` - Upload profile image
  - Form data: `profileImage` (file)

### Messages

- **POST** `/api/messages` - Send a message
  - Body: `{ "sender_id": number, "receiver_id": number, "message": "string" }`
- **GET** `/api/messages/:userId1/:userId2` - Get messages between two users

### Health

- **GET** `/api/health` - Check server health

## Usage

### Creating Users

1. Enter a username in the "Create User" section
2. Click "Create User" button

### Uploading Profile Images

1. Select a user from the dropdown
2. Choose an image file (JPEG, PNG, or GIF, max 5MB)
3. Click "Upload Image"

### Sending Messages

1. Select a sender from the "From" dropdown
2. Select a receiver from the "To" dropdown
3. Type your message in the text area
4. Click "Send Message" or press Enter

### Viewing Conversations

1. Select two users in the messaging section
2. Click "Load Messages" to view the conversation

## File Structure

```
DIrect-Message/
├── public/              # Frontend files
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styles
│   └── app.js          # Frontend JavaScript
├── uploads/            # Uploaded profile images (created automatically)
├── server.js           # Express server and API
├── server.test.js      # API tests
├── package.json        # Project dependencies
├── messages.db         # SQLite database (created automatically)
└── README.md          # This file
```

## Image Upload Specifications

- **Supported formats**: JPEG, JPG, PNG, GIF
- **Maximum file size**: 5MB
- **Storage**: Images are stored in the `uploads/` directory
- **Old images**: When a user uploads a new profile image, the old one is automatically deleted

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC