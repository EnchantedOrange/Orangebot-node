# Orangebot-node
Twitch chat bot on node.js

## How to install

1. Download files

2. Download Node.js from `https://nodejs.org/en/`

3. Type `npm install` in command line in the bot folder you downloaded.

4. Make an options.js file and fill it in like below:

```
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
  admins: [
    'admin1',
    'admin2'
  ]
};
```

where `identity` object is your bot's unique credentials,
`channels` list contains twitch channels to which bot will connect,
`commandPrefix` is prefix that users should put before bot commands,
`admins` are users who can execute sensitive commands (usually there must be only your account).

5. Launch bot.js

Good to go!
