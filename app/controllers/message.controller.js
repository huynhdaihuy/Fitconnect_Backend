const Message = require("../models/message.model");
var ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

exports.createMessage = async function (req, res) {
  try {
    const { sender_id, receiver_id, content } = req.body;

    if (!ObjectId.isValid(sender_id) || !ObjectId.isValid(receiver_id)) {
      return res
        .status(400)
        .json({ error: "Invalid sender_id or receiver_id" });
    }

    const saltRounds = 10;
    const encryptedContent = await bcrypt.hash(content, saltRounds);

    const message = new Message({
      sender_id,
      receiver_id,
      content,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

exports.getListLatestMessageBySender = async function (req, res) {
  const senderId = req.params.sender_id;

  if (!ObjectId.isValid(senderId)) {
    return res.status(400).json({ error: "Invalid sender_id" });
  }

  try {
    const latestMessages = await Message.aggregate([
      {
        $match: {
          sender_id: ObjectId(senderId),
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by createdAt in descending order (newest to oldest)
      },
      {
        $group: {
          _id: "$receiver_id",
          latestMessage: { $first: "$$ROOT" }, // Get the first message in each group (the latest)
        },
      },
      {
        $project: {
          _id: "$_id",
          latestMessage: 1,
        },
      },
    ]);

    const formattedResult = latestMessages.map(({ _id, latestMessage }) => ({
      receiver_id: _id,
      latest_message: latestMessage,
    }));

    res.json(formattedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllMessagesBetweenUsers = async function (req, res) {
  const senderId = req.params.sender_id;
  const receiverId = req.params.receiver_id;

  if (
    !ObjectId.isValid(senderId) ||
    !ObjectId.isValid(receiverId)
  ) {
    return res.status(400).json({ error: "Invalid sender_id or receiver_id" });
  }

  try {
    const messages = await Message.find({
      $or: [
        {
          sender_id: ObjectId(senderId),
          receiver_id: ObjectId(receiverId),
        },
        {
          sender_id: ObjectId(receiverId),
          receiver_id: ObjectId(senderId),
        },
      ],
    }).sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteMessage = async function (req, res) {
  try {
    const senderId = req.params.sender_id;
    const deletedMessage = await Message.findByIdAndDelete(senderId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete certification" });
  }
};
