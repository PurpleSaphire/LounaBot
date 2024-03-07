const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "anima",
    aliases: [],
    author: "MarianCross",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image.",
    longDescription: "Generates an image.",
    category: "fun",
    guide: "{p}anima <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    let waitMessageID;
    try {
      // Envoyer une réaction "✅" sur le message de l'utilisateur pour montrer que la requête a été reçue
      api.setMessageReaction("✅", event.messageID);

      const prompt = args.join(" ");
      const emiApiUrl = "https://ai-tools.replit.app/emi";

      // Envoyer un message pour indiquer que la génération est en cours
      const waitMessage = await api.sendMessage("Veillez patienter... 🔮", event.threadID);
      waitMessageID = waitMessage.messageID;

      // Générer quatre images
      const imagePaths = [];
      for (let i = 0; i < 4; i++) {
        const emiResponse = await axios.get(emiApiUrl, {
          params: { prompt },
          responseType: "arraybuffer"
        });
        const imagePath = path.join(__dirname, `/cache/${Date.now()}_${i}_generated_image.png`);
        fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));
        imagePaths.push(imagePath);
      }

      // Supprimer le message de patience
      await api.deleteMessage(waitMessageID);

      // Envoyer un message avec les images et le nombre de secondes
      const seconds = 4; // Changer ici le nombre de secondes
      const messageText = `Voici vos images 🏮 (${seconds} secondes)`;
      api.sendMessage({
        body: messageText,
        attachment: imagePaths.map(imagePath => fs.createReadStream(imagePath))
      }, event.threadID);

    } catch (error) {
      console.error("Error:", error);
      if (waitMessageID) {
        // Supprimer le message de patience en cas d'erreur
        await api.deleteMessage(waitMessageID);
      }
      // Envoyer une réaction "❎" en cas d'échec ou d'erreur
      api.setMessageReaction("❎", event.messageID);
      message.reply("❌ | Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
  }
};
