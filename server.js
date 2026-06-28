require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

let bot = null;

if (TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "🚀 Bienvenue sur Mayo AI OS.\n\nJe suis ton assistant IA en français pour Telegram, Wenze, maison connectée, surveillance électrique et automatisation."
    );
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "📌 Commandes disponibles :\n\n/start - Démarrer\n/help - Aide\n/status - État du système\n/courant - Surveillance électrique\n\nTu peux aussi m’écrire directement une question."
    );
  });

  bot.onText(/\/status/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "✅ Mayo AI OS est en ligne.\n🌐 Serveur Render actif.\n🤖 Bot Telegram connecté.\n🇫🇷 Langue principale : français."
    );
  });

  bot.onText(/\/courant/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "⚡ Module courant prêt.\n\nProchaine étape : connecter ESP32/Raspberry Pi pour mesurer L1, L2, L3, tensions faibles, coupures et alertes."
    );
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith("/")) return;

    try {
      await bot.sendChatAction(chatId, "typing");

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu es Mayo AI OS, un assistant IA stratégique, technique et opérationnel. Tu réponds toujours en français, de manière claire, directe, professionnelle et utile. Tu aides sur Telegram, Wenze, business, maison connectée, surveillance électrique, automatisation, code et stratégie.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

      const answer =
        response.choices?.[0]?.message?.content ||
        "Je n’ai pas pu générer une réponse.";

      bot.sendMessage(chatId, answer);
    } catch (error) {
      console.error("Erreur IA :", error.message);
      bot.sendMessage(
        chatId,
        "⚠️ Erreur Mayo AI OS : je n’ai pas pu contacter le cerveau IA. Vérifie la clé OPENAI_API_KEY sur Render."
      );
    }
  });

  console.log("🤖 Bot Telegram Mayo AI OS activé.");
} else {
  console.log("⚠️ TELEGRAM_BOT_TOKEN manquant.");
}

app.get("/", (req, res) => {
  res.send("🚀 Mayo AI OS fonctionne en français !");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Mayo AI OS",
    language: "fr",
    telegram: Boolean(TELEGRAM_BOT_TOKEN),
    openai: Boolean(OPENAI_API_KEY),
  });
});

app.post("/power-alert", async (req, res) => {
  const { zone, phase, tension, niveau } = req.body;

  const message = `⚡ ALERTE COURANT

Zone : ${zone || "Non précisée"}
Phase : ${phase || "Non précisée"}
Tension : ${tension || "Inconnue"} V
Niveau : ${niveau || "Information"}

Mayo AI OS a détecté une anomalie électrique.`;

  console.log(message);

  res.json({
    success: true,
    message: "Alerte reçue par Mayo AI OS.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mayo AI OS démarré sur le port ${PORT}`);
});
