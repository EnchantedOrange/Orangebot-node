const tmi = require('tmi.js'),
      fetch = require('node-fetch'),
      options = require('./options'),
      db = require('better-sqlite3')('db.db');
const client = new tmi.client(options);

const idle_channels = ['welovegames', 'dizzydizaster'];

const prefix = options.commandPrefix;

const Quiz = {
	isActive: false,
	variants: {},
	users: [],
	channel: ''
};

/*let people = {};
options.channels.forEach((c) => {
	people[c] = [];
});*/



client.on('connected', () => console.log('Konnekted!'));

client.on('message', (target, context, msg, self) => {
	const user = context.username;
	console.log(`{${target}} <${user}>: ${msg}`);

	if (self) return;

  if (Quiz.isActive && Object.keys(Quiz.variants).includes(msg) && !Quiz.users.includes(user) && target === Quiz.channel) {
		Quiz.variants[msg][1] += 1;
		Quiz.users.push(user);
  }

	if (msg.startsWith(prefix)) {
		msg = msg.split(prefix)[1];
		if (msg.startsWith('рим')) {
			romeTranslator(msg.split('рим ')[1], user, target);
		} else if (msg.startsWith('кпд')) {
			kpd(user, target);
		} else if (msg.startsWith('punto')) {
			punto(msg.split('punto ')[1], user, target);
		} else if (msg.startsWith('реверс')) {
			reverse(msg.split('реверс ')[1], user, target);
		} else if (msg.startsWith('count')) {
			count(msg.split('count ')[1], user, target);
		} else if (msg.startsWith('top')) {
			topCount(user, target);
		} else if (msg.startsWith('wasted')) {
			wasted(msg.split('wasted ')[1], user, target);
		} else if (msg.startsWith('опрос')) {
			if (options.admins.includes(user) || context.mod || context.badges.broadcaster === '1') {
				quiz(msg.split('опрос ')[1], user, target);
			}
		} else if (msg.startsWith('результат')) {
			if ((options.admins.includes(user) || context.mod || context.badges.broadcaster === '1') && Quiz.channel === target) {
				result(user, target);
			}
		} else if (msg.startsWith('скажи')) {
			if (options.admins.includes(user)) {
				say(msg.split('скажи')[1].toString(), target);
			}
    }
	}
});



client.connect();






const u = {'0': '', '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX'};
const d = {'0': '', '1': 'X', '2': 'XX', '3': 'XXX', '4': 'XL', '5': 'L', '6': 'LX', '7': 'LXX', '8': 'LXXX', '9': 'XC'};
const h = {'0': '', '1': 'C', '2': 'CC', '3': 'CCC', '4': 'CD', '5': 'D', '6': 'DC', '7': 'DCC', '8': 'DCCC', '9': 'CM'};
const m = {'0': '', '1': 'M', '2': 'MM', '3': 'MMM'};

