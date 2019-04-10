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

  idleChannels: [
    'idleChannel1',
    'idleChannel2'
  ],

  commandPrefix: '!',

  admins: [
    'admin1',
    'admin2'
  ],

  forbiddenWords: [
    /(bad)*word/,
    /[^(verybad)*]word/
  ],

  wordsToDetect: [
    /(my)*name/,
    /(my)+lastname/,
    /mynick(name)*/
  ]
};
```

where:
- `identity` object is your bot's unique credentials,
- `channels` is list that contains twitch channels to which bot will connect,
- `idleChannels` is list that contains twitch channels from which bot should only get messages, but not execute commands (idle channels must be in `channels` list too),
- `commandPrefix` is prefix that users should put before bot commands,
- `admins` are users who can execute sensitive commands (usually there must be only your account),
- `forbiddenWords` are RegExps that describe words that you don't want bot to say,
- `wordsToDetect` are RegExps that describe words  that, when appear in chat, cause bot to play a notification sound.

For more information about RegExp, visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

5. Launch bot.js by typing `node bot.js` in the command line (you can create a .bat file with this command for easier access to the bot)

Good to go!

You can change notification sound by placing your 'notification.mp3' in /media folder.