require("dotenv").config();

const express = require("express");

const { processWebhook, validateWebhook } = require('./src/controllers/webhookController')
// const { sendMessageToWhatsApp, sendTemplateMessage } = require('./src/controllers/whatsappController') // TEST PURPOSE

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AtenaZap");
});

app.get("/webhook", validateWebhook);

app.post("/webhook", processWebhook);

app.listen(3000, () => {
  console.log("Server started on port 3000");
  
  // TEST PURPOSE
  // sendMessageToWhatsApp("NUMERO TESTE", "INICIANDO TESTEEEEEERRR");
  // sendTemplateMessage("NUMERO TESTE")

});
