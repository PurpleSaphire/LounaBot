const { get } = require('axios');
const fs = require('fs');
const path = require('path');

let url = "https://ai-tools.replit.app";
let f = path.join(__dirname, 'cache', 'pixart.png');

module.exports = {
  config: {
    name: "pxart",
    aliases: [],
    author: "kshitiz || Deku",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "generate an image"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "[prompt | style]"
    }
  },
  onStart: async function({api, event, args, message }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    function r(msg) {
      message.reply(msg);
    }

    let g = `•——[Style list]——•\n\n1. Cinematic\n2. Photographic\n3. Anime\n4. Manga\n5. Digital Art\n6. Pixel art\n7. Fantasy art\n8. Neonpunk\n9. 3D Model`;

    if (!args[0]) return r('Missing prompt and style\n\n' + g);

    const [prompt, style] = args.join(" ").split("|").map(item => item.trim());

    if (!prompt) return r('Missing prompt!');
    if (!style) return r('Missing style!\n\n' + g);

    try {
      // Vérifier et créer le répertoire cache
      let cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Récupérer l'image à partir de l'URL
      const { data } = await get(`${url}/pixart?prompt=${prompt}&styles=${style}`, { responseType: 'arraybuffer' });

      // Écrire l'image dans le fichier pixart.png
      fs.writeFileSync(f, Buffer.from(data, "utf8"));

      // Répondre avec l'image en tant que pièce jointe
      return message.reply({ attachment: fs.createReadStream(f, () => fs.unlinkSync(f)) });
    } catch (e) {
      return message.reply(e.message);
    }
  }
};
