const express = require('express');
const path = require('path');
const gachaLogic = require('./gachaLogic');

const app = express();
const PORT = 3000;

// EJS設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静的ファイル（React & 画像）
app.use(express.static(path.join(__dirname, '../public')));

// トップページ表示
app.get('/', (req, res) => {
  const characters = require('../data/characters.json');
  res.render('index', { characters });
});

// ガチャAPI
app.get('/api/gacha/:type', (req, res) => {
  const result = gachaLogic.drawGacha(req.params.type);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});