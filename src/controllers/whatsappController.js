const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { sendMessageToTelegramGroup } = require("./telegramController");

const { WHATSAPP_ACCESS_TOKEN, PHONE_NUMBER_ID } = process.env;

async function sendTemplateMessage(to) {
  const response = await axios({
    url: `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    method: "post",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "en_US",
        },
      },
    }),
  });
}

const downloadFile = async (fileUrl, savePath) => {
  console.log("checkpoint 2", fileUrl, savePath);
  try {
    const response = await axios({
      url: fileUrl,
      method: "GET",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      responseType: "stream",
    });

    const contentType = response.headers["content-type"];
    let extname = "";
    if (contentType) {
      if (contentType.includes("image/jpeg")) {
        extname = ".jpg";
      } else if (contentType.includes("image/png")) {
        extname = ".png";
      } else if (contentType.includes("image/gif")) {
        extname = ".gif";
      } else if (contentType.includes("application/pdf")) {
        extname = ".pdf";
      } else if (contentType.includes("application/msword")) {
        extname = ".doc";
      } else if (
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
      ) {
        extname = ".docx";
      } else if (contentType.includes("audio/mpeg")) {
        extname = ".mp3";
      } else if (contentType.includes("audio/wav")) {
        extname = ".wav";
      } else if (contentType.includes("video/mp4")) {
        extname = ".mp4";
      } else if (contentType.includes("application/zip")) {
        extname = ".zip";
      } else if (contentType.includes("application/json")) {
        extname = ".json";
      } else {
        extname = ".bin";
      }
    }

    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileNameWithExtension = path.basename(savePath) + extname;
    const filePath = path.join(dir, fileNameWithExtension);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(filePath));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading the file:", error);
    throw error;
  }
};

async function getFileFromWhatsApp(mediaId) {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v13.0/${mediaId}`,
      method: "GET",
      params: {
        access_token: process.env.WHATSAPP_ACCESS_TOKEN,
      },
    });

    const mediaUrl = response.data.url;
    const fileName = response.data.name || mediaId; 

    const filePath = await downloadFile(mediaUrl, fileName);

    return filePath;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
}

async function sendMessageToWhatsApp(to, body) {
  try {
    const response = await axios({
      url: `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      method: "post",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body,
        },
      }),
    });
    console.log("Mensagem enviada:", response.data);
  } catch (error) {
    console.error("Erro ao enviar mensagem no WhatsApp:", error);
    sendMessageToTelegramGroup("Erro ao enviar mensagem");
  }
}
module.exports = {
  sendMessageToWhatsApp,
  getFileFromWhatsApp,
  sendTemplateMessage,
};
