require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const messages = require('./messages');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
db.initDb();

app.get('/', (req, res) => {
  res.send('Linktree Bot Web App');
});

// User profile routes
app.post('/profile', async (req, res) => {
  const { username, links } = req.body;
  try {
    await db.insertProfile(username, links);
    res.status(201).send(messages.profileCreated);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.put('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { links } = req.body;
  try {
    await db.updateProfile(username, links);
    res.status(200).send(messages.profileUpdated);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.welcome);
});

bot.onText(/\/linktree(@\w+)?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1] ? match[1].slice(1) : msg.from.username;

  try {
    const profile = await db.getProfileByUsername(username);
    if (profile) {
      const links = JSON.parse(profile.links);
      const linkButtons = links.map(link => ({ text: link.name, url: link.url }));
      bot.sendMessage(chatId, `${username}'s Linktree`, {
        reply_markup: {
          inline_keyboard: [linkButtons]
        }
      });
    } else {
      bot.sendMessage(chatId, messages.noProfileFound);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/addlink (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];
  const url = match[2];
  const username = msg.from.username;

  try {
    const profile = await db.getProfileByUsername(username);
    if (profile) {
      const links = JSON.parse(profile.links);
      links.push({ name, url });
      await db.updateProfile(username, links);
      bot.sendMessage(chatId, messages.linkAdded);
    } else {
      bot.sendMessage(chatId, messages.noProfileFound);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/removelink (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];
  const username = msg.from.username;

  try {
    const profile = await db.getProfileByUsername(username);
    if (profile) {
      let links = JSON.parse(profile.links);
      links = links.filter(link => link.name !== name);
      await db.updateProfile(username, links);
      bot.sendMessage(chatId, messages.linkRemoved);
    } else {
      bot.sendMessage(chatId, messages.noProfileFound);
    }
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/setpublic/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    await db.setProfilePublic(username);
    bot.sendMessage(chatId, messages.profilePublic);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/setprivate/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    await db.setProfilePrivate(username);
    bot.sendMessage(chatId, messages.profilePrivate);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/analytics/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  // Placeholder for analytics data
  const analyticsData = `
  Total Clicks: 100
  Unique Visitors: 50
  Most Popular Link: Twitter
  `;

  bot.sendMessage(chatId, analyticsData);
});

bot.onText(/\/customize/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, messages.customize);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.help);
});
