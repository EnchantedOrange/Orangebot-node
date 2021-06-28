const firstNameList = [
  'Бенедикт',
  'Бандерлог',
  'Бутерброд',
  'Беннихилл',
  'Бандероль',
  'Бергамот',
  'Бромгексин',
  'Бандикут',
  'Бабайгей',
  'Бенефис',
  'Бандерштадт',
  'Беломор',
  'Бандергольф',
  'Бандероль',
  'Будапешт',
  'Барбарис',
  'Баклажан',
  'Букерман',
  'Бабблгам',
  'Бекмамбет',
  'Бартикрауч',
  'Бенефактор',
  'Бамблби',
  'Бонифаций',
  'Бадминтон',
  'Барабас',
  'Букингем',
  'Варфарин',
  'Баттлфилд',
  'Боромир',
  'Бугимен',
  'Бубенец',
  'Буерак',
  'Бафомет',
  'Базилик',
  'Бенадрил',
  'Бургеркинг',
  'Бранденбург',
  'Библетумб',
  'Богомол',
  'Бармалей',
  'Баттлнет',
  'Божийсын',
];

const lastNameList = [
  'Камбербэтч',
  'Кукумбер',
  'Кисигачь',
  'Казантип',
  'Хохлосрач',
  'Киберскотч',
  'Купидон',
  'Карабас',
  'Киберсвитч',
  'Кёнинсберг',
  'Достаньмеч',
  'Корвалол',
  'Поймалснитч',
  'Брудершафт',
  'Камамбер',
  'Лелтопкек',
  'Кандибобер',
  'Кабблстоун',
  'Когтевран',
  'Визардкок',
  'Коленвал',
  'Контерстрайк',
  'Лаггеджстор',
  'Трахтенберг',
  'Вездесрач',
  'Хасавюрт',
  'Чеддерчиз',
  'Хэндивотч',
  'Драмнбейс',
  'Вымпелком',
  'Данкешон',
  'Бугенштырь',
  'Кабачок',
  'Стилмаймеч',
  'Комбикорм',
  'Минигольф',
  'Кайзершнаутц',
  'Канифоль',
  'Филмайтач',
  'Курткобейн',
  'Кибердвач',
  'Ктовоскрес',
];

const romeDict = {
  u: {
    0: '',
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
  },
  d: {
    0: '',
    1: 'X',
    2: 'XX',
    3: 'XXX',
    4: 'XL',
    5: 'L',
    6: 'LX',
    7: 'LXX',
    8: 'LXXX',
    9: 'XC',
  },
  h: {
    0: '',
    1: 'C',
    2: 'CC',
    3: 'CCC',
    4: 'CD',
    5: 'D',
    6: 'DC',
    7: 'DCC',
    8: 'DCCC',
    9: 'CM',
  },
  m: { 0: '', 1: 'M', 2: 'MM', 3: 'MMM' },
};

const puntoDict = {
  q: 'й',
  w: 'ц',
  e: 'у',
  r: 'к',
  t: 'е',
  y: 'н',
  u: 'г',
  i: 'ш',
  o: 'щ',
  p: 'з',
  '[': 'х',
  ']': 'ъ',
  a: 'ф',
  s: 'ы',
  d: 'в',
  f: 'а',
  g: 'п',
  h: 'р',
  j: 'о',
  k: 'л',
  l: 'д',
  ';': 'ж',
  "'": 'э',
  z: 'я',
  x: 'ч',
  c: 'с',
  v: 'м',
  b: 'и',
  n: 'т',
  m: 'ь',
  ',': 'б',
  '/': '.',
  Q: 'Й',
  W: 'Ц',
  E: 'У',
  R: 'К',
  T: 'Е',
  Y: 'Н',
  U: 'Г',
  I: 'Ш',
  O: 'Щ',
  P: 'З',
  '{': 'Х',
  '}': 'Ъ',
  A: 'Ф',
  S: 'Ы',
  D: 'В',
  F: 'А',
  G: 'П',
  H: 'Р',
  J: 'О',
  K: 'Л',
  L: 'Д',
  ':': 'Ж',
  '"': 'Э',
  Z: 'Я',
  X: 'Ч',
  C: 'С',
  V: 'М',
  B: 'И',
  N: 'Т',
  M: 'Ь',
  '<': 'Б',
  '>': 'Ю',
  '?': ',',
  '.': 'ю',
  '@': '"',
  '#': '№',
  $: ';',
  '^': ':',
  '&': '?',
  '`': 'ё',
  '~': 'Ё',
  й: 'q',
  ц: 'w',
  у: 'e',
  к: 'r',
  е: 't',
  н: 'y',
  г: 'u',
  ш: 'i',
  щ: 'o',
  з: 'p',
  х: '[',
  ъ: ']',
  ф: 'a',
  ы: 's',
  в: 'd',
  а: 'f',
  п: 'g',
  р: 'h',
  о: 'j',
  л: 'k',
  д: 'l',
  ж: ';',
  э: "'",
  я: 'z',
  ч: 'x',
  с: 'c',
  м: 'v',
  и: 'b',
  т: 'n',
  ь: 'm',
  б: ',',
  ю: '.',
  Й: 'Q',
  Ц: 'W',
  У: 'E',
  К: 'R',
  Е: 'T',
  Н: 'Y',
  Г: 'U',
  Ш: 'I',
  Щ: 'O',
  З: 'P',
  Х: '{',
  Ъ: '}',
  Ф: 'A',
  Ы: 'S',
  В: 'D',
  А: 'F',
  П: 'G',
  Р: 'H',
  О: 'J',
  Л: 'K',
  Д: 'L',
  Ж: ':',
  Э: '"',
  Я: 'Z',
  Ч: 'X',
  С: 'C',
  М: 'V',
  И: 'B',
  Т: 'N',
  Ь: 'M',
  Б: '<',
  Ю: '>',
};

const wastedDict = {
  Q: 'Ц',
  W: 'Ш',
  E: 'Е',
  R: 'Я',
  T: 'Т',
  Y: 'У',
  U: 'Ю',
  O: 'О',
  P: 'Р',
  A: 'А',
  S: 'Ы',
  D: 'Д',
  F: 'Г',
  G: 'Ж',
  H: 'Н',
  J: 'Ь',
  K: 'К',
  L: 'Л',
  Z: 'З',
  X: 'Х',
  C: 'С',
  V: 'В',
  B: 'В',
  N: 'И',
  M: 'М',
  q: 'ц',
  w: 'ш',
  e: 'е',
  r: 'я',
  t: 'т',
  y: 'у',
  u: 'ю',
  o: 'о',
  p: 'р',
  a: 'а',
  s: 'ы',
  d: 'д',
  f: 'г',
  g: 'ж',
  h: 'н',
  j: 'ь',
  k: 'к',
  l: 'л',
  z: 'з',
  x: 'х',
  c: 'с',
  v: 'в',
  b: 'в',
  n: 'и',
  m: 'м',
};

exports.firstNameList = firstNameList;
exports.lastNameList = lastNameList;
exports.romeDict = romeDict;
exports.puntoDict = puntoDict;
exports.wastedDict = wastedDict;