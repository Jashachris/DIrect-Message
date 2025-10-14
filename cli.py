#!/usr/bin/env python3
"""
CLI interface for DIrect Message system
"""

import sys
import argparse
from direct_message import DirectMessageSystem


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description='DIrect Message - A simple direct messaging system'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Send message command
    send_parser = subparsers.add_parser('send', help='Send a direct message')
    send_parser.add_argument('sender', help='Username of sender')
    send_parser.add_argument('recipient', help='Username of recipient')
    send_parser.add_argument('message', help='Message content')
    
    # Read inbox command
    inbox_parser = subparsers.add_parser('inbox', help='Read inbox')
    inbox_parser.add_argument('username', help='Username to check inbox for')
    inbox_parser.add_argument('--unread', action='store_true', help='Show only unread messages')
    
    # Read conversation command
    conversation_parser = subparsers.add_parser('conversation', help='View conversation between two users')
    conversation_parser.add_argument('user1', help='First user')
    conversation_parser.add_argument('user2', help='Second user')
    
    # Mark as read command
    read_parser = subparsers.add_parser('mark-read', help='Mark a message as read')
    read_parser.add_argument('recipient', help='Recipient username')
    read_parser.add_argument('timestamp', help='Message timestamp')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize the messaging system
    dm_system = DirectMessageSystem()
    
    try:
        if args.command == 'send':
            message = dm_system.send_message(args.sender, args.recipient, args.message)
            print(f"✓ Message sent from {args.sender} to {args.recipient}")
            print(f"  Timestamp: {message.timestamp}")
        
        elif args.command == 'inbox':
            messages = dm_system.get_inbox(args.username, args.unread)
            if not messages:
                status = "unread " if args.unread else ""
                print(f"No {status}messages in inbox for {args.username}")
            else:
                print(f"Inbox for {args.username}:")
                print("-" * 60)
                for msg in messages:
                    status = "📩" if not msg.read else "📭"
                    print(f"{status} From: {msg.sender}")
                    print(f"  Time: {msg.timestamp}")
                    print(f"  Message: {msg.content}")
                    print("-" * 60)
        
        elif args.command == 'conversation':
            messages = dm_system.get_conversation(args.user1, args.user2)
            if not messages:
                print(f"No conversation found between {args.user1} and {args.user2}")
            else:
                print(f"Conversation between {args.user1} and {args.user2}:")
                print("=" * 60)
                for msg in messages:
                    print(f"[{msg.timestamp}] {msg.sender}: {msg.content}")
                print("=" * 60)
        
        elif args.command == 'mark-read':
            dm_system.read_message(args.recipient, args.timestamp)
            print(f"✓ Message marked as read")
    
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
