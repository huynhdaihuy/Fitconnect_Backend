const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

router.post('/', messageController.createMessage);

router.get('/detail_message/:sender_id&:receiver_id', messageController.getAllMessagesBetweenUsers);
router.get('/:sender_id', messageController.getListLatestMessageBySender);
router.delete('/:sender_id', messageController.deleteMessage);


module.exports = router;