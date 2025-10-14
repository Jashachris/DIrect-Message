const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUsers
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All message routes require authentication
router.use(auth);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);
router.patch('/:messageId/read', markAsRead);
router.get('/users', getUsers);

module.exports = router;
