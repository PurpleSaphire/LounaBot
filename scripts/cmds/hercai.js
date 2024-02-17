const axios = require("axios");

module.exports = {
  config: {
    name: "HercAI",
    aliases: ['hercai'],
    version: "1.0",
    author: "Xyron Chen | Ace",
    countDown: 10,
    role: 0,
    shortDescription: {
      vi: "",
      en: "Ask HercAI anything."
    },
    longDescription: {
      vi: "",
      en: "Ask Anything you want on HercAI."
    },
    category: "ai - chat",
    guide: {
      en: "   {pn} <prompt>"
    }
  },
  
  onStart: async function({ message, event, args, commandName }) {
    const prompt = args.join(' ');

    try {
      const ace = await message.reply(`Hercai répond... Patientez un instant.`);
      message.reaction("🤔", event.messageID, () => {}, true);
      message.reaction("💜", ace.messageID, () => {}, true);

      const response = await axios.get(
        `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(prompt)}&model=v3`
      );

      if (response.data && response.data.reply) {
        const answer = response.data.reply;
        const sagot = `Herc ( AI )\n\n${answer}`;
        message.reply({ body: sagot }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      } 
      message.unsend(ace.messageID);

    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function({ message, event, Reply, args }) {
    let { author, commandName } = Reply;
    if (event.senderID != author) return;
    const text = args.join(' ');
    try {
      const hintay = await message.send(`Hercai répond... Patientez un instant.`);
      message.reaction("🤔", event.messageID, () => {}, true);
      message.reaction("💜", hintay.messageID, () => {}, true);
      const response = await axios.get(
        `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(text)}&model=v3`
      );

      if (response.data && response.data.reply) {
        const answer = response.data.reply;
        const sagot2 = `Herc ( AI )\n\n${answer}`;
        message.reply({ body: sagot2 }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      }
      message.unsend(hintay.messageID);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
