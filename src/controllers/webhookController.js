const fs = require("fs");

const { sendMessageToTelegramGroup,bot } = require("./telegramController");
const { incomingMessage } = require("../utils/formattingText");
const { getFileFromWhatsApp } = require("../controllers/whatsappController");

const { CHAT_ID } = process.env;

function validateWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  if (mode && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

function processWebhook(req, res) {
  const { entry } = req.body;

  if (!entry || entry.length === 0) {
    return res.status(400).send("Invalid Request");
  }

  const changes = entry[0].changes;

  if (!changes || changes.length === 0) {
    return res.status(400).send("Invalid Request");
  }
  const statuses = changes[0].value.statuses
    ? changes[0].value.statuses[0]
    : null;

  if (statuses) {
    const statusMessage = statuses.status;
    if (statusMessage == "failed")
      sendMessageToTelegramGroup(
        "Mensagem não foi enviada, tente novamente. Se o problema persistir, avise Inovatec",
      );
    return;
  }

  console.log(changes[0])
  
  const messageData = changes[0].value.messages[0];

  const number =
    changes[0].value.contacts[0].wa_id;
  const name =
    changes[0].value.contacts[0].profile.name;
  

  
  console.log(JSON.stringify(req.body, null, 2));
  
  if (
    (messageData && messageData.type === "image") ||
    messageData.type === "document" ||
    messageData.type === "audio" ||
    messageData.type === "video"
  ) {
    const body = Object.hasOwn(messageData[messageData.type], 'caption') ? messageData[messageData.type].caption : ""
    
    const mediaId = messageData[messageData.type].id;
    getFileFromWhatsApp(mediaId).then(filePath => {
      console.log('Downloaded file:', filePath);
      bot.telegram.sendDocument(CHAT_ID, { source: filePath }, { caption: incomingMessage(number, name, body),parse_mode: 'HTML' }).then(() => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`${filePath} Deletado`);
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    }).catch(err => console.error(err));
    
    return;
  }

  const body =
    changes[0].value.messages[0].text.body;
  
  sendMessageToTelegramGroup(incomingMessage(number, name, body));

  res.status(200).send("Webhook processed");
}

module.exports = { processWebhook, validateWebhook };
