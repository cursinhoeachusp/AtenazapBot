function incomingMessage(number, name, body) {

  const stringNew = `
🔆 <b>Nova mensagem de <code>${name}</code></b>!

👉 <b>Responder para:</b> <code>${number}</code>

💬 <b>Mensagem:</b>

<blockquote>${body}</blockquote>

`;

  return stringNew;
}

function help(username) {
  return `🦉💖 Oi! Eu sou o bot do AtenaZap no Telegram!

<b>✨ Conheça minhas funcionalidades e saiba como utilizá-las: ✨</b>


1️⃣ <b>Redirecionamento para leitura de mensagens</b>
- Todas as mensagens enviadas para o AtenaZap são encaminhadas aqui. Apresento o nome, número e mensagem enviados.
- Para copiar o número e respondê-lo, você pode simplesmente clicar no número após "Responder para:"


2️⃣ <b>Responder mensagens</b>
- Para responder, basta utilizar o seguinte comando <code>/responder@atenazapdemodemo numero mensagem</code><blockquote><b><i>👀 Exemplo:</i></b> 

<code>/responder@${username} 5511999999999 oi, tudo bem?</code>

O comando acima enviará "oi, tudo bem?" para o número 5511999999999 no WhatsApp.
</blockquote>


3️⃣ <b>Falhas e erros</b>
- Se houver alguma falha no envio da mensagem, te avisarei por aqui!


💞 <b>Créditos, dúvidas e suporte</b>
Desenvolvido por Inovatec :) Entre em contato se precisar!
`;
}

module.exports = { incomingMessage, help };
