const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");

const { sendMessageToWhatsApp } = require('./whatsappController')
const { help } = require('../utils/formattingText')

const { TELEGRAM_BOT_ACCESS_TOKEN, CHAT_ID } = process.env;

let username = "";

const bot = new Telegraf(TELEGRAM_BOT_ACCESS_TOKEN);

bot.telegram.getMe().then((botInfo) => {
  username = botInfo.username;
}).catch((error) => {
  console.error('Erro para pegar informações do bot:', error);
});


bot.launch();

async function sendMessageToTelegramGroup(message) {
  try {
    await bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: "HTML" });
    console.log(`Mensagem enviada para grupo com ID: ${CHAT_ID}`);
  } catch (error) {
    console.error("Erro ao enviar mensagem para o grupo:", error);
  }
}

bot.on(message("text"), async (ctx) => {

  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    const text = ctx.message.text;

    if (text.startsWith(`/responder@${username}`)) {
      const splitting = text.split(" ");
      if (splitting.length < 3) {
        ctx.reply(
          `Estão faltando argumentos. É preciso colocar o número de telefone e, após isso, a mensagem a ser enviada`,
        );
        return;
      }
      const to = splitting[1];
      const message = text.split(to)[1];
        sendMessageToWhatsApp(to, message);
      ctx.reply(`Respondendo ${to}... `);
      return;
    }

    if (text.startsWith(`/help@${username}`)) {
      ctx.reply(help(username), { parse_mode: "HTML" });
      return;
    }
  }
});


module.exports = { sendMessageToTelegramGroup, bot };
