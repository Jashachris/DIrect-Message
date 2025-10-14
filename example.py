#!/usr/bin/env python3
"""
Example usage of the DIrect Message Python API
"""

from direct_message import DirectMessageSystem


def main():
    """Demonstrate the messaging system"""
    
    # Initialize the system with a custom storage file
    dm = DirectMessageSystem('example_messages.json')
    
    print("=== DIrect Message Example ===\n")
    
    # Send some messages
    print("Sending messages...")
    msg1 = dm.send_message("alice", "bob", "Hey Bob! Want to grab coffee?")
    print(f"✓ Alice → Bob: '{msg1.content}'")
    
    msg2 = dm.send_message("bob", "alice", "Sure! How about 3pm?")
    print(f"✓ Bob → Alice: '{msg2.content}'")
    
    msg3 = dm.send_message("alice", "bob", "Perfect! See you then.")
    print(f"✓ Alice → Bob: '{msg3.content}'")
    
    msg4 = dm.send_message("charlie", "bob", "Bob, need your help with the project.")
    print(f"✓ Charlie → Bob: '{msg4.content}'")
    
    # Check Bob's inbox
    print("\n--- Bob's Inbox ---")
    bob_inbox = dm.get_inbox("bob")
    for msg in bob_inbox:
        status = "📩 [NEW]" if not msg.read else "📭 [READ]"
        print(f"{status} From {msg.sender}: {msg.content}")
    
    # View conversation between Alice and Bob
    print("\n--- Conversation: Alice ↔ Bob ---")
    conversation = dm.get_conversation("alice", "bob")
    for msg in conversation:
        arrow = "→" if msg.sender == "alice" else "←"
        print(f"[{msg.timestamp[:19]}] {msg.sender} {arrow} {msg.content}")
    
    # Mark a message as read
    print(f"\n✓ Marking message from Alice as read...")
    dm.read_message("bob", msg1.timestamp)
    
    # Check unread messages
    print("\n--- Bob's Unread Messages ---")
    unread = dm.get_inbox("bob", unread_only=True)
    if unread:
        for msg in unread:
            print(f"📩 From {msg.sender}: {msg.content}")
    else:
        print("No unread messages!")
    
    print("\n=== Example Complete ===")


if __name__ == '__main__':
    main()
