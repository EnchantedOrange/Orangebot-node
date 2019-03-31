const tmi = require('tmi.js'),
      fetch = require('node-fetch'),
      options = require('./options'),
      db = require('better-sqlite3')('db.db');
const client = new tmi.client(options);

const firstNameList = ['Бенедикт', 'Бандерлог', 'Бутерброд', 'Беннихилл', 'Бандероль',
	'Бергамот', 'Бромгексин', 'Бандикут', 'Бабайгей', 'Бенефис', 'Бандерштадт', 'Беломор',
	'Бандергольф', 'Бандероль', 'Будапешт', 'Барбарис', 'Баклажан', 'Букерман', 'Бабблгам',
	'Бекмамбет', 'Бартикрауч', 'Бенефактор', 'Бамблби', 'Бонифаций', 'Бадминтон', 'Барабас',
	'Букингем', 'Варфарин', 'Баттлфилд', 'Боромир', 'Бугимен', 'Бубенец', 'Буерак', 'Бафомет',
	'Базилик', 'Бенадрил', 'Бургеркинг', 'Бранденбург', 'Библетумб', 'Богомол', 'Бармалей', 'Баттлнет'];
const lastNameList = ['Камбербэтч', 'Кукумбер', 'Кисигачь', 'Казантип', 'Хохлосрач',
	'Киберскотч', 'Купидон', 'Карабас', 'Киберсвитч', 'Кёнинсберг', 'Достаньмеч', 'Корвалол',
	'Поймалснитч', 'Брудершафт', 'Камамбер', 'Лелтопкек', 'Кандибобер', 'Кабблстоун',
	'Когтевран', 'Визардкок', 'Коленвал', 'Контерстрайк', 'Лаггеджстор', 'Трахтенберг',
	'Вездесрач', 'Хасавюрт', 'Чеддерчиз', 'Хэндивотч', 'Драмнбейс', 'Вымпелком', 'Данкешон',
	'Бугенштырь', 'Кабачок', 'Стилмаймеч', 'Комбикорм', 'Минигольф', 'Кайзершнаутц',
	'Канифоль', 'Филмайтач', 'Курткобейн', 'Кибердвач'];

let people = {};
options.channels.forEach(c => {
	people[c] = [];
});

let Quiz = {
	isActive: false,
	variants: {},
	users: [],
	channel: ''
};

let Duel = {
	isActive: false,
	user1: '',
	user2: ''
};

let globalTarget;



client.on('connected', () => console.log('Konnekted!'));

