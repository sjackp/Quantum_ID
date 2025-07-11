# Quantum

Quantum is an advanced Discord bot designed for music communities, featuring track database search, random track selection, image generation via Stable Diffusion, and a mysterious, witty chatbot persona. It integrates with OpenAI, a PostgreSQL database, and a local image generation API (Forge).

## Features

- **Track Database Integration**: Search, list, and get random tracks from a PostgreSQL database of music tracks.
- **Image Generation**: Generate AI art based on prompts or random track titles using Stable Diffusion (Forge API).
- **Chatbot**: Responds to mentions with cryptic, witty, and music-themed replies powered by OpenAI.
- **Predefined Q&A**: Answers a set of fun, predefined questions.
- **Rate Limiting**: Prevents spam and abuse of chatbot and image generation features.
- **Permission Controls**: Restricts certain commands to specific users or channels.

## Commands

| Command                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| `!id update`           | Updates the track database (admin only).                                     |
| `!id search <query>`   | Searches the track database for matching tracks.                             |
| `!id random`           | Returns 5 random tracks from the database.                                   |
| `!id list`             | Shows a breakdown of tracks by year.                                        |
| `!id dream <prompt>`   | Generates an image from your prompt using the dream machine (Stable Diffusion).|
| `!id vortex`           | Generates an image prompt for a random track and creates art for it.         |
| `!id help`             | Displays help and command usage.                                             |

## Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL database (with a `tracks` table)
- [Forge UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) running locally for image generation
- Discord bot token
- OpenAI API key

### 1. Clone the repository
```bash
git clone <repo-url>
cd Quantum
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory with the following variables:

```
TOKEN=your_discord_bot_token
API_KEY=your_openai_api_key
NEON_DB_URL=your_postgres_connection_string
CHANNEL_ID1=your_discord_channel_id_1
CHANNEL_ID2=your_discord_channel_id_2
```

- `TOKEN`: Discord bot token
- `API_KEY`: OpenAI API key
- `NEON_DB_URL`: PostgreSQL connection string (Neon or other)
- `CHANNEL_ID1`, `CHANNEL_ID2`: Discord channel IDs where the bot is allowed to operate

### 4. Database Setup
Ensure your PostgreSQL database has a `tracks` table with at least the following columns:
- `track_name` (text)
- `link` (text, optional)
- `notes` (text, optional)
- `year` (integer, optional)

### 5. Run the Bot
```bash
node index.js
```

## Image Generation (Forge)
- The bot expects a local Forge (Stable Diffusion) API running at `http://127.0.0.1:7860/sdapi/v1/txt2img`.
- You can change this URL in `index.js` if your setup differs.
- Some image features are rate-limited per user per day (default: 3 images).

## Usage
- Invite the bot to your Discord server.
- Use the commands above in the allowed channels.
- Mention the bot for witty, AI-powered conversation.

## Contribution
Pull requests and issues are welcome! Please:
- Follow the existing code style (see `index.js` for conventions).
- Document new features and update this README as needed.
- Test your changes before submitting.

## License
ISC

## Credits
- [discord.js](https://discord.js.org/)
- [OpenAI API](https://openai.com/)
- [moment.js](https://momentjs.com/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [pg](https://node-postgres.com/)
- [Forge UI (Stable Diffusion)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 
