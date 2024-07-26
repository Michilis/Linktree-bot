require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const TelegramBot = require('node-telegram-bot-api');
const messages = require('./messages');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Linktree Bot Web App');
});

// User profile routes
app.post('/profile', async (req, res) => {
  const { username, links } = req.body;
  try {
    await pool.query('INSERT INTO profiles (username, links) VALUES ($1, $2)', [username, JSON.stringify(links)]);
    res.status(201).send(messages.profileCreated);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.put('/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { links } = req.body;
  try {
    await pool.query('UPDATE profiles SET links = $1 WHERE username = $2', [JSON.stringify(links), username]);
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
    const result = await pool.query('SELECT links FROM profiles WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const links = JSON.parse(result.rows[0].links);
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
    const result = await pool.query('SELECT links FROM profiles WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const links = JSON.parse(result.rows[0].links);
      links.push({ name, url });
      await pool.query('UPDATE profiles SET links = $1 WHERE username = $2', [JSON.stringify(links), username]);
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
    const result = await pool.query('SELECT links FROM profiles WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      let links = JSON.parse(result.rows[0].links);
      links = links.filter(link => link.name !== name);
      await pool.query('UPDATE profiles SET links = $1 WHERE username = $2', [JSON.stringify(links), username]);
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
    await pool.query('UPDATE profiles SET public = true WHERE username = $1', [username]);
    bot.sendMessage(chatId, messages.profilePublic);
  } catch (error) {
    bot.sendMessage(chatId, `Error: ${error.toString()}`);
  }
});

bot.onText(/\/setprivate/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    await pool.query('UPDATE profiles SET public = false WHERE username = $1', [username]);
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