client.on('message', (target, context, msg, self) => {
	globalTarget = target;
	const user = context.username;
	console.log(`{${target}} <${user}>: ${msg}`);



	if (self || options.idleChannels.includes(target.split('#')[1])) return;


	const isAdmin = options.admins.includes(user);

	if (!people[target].includes(user)) {
		people[target].push(user);
	}

	const row = db.prepare(`SELECT * FROM ${target.split('#')[1]} WHERE nick = ?`).get(user);
	if (row) {
		db.prepare(`UPDATE ${target.split('#')[1]} SET count = count + 1 WHERE nick = ?`).run(user);
	} else {
		db.prepare(`INSERT INTO ${target.split('#')[1]} VALUES(?, 1, 10)`).run(user);
	}

  if (Quiz.isActive && Object.keys(Quiz.variants).includes(msg) && !Quiz.users.includes(user) && target === Quiz.channel) {
		Quiz.variants[msg][1] += 1;
		Quiz.users.push(user);
	}

	if (msg.startsWith(options.commandPrefix)) {
		const command = msg.split(options.commandPrefix)[1].split(' ')[0];
		const opts = msg.split(`${command} `)[1];

		if (Duel.isActive && user === Duel.user2) {
			switch (command) {
				case 'принять':
					let winner;

					if (Math.random() >= 0.5) {
						winner = Duel.user1;
					} else {
						winner = Duel.user2;
					}

					client.say(globalTarget, `${winner} победил!`);

					Duel.isActive = false;
					break;
				case 'отказ':
					client.say(globalTarget, `${Duel.user2} отказался от участия в дуэли`);
					Duel.isActive = false;
					break;
			}
		}

		switch (command) {
			case 'рим':
				romeTranslator(opts, user);
				break;
			case 'кпд':
				kpd(user);
				break;
			case 'punto':
				punto(opts, user);
				break;
			case 'реверс':
				reverse(opts, user);
				break;
			case 'count':
				count(opts, user);
				break;
			case 'top':
				topCount(user);
				break;
			case 'wasted':
				wasted(opts, user);
				break;
			case 'опрос':
				if (isAdmin || context.mod || context.badges.broadcaster === '1') {
					quiz(opts, user);
				}
				break;
			case 'результат':
				if (Quiz.channel === target && (isAdmin || context.mod || context.badges.broadcaster === '1')) {
					result(user);
				}
				break;
			case 'скажи':
				if (isAdmin || context.badges.broadcaster === '1') {
					say(opts);
				}
				break;
			case 'скажив':
				if (isAdmin) {
					sayTo(opts);
				}
				break;
			case 'соурплс':
				sourpls();
				break;
			case 'slap':
				slap(opts, user);
				break;
			case 'сэм':
				sam(opts, user);
				break;
			case 'bc':
				benedict(user);
				break;
			case 'дуэль':
				duel(opts, user);
				break;
			case 'throw':
				throwDie(user);
				break;
			case 'снежок':
				snowball(opts, user);
				break;
			case 'help':
			case 'команды':
				client.say(globalTarget, `@${user} список команд: http://enchantedorange.co.nf/commands.html`);
				break;
			case 'off':
				isAdmin && powerOff();
				break;



			case 'delete':
				if (isAdmin) {
					deleteTable(opts, user);
				}
				break;
			case 'rename':
				if (isAdmin) {
					renameTable(opts, user);
				}
				break;
			case 'msgv':
				if (isAdmin) {
					messageValue(opts, user);
				}
				break;
			case 'renameuser':
				if (isAdmin) {
					renameUser(opts, user);
				}
				break;
			case 'clear':
				if (isAdmin) {
					clearDatabase(user);
				}
				break;
			case 'deleteuser':
				if (isAdmin) {
					deleteUser(opts, user);
				}
				break;
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



function romeTranslator(num, user) {
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

	client.say(globalTarget, `@${user} ${result}`);
}

function kpd(user) {
	const channel = globalTarget.split('#')[1];
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
							client.say(globalTarget, `@${user} ${kpd}%`);
						});
				});
		});
}

function punto(text, user) {
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

	client.say(globalTarget, answer);
}

function reverse(text, user) {
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

	client.say(globalTarget, answer);
}

function count(targetUser, user) {
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

	const row = db.prepare(`SELECT count FROM ${globalTarget.split('#')[1]} WHERE nick = ?`).get(targetUser);

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

	client.say(globalTarget, answer);
}

function topCount(user) {
	const stmt = db.prepare(`SELECT * FROM ${globalTarget.split('#')[1]} ORDER BY count DESC`);
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

	client.say(globalTarget, result);
}

function wasted(text, user) {
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

	client.say(globalTarget, answer);
}

