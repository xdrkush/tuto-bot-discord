// Import de module
const Discord = require('discord.js')
  , discord = new Discord.Client()
  , axios = require('axios')
  , myEvents = require('../events')
  , commands = require('./commands');

discord.on('ready', () => {
  console.log(`discord: connection success to  ${discord.user.tag}!`);
});

discord.on('message', msg => {
  // On demande de ne pas écouter les autres bot
  if (msg.author.bot) return;
  // Il faut que la commande commence par le préfix parametré
  if (!msg.content.startsWith(process.env.DISCORD_CMD_PREFIX)) return;
  // Il arrete la commande si ce n'est pas executer par un bot autoriser, ou par un propriétaire de la guilde
  if (msg.author.id !== process.env.DISCORD_BOT_OWNER_ID
    && msg.author.id !== msg.guild.owner.id) return;
  // Split message into an array on any number of spaces
  msg.params = msg.content.split(/ +/g).map(x => x.toLowerCase()); // eslint-disable-line no-param-reassign
  // Diviser le message en un tableau sur n'importe quel nombre d'espaces
  msg.cmd = msg.params.shift() // eslint-disable-line no-param-reassign
    .slice(process.env.DISCORD_CMD_PREFIX.length).toLowerCase();
  // quitter si la command ne commence pas par le prefix
  if (!msg.cmd) return;
  // on ce focalise sur les commandes twitter
  if (msg.cmd !== 'bot') return;
  // These commands need to be run in a guild text channel to associate the guild id and channel id
  if (msg.channel.type === 'dm') {
    msg.author.send('This command does not work via DMs. Please run it in a guild\'s text channel.')
      .catch(err => console.log(err));
    return;
  }
  console.log(`DISCORD: [${msg.guild.name}] (#${msg.channel.name}) <${msg.author.tag}>: ${msg.content}`);
  msg.prefix = process.env.DISCORD_CMD_PREFIX; // eslint-disable-line no-param-reassign
  commands(msg);
});

discord.login(process.env.TOKEN_DISCORD);

module.exports = {
  discord,
  connect: () => {
    console.log('discord: connecting...');
    discord.login(process.env.DISCORD_BOT_TOKEN)
      .catch(err => {
        console.log('discord: login error');
        console.log(err);
        process.exit(1);
      });
  }
};

// Event 'ping'
myEvents.on('ping', (msg) => {
  discord.channels.cache
    .get(msg.channel.id)
    .send(`Pong ! <@${msg.author.id}> tu ne gagnera pas contre moi !`)
});

// Event 'hello' (embed)
myEvents.on('hello', (user, msg) => {
  const str = new Discord.MessageEmbed()
    .setTitle(`> Salut ${user.username} ! ${msg.author.username} te passe le bonjour ! :rocket:`)
    .setColor(6684828)
    .setFooter(discord.user.username + ' <3', 'https://pbs.twimg.com/profile_images/1281686197371383810/uas7SAaD_400x400.jpg')

  discord.channels.cache
    .get(msg.channel.id)
    .send({ embed: str })
});

// Module traduction
const Reverso = require('reverso-api');
const reverso = new Reverso();

// Event 'joke' (chuck noris)
myEvents.on('joke', (msg) => {
  axios
    .get('https://api.chucknorris.io/jokes/random')
    .then(response => {

      reverso.getTranslation(response.data.value, 'English', 'French').then(res => {
        const str = new Discord.MessageEmbed()
          .setTitle('Joke Chuck Norris ! :innocent:')
          .setAuthor(`${msg.author.username}`)
          .setDescription(res.translation[0])
          .setColor(6684828)
          .setFooter(discord.user.username + ' <3', 'https://pbs.twimg.com/profile_images/1281686197371383810/uas7SAaD_400x400.jpg')

        discord.channels.cache
          .get(msg.channel.id)
          .send({ embed: str })
        return console.log(res);
      }).catch(err => {
        return console.error(err);
      });

    })
    .catch(err => console.log(err))
});