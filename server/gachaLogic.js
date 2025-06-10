const characters = require('../data/characters.json');

function drawGacha(type) {
  let pool = [];

  switch (type) {
    case 'pickup':
      pool = characters.filter(c => c.pickup);
      break;
    case 'anniversary':
      pool = characters.filter(c => c.anniversary);
      break;
    case 'normal':
      pool = characters.filter(c => c.permanent);
      break;
    default:
      pool = characters;
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  return selected;
}

module.exports = { drawGacha };