const puntoDict = {'q':'й','w':'ц','e':'у','r':'к','t':'е','y':'н','u':'г','i':'ш','o':'щ','p':'з','[':'х',']':'ъ','a':'ф','s':'ы','d':'в','f':'а','g':'п','h':'р','j':'о','k':'л','l':'д',';':'ж','\'':'э','z':'я','x':'ч','c':'с','v':'м','b':'и','n':'т','m':'ь',',':'б','/':'.','Q':'Й','W':'Ц','E':'У','R':'К','T':'Е','Y':'Н','U':'Г','I':'Ш','O':'Щ','P':'З','{':'Х','}':'Ъ','A':'Ф','S':'Ы','D':'В','F':'А','G':'П','H':'Р','J':'О','K':'Л','L':'Д',':':'Ж','"':'Э','Z':'Я','X':'Ч','C':'С','V':'М','B':'И','N':'Т','M':'Ь','<':'Б','>':'Ю','?':',','.':'ю','@':'"','#':'№','$':';','^':':','&':'?','`':'ё','~':'Ё','й':'q','ц':'w','у':'e','к':'r','е':'t','н':'y','г':'u','ш':'i','щ':'o','з':'p','х':'[','ъ':']','ф':'a','ы':'s','в':'d','а':'f','п':'g','р':'h','о':'j','л':'k','д':'l','ж':';','э':'\'','я':'z','ч':'x','с':'c','м':'v','и':'b','т':'n','ь':'m','б':',','ю':'.','Й':'Q','Ц':'W','У':'E','К':'R','Е':'T','Н':'Y','Г':'U','Ш':'I','Щ':'O','З':'P','Х':'{','Ъ':'}','Ф':'A','Ы':'S','В':'D','А':'F','П':'G','Р':'H','О':'J','Л':'K','Д':'L','Ж':':','Э':'"','Я':'Z','Ч':'X','С':'C','М':'V','И':'B','Т':'N','Ь':'M','Б':'<','Ю':'>'};
const wastedDict = {'Q':'Ц','W':'Ш','E':'Е','R':'Я','T':'Т','Y':'У','U':'Ю','O':'О','P':'Р','A':'А','S':'Ы','D':'Д','F':'Г','G':'Ж','H':'Н','J':'Ь','K':'К','L':'Л','Z':'З','X':'Х','C':'С','V':'В','B':'В','N':'И','M':'М','q':'ц','w':'ш','e':'е','r':'я','t':'т','y':'у','u':'ю','o':'о','p':'р','a':'а','s':'ы','d':'д','f':'г','g':'ж','h':'н','j':'ь','k':'к','l':'л','z':'з','x':'х','c':'с','v':'в','b':'в','n':'и','m':'м'};

const forbidden = ['блять', 'блядь'];



function isForbidden(string) {
	let check = false;
	forbidden.forEach(word => {
		if (string.toLowerCase().includes(word)) {
			check = true;
		}
	});
	if (check) {
		return true;
	} else {
		return false;
	}
}



function romeTranslator(num, user, target) {
	let result;

	if (parseInt(num) < 4000) {
		switch (num.length) {
			case 1:
				result = u[num];
				break;
			case 2:
				result = d[num[0]] + u[num[1]];
				break;
			case 3:
				result = h[num[0]] + d[num[1]] + u[num[2]];
				break;
			case 4:
				result = m[num[0]] + h[num[1]] + d[num[2]] + u[num[3]];
				break;
		}
	} else {
		result = 'Введите число от 1 до 3999';
	}

	client.say(target, `@${user} ${result}`);
}

