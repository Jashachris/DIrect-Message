"""
DIrect Message - A simple direct messaging system
"""

import json
import os
from datetime import datetime
from typing import List, Dict, Optional


class Message:
    """Represents a single direct message"""
    
    def __init__(self, sender: str, recipient: str, content: str, timestamp: str = None):
        self.sender = sender
        self.recipient = recipient
        self.content = content
        self.timestamp = timestamp or datetime.now().isoformat()
        self.read = False
    
    def to_dict(self) -> Dict:
        """Convert message to dictionary for storage"""
        return {
            'sender': self.sender,
            'recipient': self.recipient,
            'content': self.content,
            'timestamp': self.timestamp,
            'read': self.read
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Message':
        """Create message from dictionary"""
        msg = cls(data['sender'], data['recipient'], data['content'], data['timestamp'])
        msg.read = data.get('read', False)
        return msg
    
    def __repr__(self):
        return f"Message(from={self.sender}, to={self.recipient}, at={self.timestamp})"


class MessageStore:
    """Handles storage and retrieval of messages"""
    
    def __init__(self, storage_file: str = 'messages.json'):
        self.storage_file = storage_file
        self._ensure_storage_exists()
    
    def _ensure_storage_exists(self):
        """Create storage file if it doesn't exist"""
        if not os.path.exists(self.storage_file):
            with open(self.storage_file, 'w') as f:
                json.dump([], f)
    
    def save_message(self, message: Message):
        """Save a message to storage"""
        messages = self._load_all_messages()
        messages.append(message.to_dict())
        with open(self.storage_file, 'w') as f:
            json.dump(messages, f, indent=2)
    
    def _load_all_messages(self) -> List[Dict]:
        """Load all messages from storage"""
        with open(self.storage_file, 'r') as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    
    def get_messages_for_user(self, username: str, unread_only: bool = False) -> List[Message]:
        """Get all messages for a specific user"""
        all_messages = self._load_all_messages()
        user_messages = []
        
        for msg_data in all_messages:
            if msg_data['recipient'] == username:
                if unread_only and msg_data.get('read', False):
                    continue
                user_messages.append(Message.from_dict(msg_data))
        
        return user_messages
    
    def mark_message_as_read(self, recipient: str, timestamp: str):
        """Mark a specific message as read"""
        messages = self._load_all_messages()
        
        for msg in messages:
            if msg['recipient'] == recipient and msg['timestamp'] == timestamp:
                msg['read'] = True
                break
        
        with open(self.storage_file, 'w') as f:
            json.dump(messages, f, indent=2)
    
    def get_conversation(self, user1: str, user2: str) -> List[Message]:
        """Get all messages between two users"""
        all_messages = self._load_all_messages()
        conversation = []
        
        for msg_data in all_messages:
            if ((msg_data['sender'] == user1 and msg_data['recipient'] == user2) or
                (msg_data['sender'] == user2 and msg_data['recipient'] == user1)):
                conversation.append(Message.from_dict(msg_data))
        
        # Sort by timestamp
        conversation.sort(key=lambda m: m.timestamp)
        return conversation


class DirectMessageSystem:
    """Main direct messaging system"""
    
    def __init__(self, storage_file: str = 'messages.json'):
        self.store = MessageStore(storage_file)
        self.users = {}  # Simple in-memory user store
    
    def register_user(self, username: str):
        """Register a new user"""
        if username in self.users:
            raise ValueError(f"User '{username}' already exists")
        self.users[username] = {'username': username}
        return True
    
    def send_message(self, sender: str, recipient: str, content: str) -> Message:
        """Send a direct message from sender to recipient"""
        if not content.strip():
            raise ValueError("Message content cannot be empty")
        
        message = Message(sender, recipient, content)
        self.store.save_message(message)
        return message
    
    def get_inbox(self, username: str, unread_only: bool = False) -> List[Message]:
        """Get inbox for a user"""
        return self.store.get_messages_for_user(username, unread_only)
    
    def read_message(self, recipient: str, timestamp: str):
        """Mark a message as read"""
        self.store.mark_message_as_read(recipient, timestamp)
    
    def get_conversation(self, user1: str, user2: str) -> List[Message]:
        """Get conversation between two users"""
        return self.store.get_conversation(user1, user2)
