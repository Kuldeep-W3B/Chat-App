const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const ws = require('ws');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is required for hashing
const mongoose = require('mongoose');
const { jwtSecret } = require('./config/keys');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
const { getUserDataFromRequest } = require('./middleware/authMiddleware');
const Message = require('./models/Message'); // Ensure Message model is imported

dotenv.config();
require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use(authRoutes);
app.use(profileRoutes);
app.use(messageRoutes);
app.use(userRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  function notifyAboutOnlinePeople() {
    const onlinePeople = [...wss.clients].map(c => ({ userId: c.userId, username: c.username }));
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ online: onlinePeople }));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('Connection terminated due to inactivity');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
          if (err) {
            console.error('JWT verification error:', err);
            return;
          }
          connection.userId = userData.userId;
          connection.username = userData.username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;

    if (file) {
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = `${Date.now()}.${ext}`;
      const path = `${__dirname}/uploads/${filename}`;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');

      fs.writeFile(path, bufferData, (err) => {
        if (err) {
          console.error('File save error:', err);
        } else {
          console.log(`File saved: ${path}`);
        }
      });
    }

    if (recipient && (text || file)) {
      try {
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          file: file ? filename : null,
        });
        console.log('Created message');

        [...wss.clients]
          .filter(c => c.userId === recipient)
          .forEach(c => c.send(JSON.stringify({
            text,
            sender: connection.userId,
            recipient,
            file: file ? filename : null,
            _id: messageDoc._id,
          })));
      } catch (err) {
        console.error('Message creation error:', err);
      }
    }
  });

  notifyAboutOnlinePeople();
});
