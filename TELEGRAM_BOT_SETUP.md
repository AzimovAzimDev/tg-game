# Telegram Bot Setup

Follow these steps to create a bot and connect it to your deployed mini app.

1. **Create a new bot**
   - In Telegram, start a chat with [@BotFather](https://t.me/BotFather).
   - Send the command `/newbot` and follow the prompts to set the bot's name and unique username.
   - BotFather will reply with an HTTP API token. Store this token securely; it is used to control the bot.

2. **Assign the web app domain**
   - Send `/mybots` to BotFather and choose the bot you created.
   - Navigate to **Bot Settings → Domain**.
   - Enter the full domain where this web app is hosted, for example `https://your-domain.example`.
   - The domain must use HTTPS and be accessible from the internet.

3. **(Optional) Configure appearance**
   - In **Bot Settings** you can also set the bot's name, description, and profile picture.

4. **Launch the mini app**
   - Deploy this project to the domain you configured.
   - Share the link `https://t.me/<your_bot_username>/app` with users or add a Web App button in your bot's menu.
   - When users open the link, Telegram will load your mini app and provide user information to the client.

After completing these steps, your Telegram bot will load the mini app from the specified domain and pass user data to the application.
