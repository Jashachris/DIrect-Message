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