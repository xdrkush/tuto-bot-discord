// Connect Database
require('./config/db');

// Connect to Discord
const discord = require('./discord/discord');
discord.connect();