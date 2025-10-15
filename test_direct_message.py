"""
Tests for DIrect Message system
"""

import unittest
import os
import json
import tempfile
from datetime import datetime
from direct_message import Message, MessageStore, DirectMessageSystem


class TestMessage(unittest.TestCase):
    """Tests for Message class"""
    
    def test_message_creation(self):
        """Test creating a message"""
        msg = Message("alice", "bob", "Hello Bob!")
        self.assertEqual(msg.sender, "alice")
        self.assertEqual(msg.recipient, "bob")
        self.assertEqual(msg.content, "Hello Bob!")
        self.assertFalse(msg.read)
        self.assertIsNotNone(msg.timestamp)
    
    def test_message_to_dict(self):
        """Test converting message to dictionary"""
        msg = Message("alice", "bob", "Test message")
        msg_dict = msg.to_dict()
        
        self.assertEqual(msg_dict['sender'], "alice")
        self.assertEqual(msg_dict['recipient'], "bob")
        self.assertEqual(msg_dict['content'], "Test message")
        self.assertFalse(msg_dict['read'])
        self.assertIn('timestamp', msg_dict)
    
    def test_message_from_dict(self):
        """Test creating message from dictionary"""
        data = {
            'sender': 'alice',
            'recipient': 'bob',
            'content': 'Test',
            'timestamp': '2024-01-01T12:00:00',
            'read': True
        }
        msg = Message.from_dict(data)
        
        self.assertEqual(msg.sender, "alice")
        self.assertEqual(msg.recipient, "bob")
        self.assertEqual(msg.content, "Test")
        self.assertEqual(msg.timestamp, '2024-01-01T12:00:00')
        self.assertTrue(msg.read)


class TestMessageStore(unittest.TestCase):
    """Tests for MessageStore class"""
    
    def setUp(self):
        """Create temporary storage file for tests"""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.store = MessageStore(self.temp_file.name)
    
    def tearDown(self):
        """Clean up temporary file"""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)
    
    def test_storage_file_creation(self):
        """Test that storage file is created"""
        self.assertTrue(os.path.exists(self.temp_file.name))
    
    def test_save_message(self):
        """Test saving a message"""
        msg = Message("alice", "bob", "Hello!")
        self.store.save_message(msg)
        
        # Verify message was saved
        with open(self.temp_file.name, 'r') as f:
            messages = json.load(f)
        
        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0]['sender'], "alice")
        self.assertEqual(messages[0]['recipient'], "bob")
    
    def test_get_messages_for_user(self):
        """Test retrieving messages for a user"""
        msg1 = Message("alice", "bob", "Hi Bob!")
        msg2 = Message("charlie", "bob", "Hey Bob!")
        msg3 = Message("bob", "alice", "Hi Alice!")
        
        self.store.save_message(msg1)
        self.store.save_message(msg2)
        self.store.save_message(msg3)
        
        bob_messages = self.store.get_messages_for_user("bob")
        self.assertEqual(len(bob_messages), 2)
        
        alice_messages = self.store.get_messages_for_user("alice")
        self.assertEqual(len(alice_messages), 1)
    
    def test_get_unread_messages(self):
        """Test retrieving only unread messages"""
        msg1 = Message("alice", "bob", "Message 1")
        msg2 = Message("alice", "bob", "Message 2")
        
        self.store.save_message(msg1)
        self.store.save_message(msg2)
        
        # Mark one as read
        self.store.mark_message_as_read("bob", msg1.timestamp)
        
        unread = self.store.get_messages_for_user("bob", unread_only=True)
        self.assertEqual(len(unread), 1)
        self.assertEqual(unread[0].content, "Message 2")
    
    def test_mark_message_as_read(self):
        """Test marking a message as read"""
        msg = Message("alice", "bob", "Test")
        self.store.save_message(msg)
        
        self.store.mark_message_as_read("bob", msg.timestamp)
        
        messages = self.store.get_messages_for_user("bob")
        self.assertTrue(messages[0].read)
    
    def test_get_conversation(self):
        """Test retrieving conversation between two users"""
        msg1 = Message("alice", "bob", "Hi Bob!")
        msg2 = Message("bob", "alice", "Hi Alice!")
        msg3 = Message("charlie", "bob", "Hey Bob!")
        msg4 = Message("alice", "bob", "How are you?")
        
        self.store.save_message(msg1)
        self.store.save_message(msg2)
        self.store.save_message(msg3)
        self.store.save_message(msg4)
        
        conversation = self.store.get_conversation("alice", "bob")
        self.assertEqual(len(conversation), 3)
        
        # Check conversation doesn't include charlie's message
        senders = [msg.sender for msg in conversation]
        self.assertNotIn("charlie", senders)


class TestDirectMessageSystem(unittest.TestCase):
    """Tests for DirectMessageSystem class"""
    
    def setUp(self):
        """Create temporary storage for tests"""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.dm_system = DirectMessageSystem(self.temp_file.name)
    
    def tearDown(self):
        """Clean up temporary file"""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)
    
    def test_register_user(self):
        """Test user registration"""
        result = self.dm_system.register_user("alice")
        self.assertTrue(result)
        self.assertIn("alice", self.dm_system.users)
    
    def test_register_duplicate_user(self):
        """Test registering duplicate user raises error"""
        self.dm_system.register_user("alice")
        with self.assertRaises(ValueError):
            self.dm_system.register_user("alice")
    
    def test_send_message(self):
        """Test sending a message"""
        msg = self.dm_system.send_message("alice", "bob", "Hello!")
        
        self.assertEqual(msg.sender, "alice")
        self.assertEqual(msg.recipient, "bob")
        self.assertEqual(msg.content, "Hello!")
    
    def test_send_empty_message(self):
        """Test sending empty message raises error"""
        with self.assertRaises(ValueError):
            self.dm_system.send_message("alice", "bob", "")
        
        with self.assertRaises(ValueError):
            self.dm_system.send_message("alice", "bob", "   ")
    
    def test_get_inbox(self):
        """Test getting inbox"""
        self.dm_system.send_message("alice", "bob", "Message 1")
        self.dm_system.send_message("charlie", "bob", "Message 2")
        
        inbox = self.dm_system.get_inbox("bob")
        self.assertEqual(len(inbox), 2)
    
    def test_get_empty_inbox(self):
        """Test getting empty inbox"""
        inbox = self.dm_system.get_inbox("alice")
        self.assertEqual(len(inbox), 0)
    
    def test_read_message(self):
        """Test marking message as read"""
        msg = self.dm_system.send_message("alice", "bob", "Test")
        self.dm_system.read_message("bob", msg.timestamp)
        
        inbox = self.dm_system.get_inbox("bob", unread_only=True)
        self.assertEqual(len(inbox), 0)
    
    def test_get_conversation(self):
        """Test getting conversation"""
        self.dm_system.send_message("alice", "bob", "Hi!")
        self.dm_system.send_message("bob", "alice", "Hello!")
        
        conversation = self.dm_system.get_conversation("alice", "bob")
        self.assertEqual(len(conversation), 2)


if __name__ == '__main__':
    unittest.main()
