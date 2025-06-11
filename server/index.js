const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// EJSテンプレート設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 静的ファイル配信（ビルド済みReact）
app.use(express.static(path.join(__dirname, '../public')));

// トップページルート
app.get('/', (req, res) => {
  res.render('index');  // EJSをレンダリング
});

// API（ガチャ用）などは今まで通り
const gachaLogic = require('./gachaLogic');
app.get('/api/gacha/:type', (req, res) => {
  const result = gachaLogic.drawGacha(req.params.type);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});