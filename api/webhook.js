const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8062611798:AAGblNZBc2xdpYfZXNXbhORXV5MJzQmdYVU";
const gameName = "testiAIDeploy"; // Replace with your game's short name
const gameUrl = "https://test-deployi-ai.vercel.app/"; // Your game URL
const imageUrl = "https://imgur.com/ZGgcA9c";// url images

const botUsername = 'testiAIDeploy_bot';

const bot = new TelegramBot(TOKEN, { polling: false });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        try {

            // Handle /authorize command to check user_id
            if (update.message && (update.message.text === '/authorize' || update.message.text === `/authorize@${botUsername}`)) {
                const chatId = update.message.chat.id;
                const userId = update.message.from.id;
                const firstName = update.message.from.first_name;

                // Inform the user that their authorization is complete
                const authorizationMessage = `Hello, ${firstName}!\nYour authorization is complete, and we have successfully retrieved your user ID (${userId}).\n\nYou can now press the "Play Game" button to start playing! 🎮`;

                await bot.sendMessage(chatId, authorizationMessage);
            }

            // Handle /start or /game command
            if (update.message && (update.message.text === '/testGame' || update.message.text === `/testGame@${botUsername}`)) {
                //const chatId = update.message.from.id; //DM
                const chatId = update.message.chat.id; //group respond
                const firstName = update.message.from.first_name;

                await bot.sendMessage(chatId, `Welcome, ${firstName}! Let's play ${gameName}.`);
                await bot.sendGame(chatId, gameName);
            }

            // Handle /start
            if (update.message && update.message.text === '/startTest') {
                const chatId = update.message.chat.id;
                const firstName = update.message.from.first_name;

                // Escape necessary characters for MarkdownV2
                const welcomeMessage = `🎮 *Welcome to the iAI Robot Game\\!* 🚀
A fun Telegram game where you collect iAI tokens, upgrade your strategy, and compete for rewards\\! 💰

*How to Play*  
🕹 *Swipe & Collect\\:* Start with 1,000 energy units\\. Each swipe earns you iAI coins\\!  
⚡️ *Upgrade Your Core\\:* Boost your energy for higher earnings\\.  
🏆 *Leaderboard\\:* Climb to the top for big rewards\\!  
🎯 *Daily Missions\\:* Complete tasks for bonus coins\\.

*Rewards*
💰 Earn tokens every play 
🎁 Complete quests for extra rewards  
🏆 *Top 10* leaderboard winners share a *$3,000 USDT Prize Pool\\!*

*Ready to play?* Hit "/testGame" and start earning\\! 🔥`;

                try {
                    // Send the welcome image with a caption
                    await bot.sendPhoto(chatId, imageUrl);
                    await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'MarkdownV2' });
                } catch (error) {
                    console.error("Error sending welcome message:", error);
                }

                //await bot.sendGame(update.message.from.id, gameName);
            }

            // Handle callback query for the Play button
            if (update.callback_query) {
                const query_id = update.callback_query.id;
                const userID = update.callback_query.from.id;
                const firstName = update.callback_query.from.first_name || "N/A";

                if (update.callback_query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
                    await bot.answerCallbackQuery(query_id, `Sorry, '${update.callback_query.game_short_name}' is not available.`);
                } else {
                    await bot.answerCallbackQuery({ 
                        callback_query_id: query_id, 
                        url: gameUrl + `?query_id=${query_id}&id=${userID}&first_name=${firstName}` 
                    });
                }
            }

            // // Handle callback query for the Play button
            // if (update.callback_query) {
            //      if (update.callback_query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
            //         await bot.answerCallbackQuery(update.callback_query.id, `Sorry, '${update.callback_query.game_short_name}' is not available.`);
            //      }
            //      else if (typeof update.callback_query.from == "undefined" || typeof update.callback_query.from.id == "undefined")
            //      {
            //          await bot.answerCallbackQuery({ callback_query_id: query_id, url: gameUrl });
            //      }
            //      else
            //      {
            //          const query_id = update.callback_query.id;
            //          const userID = update.callback_query.from.id;
            //          const firstName = typeof update.callback_query.from.first_name == "undefined" ? "N/A" : update.callback_query.from.first_name;
            //          await bot.answerCallbackQuery({ callback_query_id: query_id, url: gameUrl + `?query_id=${query_id}&id=${userID}&first_name=${firstName}` });
            //      }
            //  }

            res.status(200).send('OK');
    } catch (error) {
        console.error('Error in processing update:', error);
        res.status(500).send('Internal Server Error');
    }
} else {
    res.status(405).send('Method Not Allowed');
}
};

