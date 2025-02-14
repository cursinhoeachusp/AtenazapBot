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

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  
  // TEST PURPOSE
  // sendMessageToWhatsApp("NUMERO TESTE", "INICIANDO TESTEEEEEERRR");
  // sendTemplateMessage("NUMERO TESTE")

});