function quiz(text, user) {
  let answer;
	if (Quiz.isActive) {
		answer = `@${user} опрос уже активен!`;
	} else {
    if (text) {
			Quiz.channel = globalTarget;
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
	
  client.say(globalTarget, answer);
}

function result(user) {
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

	client.say(globalTarget, answer);
}

function say(text) {
	client.say(globalTarget, text);
}

function sayTo(text) {
	channel = text.split(' ')[0];
	text = text.split(`${channel} `)[1];

	client.say(`#${channel}`, text);
}

function sourpls() {
	client.say(globalTarget, 'sourPls ' * Math.floor(Math.random() * 20) + 10);
}

function slap(text, user) {
	let targetUser;
	let answer;
	
	if (text) {
		if (!isForbidden(text)) {
			targetUser = text.includes('@') ? text.split('@')[1] : text;
		} else {
			client.say(globalTarget, `@${user} не-а Kappa`);
			return;
		}
	} else {
		targetUser = people[globalTarget][Math.floor(Math.random() * people[globalTarget].length)];
	}

	const vars = [
		`${user}дёрнул ${targetUser} за косу`,
		`${user} задрал юбку ${targetUser}`,
		`${user} шлёпнул ${targetUser}`,
		`${user} напоил чаем ${targetUser}`,
		`${user} катается на качелях с ${targetUser}`,
		`${user} пьёт кофе с ${targetUser}`,
		`${user} развратил ${targetUser}`,
		`${user} ест блины с ${targetUser}`,
		`${user} насилует ${targetUser}`,
		`${user} кричит на ${targetUser}`,
		`${user} танцует с ${targetUser}`,
		`${user} укусил ${targetUser}`,
		`${user} лизнул ${targetUser}`,
		`${user} взломал аккаунт ${targetUser}`,
		`${user} катается на ${targetUser}`,
		`${user} украл ${targetUser}`,
		`${user} обнял ${targetUser}`,
		`${user} пожал руку ${targetUser}`
	];
	answer = vars[Math.floor(Math.random() * vars.length)];

	client.say(globalTarget, answer);
}

function sam(text, user) {
	let targetUser;
	if (!text || isForbidden(text)) {
		targetUser = user;
	} else {
		targetUser = text;
	}

	let answer;

	if (Math.floor(Math.random() * 20) === 1) {
		answer = `PogChamp PogChamp PogChamp для ${targetUser} есть письмо PogChamp PogChamp PogChamp`;
	} else {
		answer = `для ${targetUser} писем нет`;
	}

	client.say(globalTarget, answer);
}

function benedict(user) {
	const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
	const lastName = lastNameList[Math.floor(Math.random() * lastNameList.length)];

	let answer;

	if (firstName === 'Бенедикт' && lastName === 'Камбербэтч') {
		answer = `PogChamp PogChamp PogChamp @${user} наконец-то правильно назвал имя великого учёного ${firstName}а ${lastName}а! Поздравьте его! PogChamp PogChamp PogChamp`;
	} else {
		answer = `${firstName} ${lastName}`;
	}

	client.say(globalTarget, answer);
}

function duel(text, user) {
	Duel.user1 = user;

	if (text) {
		if (text.includes('@')) {
			Duel.user2 = text.split('@')[1].toLowerCase();
		} else {
			Duel.user2 = text.toLowerCase();
		}
	} else {
		client.say(globalTarget, `@${user} укажите пользователя, которого хотите вызвать на дуэль`);
		return;
	}

	let answer;

	if (people[globalTarget].includes(Duel.user2)) {
		Duel.isActive = true;
		answer = `${Duel.user1} вызвал на дуэль ${Duel.user2}! ${Duel.user2}, чтобы принять вызов, напишите "!принять", чтобы отказаться - "!отказ"`;
	} else {
		answer = `@${user}такого пользователя нет в чате`;
	}

	client.say(globalTarget, answer);
}

function throwDie(user) {
	const die1 = Math.round((Math.random() * 5) + 1);
	const die2 = Math.round((Math.random() * 5) + 1);

	let answer;

	if (die1 === 6 && die2 === 6) {
		answer = `@${user} Вы выбросили ${die1} и ${die2} и выиграли!`;
	} else {
		answer = `@${user} Вы выбросили ${die1} и ${die2}`;
	}

	client.say(globalTarget, answer);
}

function snowball(text, user) {
	let answer;

	const damage = Math.floor(Math.random() * 4);

	function defHp(targetUser) {
		let result;

		if (damage > 0) {
			const hp = db.prepare(`SELECT health FROM ${globalTarget.split('#')[1]} WHERE nick = ?`).get(targetUser).health;

			if ((hp - damage) > 0) {
				db.prepare(`UPDATE ${globalTarget.split('#')[1]} SET health = health - ? WHERE nick = ?`).run(damage, targetUser);
				result = `${user} бросил снежок в ${targetUser}. Его здоровье - ${hp - damage} <3`;
			} else {
				db.prepare(`UPDATE ${globalTarget.split('#')[1]} SET health = 10 WHERE nick = ?`).run(targetUser);
				result = `${targetUser} пал от снежка ${user}`;
			}
		} else {
			result = `${user} промахнулся`;
		}

		return result;
	}

	let targetUser;

	if (text) {
		targetUser = text.includes('@') ? text.split('@')[1].toLowerCase() : text.toLowerCase();
		
		if (people[globalTarget].includes(targetUser)) {
			answer = defHp(targetUser);
		} else if (!isForbidden(targetUser)) {
			answer = `${user} бросил снежок в ${targetUser}`;
		} else {
			answer = `@${user} не-а Kappa`;
		}
	} else {
		targetUser = people[globalTarget][Math.floor(Math.random() * people[globalTarget].length)];
		answer = defHp(targetUser);
	}

	client.say(globalTarget, answer);
}

function powerOff() {
	client.say(globalTarget, '/me Отключение');
	throw new Error('Бот отключён');
}



function deleteTable(text, user) {
	let answer;

	try {
		db.prepare(`DROP TABLE ${text}`).run();
		answer = `@${user} таблица ${text} удалена`;
	} catch(err) {
		answer = `@${user} неправильно`;
	}

	client.say(globalTarget, answer);
}

function renameTable(text, user) {
	if (text) {
		let answer;
		const oldName = text.split(' ')[0];
		const newName = text.split(`${oldName} `)[1];

		try {
			db.prepare(`ALTER TABLE ${oldName} RENAME TO ${newName}`).run();
			answer = `@${user} таблица ${oldName} переименована в ${newName}`;
		} catch(err) {
			answer = `@${user} неправильно`;
		}

		client.say(globalTarget, answer);
	}
}

function messageValue(text, user) {
	if (text) {
		let answer;
		let targetUser = text.split(' ')[0];
		const messages = text.split(`${targetUser} `)[1];
		const target = globalTarget.split('#')[1];

		targetUser = targetUser.includes('@') ? targetUser.split('@')[1].toLowerCase() : targetUser.toLowerCase();

		try {
			answer = `@${user} значение количества сообщений пользователя ${targetUser} изменено: `;

			if (messages.includes('+')) {
				db.prepare(`UPDATE ${target} SET count = count + ? WHERE nick = ?`).run(messages.split('+')[1], targetUser);
				answer += `добавлено ${messages.split('+')[1]} сообщений`;
			} else if (messages.includes('-')) {
				db.prepare(`UPDATE ${target} SET count = count - ? WHERE nick = ?`).run(messages.split('-')[1], targetUser);
				answer += `убрано ${messages.split('-')[1]} сообщений`;
			} else {
				db.prepare(`UPDATE ${target} SET count = ? WHERE nick = ?`).run(messages, targetUser.toLowerCase());
				answer += `теперь оно равно ${messages}`;
			}
		} catch(err) {
			answer = `@${user} неправильно`;
		}

		client.say(globalTarget, answer);
	}
}

function renameUser(text, user) {
	if (text) {
		let answer;

		const oldName = text.split(' ')[0];
		const newName = text.split(`${oldName} `)[1];

		oldName = oldName.includes('@') ? oldName.split('@')[1].toLowerCase() : oldName.toLowerCase();
		newName = newName.includes('@') ? newName.split('@')[1].toLowerCase() : newName.toLowerCase();

		try {
			options.channels.forEach(channel => {
				db.prepare(`UPDATE ${channel} SET nick = ? WHERE nick = ?`).run(newName, oldName);
			});

			answer = `@${user} пользователь ${oldName} переименован в ${newName} во всех таблицах`;
		} catch(err) {
			answer = `@${user} неправильно`;
		}

		client.say(globalTarget, answer);
	}
}

function clearDatabase(user) {
	client.say(globalTarget, '/me Проводится очистка базы данных, пожалуйста, подождите...');
	options.channels.forEach(channel => {
		channel = channel.split('#')[1];

		let checkUsers = [];
		const data = db.prepare(`SELECT * FROM ${channel}`).all();

		for (const chunk of data) {
			if (checkUsers.includes(chunk.nick) || chunk.count < 2) {
				db.prepare(`DELETE FROM ${channel} WHERE nick = ?`).run(chunk.nick);
			} else {
				checkUsers.push(chunk.nick);
			}
		}
	});

	client.say(globalTarget, `@${user}, база данных очищена`);
}

function deleteUser(text, user) {
	let answer;

	try {
		const targetUser = text.includes('@') ? text.split('@')[1].toLowerCase() : text.toLowerCase();
		db.prepare(`DELETE FROM ${globalTarget} WHERE nick = ?`).run(targetUser);
		answer = `@${user} пользователь ${targetUser} удалён`;
	} catch(err) {
		answer = `@${user} пользователь не найден`;
	}

	client.say(globalTarget, answer);
}