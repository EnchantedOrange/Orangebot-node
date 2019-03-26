# Orangebot-node
Twitch chat bot on node.js

options go in separate file called 'options.js' which looks like this:

module.exports = {
  identity: {
    username: 'botname',
    password: 'oauth:1234567890abcbefghijklmnopqrst',
    clientID: '0a1b2e3c4d5e6f7g8h9blahblablah'
  },
  channels: [
    'channelname1',
    'channelname2',
    'channelname3'
  ],
  commandPrefix: '!',
  admins: [ // users who can execute sensitive commands
    'admin1',
    'admin2'
  ]
};
