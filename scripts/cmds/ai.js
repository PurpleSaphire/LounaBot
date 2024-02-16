const axios = require('axios');

const Prefixes = [
  '.ai',
  'bot',
  'solys',
  '+ai',
  'Moon',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {
      
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("𝐒𝐚𝐥𝐮𝐭 ! 𝐉𝐞 𝐬𝐮𝐢𝐬 𝐋𝐮𝐧𝐚 𝐀𝐢, 𝐮𝐧𝐞 𝐢𝐧𝐭𝐞𝐥𝐥𝐢𝐠𝐞𝐧𝐜𝐞 𝐚𝐫𝐭𝐢𝐟𝐢𝐜𝐢𝐞𝐥𝐥𝐞. 🌙. 𝘜𝘭𝘪𝘴𝘦𝘳 𝘭𝘦 𝘮𝘰𝘵 𝗔𝗶 𝘦𝘯 𝘥𝘦𝘣𝘶𝘵 𝘥𝘦 𝘱𝘩𝘳𝘢𝘴𝘦 𝘱𝘰𝘶𝘳 𝘮𝘦 𝘱𝘰𝘴𝘦𝘳 𝘷𝘰𝘴 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯𝘴.");
        return;
      }

await message.reply("💬 | Veuillez Patientez s'il-vous-plaît...");

      const response = await axios.get(`https://sandipapi.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply(answer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
