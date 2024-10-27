const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8062611798:AAGblNZBc2xdpYfZXNXbhORXV5MJzQmdYVU"; // Replace with your actual bot token
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("my_chat_member", async (update) => {
    const chatId = update.my_chat_member.chat.id;
    const firstName = update.my_chat_member.from.first_name;

    // Check if the user is a new member
    if (update.my_chat_member.new_chat_member.status === "member") {
        try {
            // Send a welcome message
            await bot.sendMessage(chatId, `Welcome, ${firstName}! 🎉 We’re thrilled to have you here. Let's get started!`);

            // Send an image as part of the welcome message
            await bot.sendPhoto(chatId, "./images/welcome.jpg", {
                caption: "Here’s some quick info to help you get started!",
            });
        } catch (error) {
            console.error("Error sending welcome message and image:", error);
        }
    }
});
