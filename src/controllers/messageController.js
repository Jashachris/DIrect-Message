const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    // Validation
    if (!recipientId || !content) {
      return res.status(400).json({ error: 'Recipient and content are required' });
    }
    
    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    // Cannot send message to yourself
    if (recipientId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }
    
    // Create message
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content: content.trim()
    });
    
    await message.save();
    
    // Populate sender and recipient info
    await message.populate('sender', 'username email');
    await message.populate('recipient', 'username email');
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get all messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: userId },
        { sender: userId, recipient: req.userId }
      ]
    })
    .populate('sender', 'username email')
    .populate('recipient', 'username email')
    .sort({ createdAt: 1 });
    
    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const getConversations = async (req, res) => {
  try {
    // Get all users the current user has conversed with
    const messages = await Message.find({
      $or: [
        { sender: req.userId },
        { recipient: req.userId }
      ]
    })
    .populate('sender', 'username email')
    .populate('recipient', 'username email')
    .sort({ createdAt: -1 });
    
    // Extract unique conversation partners
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === req.userId.toString() 
        ? msg.recipient._id.toString()
        : msg.sender._id.toString();
      
      if (!conversationMap.has(partnerId)) {
        const partner = msg.sender._id.toString() === req.userId.toString()
          ? msg.recipient
          : msg.sender;
        
        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: msg
        });
      }
    });
    
    const conversations = Array.from(conversationMap.values());
    
    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Only recipient can mark as read
    if (message.recipient.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    message.read = true;
    await message.save();
    
    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('username email createdAt')
      .sort({ username: 1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUsers
};
