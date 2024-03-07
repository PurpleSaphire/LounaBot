const axios = require("axios");

const fs = require("fs-extra");

const path = require("path");

const KievRPSSecAuth = "FAB6BBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACA4aZB3OTexEOAS729HiWZGKt0LCe9J02wMiXLLlOdujQ6Zt6LlyB3kdF5aPhqPdAQiD0gps0sg4g8GRzzlSXDKT/VguYDDHg4Bd4yDsKLOSxe4+HkaB7Fa8PT/xcI4jPcU02ra4nldIyji9273t2XPZlcIWNgCSzDVgqn4EKVIPlgcfObq2C7f9u+ru3eO0xoOEu/htgDjWoz6d70yHj4lDcfOqULZymIp/LA46lEkIDE3X2uLmn/MSY/JQwCVDgcwN0vjsteWsv0bNq/NVvXPiwR8AlNddK5cQhK/+8bxIJiSbEhBEueaq5Z5rsXfVzQ66d9k7GC50fx2n0OtzabuJHf/96cZKt0ulL4h4w7sqKR4VUVUYx48UudsK4VLyS8cbnyWTpXkSHviPGBbahsGwLWANdWbJmns6juYMm6816xg43wJ99FB2UigotQj6dfn4TR/3KwV34fdr+vIRI2352dTUR8hDROKgRTyFXmbcouZxbwEWhgcDzefqlUCzHIIwT5ApRFDjngK+Kn23B1Tb91yK7Am4dmzhWP4jIh4z2qu8pFM85hWwCqbfdyd9lTfcNRNkNEB0xgWp3lVR08MaEAWcPxoomnWNSdKZa1Ar5OINruUTbSlTSXeH1dA1CX9BIdZ7ABFVhQf6sronquiOduxUtsgKyILkE6RrmYKTIZbi/jNv3zQcWS9NpUqWebfqF/Qjx8zIAHJPkSroedmh6v4gbTUv5cNBq9ATV+I674sQYio46pPsAoTEHRXQbSqGigL5RtYqz54a2nBrkh9CupnKfSaB3bB7QDcxw6WXOvKzFrnoAo9PkmEAedIyChiN7iznAMnm93cMrkPHvMEHLCpUkuz9KbEmlQiHtGb3j9KUJ54I9fomDQv+h/kedOX8JMkkbo/1dYSdf9kRzZyBU+JRCt+M+ikz2Y7D5V5uaEqMvEOMnp75ucFNdxsYrUJFdVRo5e8AGhYJC+wOadpKc+RgZFlpG+DOWKTPkmHWvlDvjn1NxbbOAztzrNpSlHvFXnz1CXu7LyB4F4dRxlCinap/VyZAmwuUP3Pjk1KdlLSQscFW4Hpv5vZt1cgvdkRaOiyR409OFtk7wxMAWh9G+VCl6VSBrygg3tcTF+qESSl46fFIvInOgB262qf8I8uZQDJGpmfLQ58eDopcR5lPLLu0XTbtj658dP/99Ai3E1q4GEIafOHjTW95nTeZldFn4zM5rrZKZJYkXQCZm7l+hpA4vfX61p4Iz+ZRZ8VPPbFsTlG+e4t8wQm5dKsSZvUp80Rl7Lza+oYVxkQQvNZE25SqSfjfBZFxgKph9AKdpuNd7+llwLs4Wk8P8UpHv3pc2qqB/62k1DXCCH0Fhm+2lNg+4X1K6ynWfB8uWdS9GYhk5qDtAJrGt5HVgYplvx6L23O0trk9ILrJue/wVlXvtACu7U00l9UPseyX9NwhxUsUAPfsox6ODNUUoMwqh3H/G6xvABlm";

const _U = "1_7RCBnNIxtbx_mL9uGGTOhuCAVaveVvwvQvl9rrEQaMoVlBiBFC_HTG3bIurhnxCONpH61bOQyr7cwxjoTfpF-oziTMyVvj6xGzyB1L_zQx7mdE4HnjYXDt8AmtjSeLGqYpZ-rn35_EhDvuDLCk9ma5-vebbpjRyBy3JHu6L7iYkC1RsC4KuwDNOaChB-fg8XTWND6swfSjrbBfdFD4KcJXC67fT3DzqlHGP5vk1kYE";



module.exports = {

  config: {

    name: "dalle",

    version: "1.0.2",

    author: "Samir Œ ",

    role: 0,

    countDown: 5,

    shortDescription: { en: "dalle3 image generator" },

    longDescription: { en: "dalle3 is a image generator powdered by OpenAi" },

    category: "𝗔𝗜",

    guide: { en: "{prefix}dalle <search query>" }

  },



  onStart: async function ({ api, event, args }) {

    const prompt = args.join(" ");



    try {

      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(prompt)}`);

      const data = res.data.results.images;



      if (!data || data.length === 0) {

        api.sendMessage("response received but imgurl are missing ", event.threadID, event.messageID);

        return;

      }



      const imgData = [];



      for (let i = 0; i < Math.min(4, data.length); i++) {

        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });

        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);

        await fs.outputFile(imgPath, imgResponse.data);

        imgData.push(fs.createReadStream(imgPath));

      }



      await api.sendMessage({

        attachment: imgData,

        body: `Here's your generated image`

      }, event.threadID, event.messageID);



    } catch (error) {

      api.sendMessage("Can't Full Fill this request ", event.threadID, event.messageID);

    }

  }

};