function kpd(user, target) {
	const channel = target.split('#')[1];
	fetch(`https://api.twitch.tv/kraken/users?login=${channel}`, {
		headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': options.identity.clientID}
	})
		.then(res => res.json())
		.then(json => {
			const id = json.users[0]._id;
			fetch(`https://api.twitch.tv/kraken/channels/${id}/follows`, {
				headers: {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': options.identity.clientID}
			})
				.then(res => res.json())
				.then(json => {
					const followers = json._total;
					fetch(`https://tmi.twitch.tv/group/user/${channel}`)
						.then(res => res.json())
						.then(json => {
							const chatters = json.chatter_count;
							const kpd = (chatters / followers * 100).toFixed(2);
							client.say(target, `@${user} ${kpd}%`);
						});
				});
		});
}

function punto(text, user, target) {
	let answer;

	if (text) {
		const msg = text.split('');
		let result = '';
		msg.forEach(letter => {
			if (puntoDict.hasOwnProperty(letter)) {
				result += puntoDict[letter];
			} else {
				result += letter;
			}
		});

		if (!isForbidden(result)) {
			answer = `@${user} ${result}`;
		} else {
			answer = `@${user} не-а Kappa`;
		}
	} else {
		answer = `@${user} напишите что-нибудь`;
	}

	client.say(target, answer);
}

function reverse(text, user, target) {
	let answer;

	if (text) {
		text = text.split('');
		text.reverse();
		let result = '';
		text.forEach(letter => {
			result += letter;
		});

		if (!isForbidden(result)) {
			answer = `@${user} ${result}`;
		} else {
			answer = `@${user} не-а Kappa`;
		}
	} else {
		answer = `@${user} напишите что-нибудь`;
	}

	client.say(target, answer);
}

function count(targetUser, user, target) {
	let isSelf = false;

	if (targetUser) {
		targetUser = targetUser.toLowerCase();
		if (targetUser.includes('@')) {
			targetUser = targetUser.split('@')[1];
		}
	} else {
		targetUser = user;
		isSelf = true;
	}

	const row = db.prepare(`SELECT count FROM ${target.split('#')[1]} WHERE nick = ?`).get(targetUser);

	let answer;

	if (row) {
		if (isSelf) {
			answer = `@${user} Вы набрали ${row.count.toString()} сообщений`;
		} else {
			answer = `@${user} ${targetUser} набрал ${row.count.toString()} сообщений`;
		}
	} else {
		answer = `@${user} пользователь не найден`;
	}

	client.say(target, answer);
}

function topCount(user, target) {
	const stmt = db.prepare(`SELECT * FROM ${target.split('#')[1]} ORDER BY count DESC`);
	let result = `@${user} топ по сообщениям: `;
	let i = 1;
	for (const row of stmt.iterate()) {
		if (i < 5) {
			result += `#${i} ${row.nick} - ${row.count} `;
			i++;
		} else {
			break;
		}
	}

	client.say(target, result);
}

function wasted(text, user, target) {
	let answer;

	if (text) {
		text = text.split('');
		let result = '';
		text.forEach(letter => {
			if (wastedDict.hasOwnProperty(letter)) {
				result += wastedDict[letter];
			} else {
				result += letter;
			}
		});

		if (!isForbidden(result)) {
			answer = `@${user} ${result}`;
		} else {
			answer = `@${user} не-а Kappa`;
		}
	} else {
		answer = `@${user} напишите что-нибудь`;
	}

	client.say(target, answer);
}

function quiz(text, user, target) {
  let answer;
	if (Quiz.isActive) {
		answer = `@${user} опрос уже активен!`;
	} else {
    if (text) {
			Quiz.channel = target;
			let variants = [];

      let i = 1;
      text.split(' ').forEach(variant => {
        if (!variants.includes(variant) && !isForbidden(variant)) {
					Quiz.variants[i] = [variant, 0];
					variants.push(variant);
					i++;
        }
			});

      if (variants.length <= 1) {
        answer = `@${user} добавьте минимум два варианта, пожалуйста`;
      } else {
        answer = '/me Опрос начат! Варианты: ';

				for (let i = 1; i <= Object.keys(Quiz.variants).length; i++) {
					if (i < Object.keys(Quiz.variants).length) {
						answer += `${i}. "${Quiz.variants[i][0]}", `;
					} else {
						answer += `${i}. "${Quiz.variants[i][0]}". Чтобы проголосовать, напишите номер варианта, чтобы закончить опрос - "!результат"`;
					}
				}

        Quiz.isActive = true;
      }
    } else {
      answer = `@${user} !опрос вариант_1 вариант_2... вариант_N`;
    }
	}
	
  client.say(target, answer);
}

function result(user, target) {
	let answer;
	if (Quiz.isActive) {
		if (Quiz.users.length !== 0) {
			answer = '/me Результаты опроса: ';

			for (let i = 1; i <= Object.keys(Quiz.variants).length; i++) {
				answer += `"${Quiz.variants[i][0]}" - ${(Quiz.variants[i][1] / Quiz.users.length * 100).toFixed(2)}%(${Quiz.variants[i][1]})`;
				if (i < Object.keys(Quiz.variants).length) {
					answer += ', ';
				}
			}
		} else {
			answer = `@${user} никто не проголосовал`;
		}

		Quiz.isActive = false;
		Quiz.variants = {};
		Quiz.users = [];
	} else {
		answer = `@${user} опрос не активен'`;
	}

	client.say(target, answer);
}

function say(text, target) {
	client.say(target, text);
}