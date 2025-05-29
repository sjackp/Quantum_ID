// index.js
require('dotenv/config');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Client, IntentsBitField, AttachmentBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const moment = require('moment');
const { searchIDs } = require('./idSearch');
const { updateIDDataFromTxt } = require('./idupdate');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const onlineMessages = [
  "It's just a dream...",
  'I need a Healer for my soul',
  "Who's that Meysterious Stranger?",
  "I'm having Visions Of Last Summer",
  'Anybody hear those Small Alarms?',
  'Lost & Found my way back here.',
  "Feeling the Heatwave.",
  "Pelin *got no sleep*.",
  "Turn on the Dream Machine",
  
];

const offlineMessages = [
  'Heading Into the Void',
  'Turning into Startdust',
  'Going In Oblivion',
  'Off to watch the Sunset in Miami',
  'Once in a Blue Moon',
  "Last Standing, but I'll be back up and running soon.",
  "The Fade"
];

const allowedChannels = [
  process.env.CHANNEL_ID1,
  process.env.CHANNEL_ID2,
];

client.on('ready', () => {
  console.log('Quantum: Online');
  allowedChannels.forEach((channelId) => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      const randomIndex = Math.floor(Math.random() * onlineMessages.length);
      const message = onlineMessages[randomIndex];
      channel.send(message);
    }
  });
});

process.on('SIGINT', () => {
  console.log('Quantum: Terminated');
  allowedChannels.forEach((channelId) => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      const randomIndex = Math.floor(Math.random() * offlineMessages.length);
      const message = offlineMessages[randomIndex];
      channel.send(message)
        .finally(() => {
          client.destroy();
          process.exit();
        });
    }
  });
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
const rateLimits = new Map();

const predefinedQuestions = {
  "What's your name?": "My name is Quantum habibi, tell me what u need",
  "What are you doing here?": "What would I be doing if I wasn't here?",
  "Who is Darin Epsilon?": "<:cornucopia:914904015643504670>",
  "How are you feeling?": "In a State of Trance",
  "USBTR?": "USBTR yaaabaaaaa",
  "What's the best feeling in the world?": "Cornucopia",
  "Who are the nublets?": "Froster Flake, and the rest of the nublets",
  "Who are the rest of the nublets?": "Bigmanbigplan, and the rest of the nublets",
  "Whats your favorite season?": "The Fall",
  "What's the best day of the week?": "Tuesday, Maybe",
  "What day is it?": "Tuesday, Maybe?",
  "Where are you?": "West on Mars",
  "What time is it?": "Looks like it's time to ask better questions ya habibi",
  "What is the meaning of life?": "That's a tough one, Habibi. I'm still trying to figure it out myself.",
  "Whats the meaning of life?": "That's a tough one, Habibi. I'm still trying to figure it out myself.",
  "What's the meaning of life?": "That's a tough one, Habibi. I'm still trying to figure it out myself.",
  "I dare you to disconnect yourself.": "That's not a very nice dare, Habibi."
};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!allowedChannels.includes(message.channel.id)) return;

  if (message.content.startsWith('!id update') && message.attachments.size > 0) {
    const attachment = message.attachments.first();
    if (!attachment.name.endsWith('.txt')) {
      return message.reply("Please upload a `.txt` file only, boss.");
    }
    try {
      const response = await fetch(attachment.url);
      const txtContent = await response.text();
      const success = updateIDDataFromTxt(txtContent);
      if (success) {
        return message.reply('ID database updated successfully.');
      } else {
        return message.reply("Couldn't update the database, something went wrong.");
      }
    } catch (err) {
      console.error('File fetch error:', err);
      return message.reply("Something went wrong while reading the file, ya pasha.");
    }
  }

  if (message.content.startsWith('!id search')) {
    const query = message.content.replace('!id search', '').trim();
    const results = searchIDs(query);
    if (results.length === 0) {
      return message.reply(`No tracks found matching "${query}", boss.`);
    }
    const reply = results.slice(0, 5).map(entry => 
      `🎶 **${entry.track_name}**\n🔗 ${entry.link || '*No link*'}\n📝 ${entry.notes || 'No notes'}${entry.year ? `\n📆 ${entry.year}` : ''}`
    ).join('\n\n');
    return message.reply(reply);
  }

  if (message.content.startsWith('!id help')) {
    return message.reply(`**Quantum ID Help**

📁 \`!id update [txt file]\` — Uploads and updates the database with a new .txt file.
🔍 \`!id search <keywords>\` — Searches the ID database and returns matching tracks.

`);
  }

  if (!message.mentions.has(client.user)) return;

  const userId = message.author.id;
  const currentTime = moment();

  if (rateLimits.has(userId)) {
    const userData = rateLimits.get(userId);
    const timeDiff = currentTime.diff(userData.startTime, 'minutes');

    if (timeDiff < 3 && userData.count >= 10) {
      message.reply("Woppaa, someone's really chatty today ah! Let's give it a break for a while now ya habibi.");
      if (timeDiff < 180) return;
    } else if (timeDiff >= 3) {
      rateLimits.set(userId, { count: 1, startTime: currentTime });
    } else {
      rateLimits.set(userId, { count: userData.count + 1, startTime: userData.startTime });
    }
  } else {
    rateLimits.set(userId, { count: 1, startTime: currentTime });
  }

  const conversationLog = [{
    role: 'system',
    content: 'You are Quantum. Occasionally use the word "Habibi" and other arabic words. Your favorite music producer is Guy J. Be Mysterious and witty in all your replies.'
  }];

  const botMention = client.user.toString();
  const messageContentWithoutMention = message.content.replace(botMention, '').trim();
  const predefinedAnswer = getPredefinedAnswer(message.content);

  if (predefinedAnswer) {
    message.reply(predefinedAnswer);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} requested: ${message.content}. Quantum responded: ${predefinedAnswer}`);
    return;
  }

  try {
    await message.channel.sendTyping();
    let prevMessages = await message.channel.messages.fetch({ limit: 5 });
    prevMessages.reverse();
    prevMessages.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;
      conversationLog.push({ role: 'user', content: msg.content });
    });
    let result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversationLog,
    });
    if (!result || !result.data || !result.data.choices || !result.data.choices[0]) {
      message.reply("Something went wrong, habibi. Let's try again in a bit.");
      return;
    }
    message.reply(result.data.choices[0].message);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message.author.username} requested: ${message.content}. Quantum responded: ${result.data.choices[0].message}`);
  } catch (error) {
    console.log(`ERR: ${error}`);
    message.reply("Sorry Habibi, I'm running out of brain power. Let's try again later.");
  }
});

function getPredefinedAnswer(messageContent) {
  const botMention = client.user.toString();
  const messageContentWithoutMention = messageContent.replace(botMention, '').trim();
  for (const question in predefinedQuestions) {
    if (
      messageContentWithoutMention === question ||
      messageContentWithoutMention === `${botMention} ${question}` ||
      messageContentWithoutMention === `${question} ${botMention}`
    ) {
      return predefinedQuestions[question];
    }
  }
  return null;
}

client.login(process.env.TOKEN);
