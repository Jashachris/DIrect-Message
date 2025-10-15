# DIrect-Message

A simple, lightweight direct messaging system built in Python.

## Features

- Send direct messages between users
- View inbox (all messages or unread only)
- View conversations between two users
- Mark messages as read
- Persistent message storage using JSON
- Command-line interface (CLI)

## Installation

No external dependencies required! Just Python 3.6+

```bash
git clone https://github.com/Jashachris/DIrect-Message.git
cd DIrect-Message
```

## Usage

### Command Line Interface

The application provides a simple CLI for interacting with the messaging system.

#### Send a Message

```bash
python3 cli.py send <sender> <recipient> "<message>"
```

Example:
```bash
python3 cli.py send alice bob "Hello Bob, how are you?"
```

#### View Inbox

```bash
python3 cli.py inbox <username>
```

View only unread messages:
```bash
python3 cli.py inbox <username> --unread
```

Example:
```bash
python3 cli.py inbox bob
python3 cli.py inbox bob --unread
```

#### View Conversation

```bash
python3 cli.py conversation <user1> <user2>
```

Example:
```bash
python3 cli.py conversation alice bob
```

#### Mark Message as Read

```bash
python3 cli.py mark-read <recipient> <timestamp>
```

Example:
```bash
python3 cli.py mark-read bob "2024-01-01T12:00:00.000000"
```

### Python API

You can also use the messaging system programmatically:

```python
from direct_message import DirectMessageSystem

# Initialize the system
dm = DirectMessageSystem()

# Send a message
message = dm.send_message("alice", "bob", "Hello Bob!")

# Get inbox
inbox = dm.get_inbox("bob")
for msg in inbox:
    print(f"From {msg.sender}: {msg.content}")

# Get conversation
conversation = dm.get_conversation("alice", "bob")

# Mark as read
dm.read_message("bob", message.timestamp)
```

## Running Tests

Run the test suite to verify everything is working:

```bash
python3 -m unittest test_direct_message.py
```

Or run with verbose output:

```bash
python3 -m unittest test_direct_message.py -v
```

## Data Storage

Messages are stored in a `messages.json` file in the current directory. The file is created automatically on first use.

## Architecture

- `direct_message.py`: Core messaging classes (Message, MessageStore, DirectMessageSystem)
- `cli.py`: Command-line interface
- `test_direct_message.py`: Comprehensive test suite
- `messages.json`: Message storage (created automatically)

## Example Workflow

```bash
# Alice sends a message to Bob
python3 cli.py send alice bob "Hi Bob! Want to grab lunch?"

# Bob sends a reply to Alice
python3 cli.py send bob alice "Sure Alice! How about 12:30?"

# Alice checks her inbox
python3 cli.py inbox alice

# View the full conversation
python3 cli.py conversation alice bob
```

## License

MIT License
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
