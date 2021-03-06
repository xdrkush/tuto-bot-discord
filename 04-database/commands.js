const Discord = require('discord.js');
const User = require('./UserModel.js')

module.exports = msg => {
  // check le premier mot après le prefix complet "!!bot action"
  const action = msg.params[0];
  // Le premier user cité
  const users = msg.mentions.users.first()
  console.log(msg.mentions.users.first())

  // Decide what action to take
  switch (action) {
    case 'ping':
      console.log('test ping')
      msg.reply('Pong !');
      break;
    case 'add':
      if (users.bot === true) status = 'bot';
      else status = 'user';
      if (users) {
        User
          .create({
            username: users.username,
            idDiscord: users.id,
            status: status,
            isVerified: users.verified
          }, (err) => {
            if (err) console.log(err)
            msg.reply('User create');
          })
        // .catch(err => console.log(err))
      } else msg.reply('Une erreur est survenue !');
      break;
    case 'get':
      User
        .find({})
        .exec((err, user) => {
          if (err) console.log(err)
          console.log(user)
          msg.channel
            .send('get db')
            .catch(err => console.log(err));
        })
      break;
    case 'del':
      if (users) {
        User
      .deleteOne({idDiscord: users.id})
      .exec((err, user) => {
          if (err) console.log(err)
          console.log(user)
          msg.channel
            .send('del to db')
            .catch(err => console.log(err));
        })
      } else msg.reply('Une erreur est survenue !')
      break;
    case 'help':
      msg.channel
        .send({
          embed: require('./helpEmbed').embed
        })
        .catch(err => console.log(err));
      break;
  }

};