const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FAB6BBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACNGTJT6h7oFKOAR//JDRm6M7/dEuH84OisbJDUo3zOzX6wvV+fTD3i7Myhtk1HRHHCkfH7GZ6SafcKDWGxf7d+gZjTMTg+lsIMaCa32t7clmKP+07KKXh6LWUuYCnnnmpe4ec+w1/OE49OiRiUL+o/i899ZS/HT3NEjU/MaU13Vjmj3uaRxuoX1TPj4+XrtN5Ez02bg+bW8MWbR7jG1UkZoreKZp7qc9M3cHE3qeBkj3IMNUtG4GTlVU31H6llToeGxR81k13P+Q8qyDyUIjkee3sikHSCts1BV4YsbXY0JMds3syq2k/HikD18KBC6bPz7zl+gO/36+lA8jCkcJiJsjSLgI/RA7L2Up3L/s3Jp+w2eKz+p6CnUn4Q1aeJUMy9zYuUB71DpTXpCSQKl4OTR9r4XJ92JXrYxQ+UTo/+17pHCMZ+O1xrj4TFoc1AztOivHjPYkC8aL37gav5+avwOYt4ZRSJM5jg9+9rL6idwco3hLGpBL30SiuGt94oU367eQyWrDUjIKRdzZU8tY7kNneoKdTOnhHrvWZ1ED2uOv5rcwwe9crN1q4H7pPqKT0bUqlyFIDNBIbdgbapVpFMW0mleWYot0sVSfeTVGq/nCxuF7qGkzSvWxaVc81hvCcZCvrGFaw2GQEJanFquRIek8TYZeIpus7Iq8aEiLbjWksm5tnxzjnVILHMSDXuVlHrkGjMz+qkRWfSoqQyg/Yaf9n5rCFBRQc4yca+8cUYXVFwNGqahf605egtvXijLEmG/z7dwbvlxYfBUcbvn+V3/iIcpAL/FXqZRdxYnqK2ammqXNP5+QQWh7T3a0S1RE7TisT99TLTn+i/5RwyBZfYx3GgArdSGvLiXSeFTSk1lGSYT/ouOcjXiEL1MBav73dlEVXQ51HAhyjS5hZWejv4Xyxp+qtAym2R6cwcjW5R744iGCN3JnHPZeisXpH+EHqh1l3gkNTDtUdqybJDLQ1MOw1y5+t0iW5YzUu+Wofo4+1MAn0fH9QGehtlNSTazeCRqnQd+0wUxNHc81YWXZjJaZYu2OVgenwcj0Ycdj36nOS/JylLlgD7IDQmiFSeSJYFj6tkzyiSYMqVPBUc/AViBSBoebwILDM4rKsrpix6khMsP2S1bjUyEQAbwWo4olF7TmX6VHIdvc05z5FDQC0pkyKdGd9/9HyDZT++MuvKz0l+ZRb9VFCdMp0xOwdpJf5gBi2uXzSASTzZw63ToDcMQlcVVGbZ59TjSCcYgKigNPV5K5ZHIrllcTYp4PCX9ixLXOk5mjRb/ib9CMCCsL4pO0gdAWAYR6ptp0gBLfe1oj5C/ebEhktiirVkCIM4o9vcScBn1PfDA6mXiGZyN7h5ehIADgOBd1x8gKzlfU4dDI5bLKUQV1d0LYA6HLzDu8HJAvP807k1h6ZvOAvDBUy5ZPw53ZQDP9xQvOn+jglIdTes4UAOmd8OvG6PhMpSC7rkiwQe4Caxit";
const _U = "16pGYwv6hMrTtUytFgayxAdoGmn6IoCH18GpR1W4cHpFs1SYLJLgWXMm8ckhVMzpRFG2twOHRvw-VauBhmXNVF7d79C2UXYMXM67QOoupH4sv7dzMw8JtaZ0edNBHIeVA9zMA4mF3yvFOiosLfCJDSxyvCC3-dDetQX3M9D1xiomOqTRRAo3_LOIRf7gXT-sRX3HXeuVv983F_w1RomsSAntMnbFsgPIO8z1QZ98dX5g";
module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "dalle"
    },
    longDescription: {
      en: ""
    },
    category: "dalle",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {

const uid = event.senderID
    const permission = [`${uid}`];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
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
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};
