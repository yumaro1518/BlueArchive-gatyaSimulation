import { useState } from 'react'
import './App.css'
import History from './components/History';
import html2canvas from "html2canvas";
import { useRef } from "react";

const resultRef = useRef(null);
const [showHistory, setShowHistory] = useState(false);

{showHistory ? (
  <History />
) : (
  <>
    {/* 通常ガチャUI */}
    <button onClick={() => setShowHistory(true)}>履歴を見る</button>
  </>
)}
// ガチャ結果を保存する関数 → History.jsxで使用
const saveHistory = (results) => {
  const prev = JSON.parse(localStorage.getItem("gachaHistory")) || [];
  const newEntry = {
    timestamp: new Date().toLocaleString(),
    results: results
  };
  localStorage.setItem("gachaHistory", JSON.stringify([newEntry, ...prev]));
};
// ガチャボタン押下時
const drawGacha = async (count) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    const res = await fetch(`/api/gacha/${type}`);
    const data = await res.json();
    results.push(data);
  }
  setResult(results);
  saveHistory(results);  // ←ここで履歴保存
};


// X(旧Twitter)にテンプレートと結果を投稿する関数
const shareOnTwitter = () => {
  if (result.length === 0) {
    alert("まずはガチャを引いてください！");
    return;
  }

  const characterNames = result.map(c => c.name).join("、");
  const tweetText = encodeURIComponent(`ブルアカ風ガチャ結果！\n【${characterNames}】\n#ガチャシミュ #ブルアカ`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  window.open(twitterUrl, '_blank');
};
{result.length > 0 && (
  <div style={{ marginTop: '10px' }}>
    <button onClick={shareOnTwitter}>Twitterにシェア</button>
  </div>
)}


//ガチャ結果のDOMをrefで囲む
<div ref={resultRef}>
  {result.map((char, idx) => (
    <div key={idx}>
      <img src={char.image} />
      <div>{char.name}</div>
    </div>
  ))}
</div>
//ボタンで画像化して保存
const captureAndDownload = async () => {
  if (!resultRef.current) return;
  const canvas = await html2canvas(resultRef.current);
  const dataUrl = canvas.toDataURL("image/png");

  // 自動ダウンロード
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "gacha_result.png";
  link.click();
};
{result.length > 0 && (
  <button onClick={captureAndDownload}>
    ガチャ結果を画像で保存
  </button>
)}


function App() {
  const [result, setResult] = useState([]);
  const [type, setType] = useState('normal');

  const drawGacha = async (count) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const res = await fetch(`/api/gacha/${type}`);
      const data = await res.json();
      results.push(data);
    }
    setResult(results);
  };

  return (
    <div>
      <h1>ブルアカ風ガチャシミュ</h1>
      <label>
        ガチャ種類:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="normal">通常</option>
          <option value="pickup">ピックアップ</option>
          <option value="anniversary">周年</option>
        </select>
      </label>

      <div>
        <button onClick={() => drawGacha(1)}>1連ガチャ</button>
        <button onClick={() => drawGacha(10)}>10連ガチャ</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 16 }}>
        {result.map((char, idx) => (
          <div key={idx} style={{ margin: '8px', textAlign: 'center' }}>
            <img src={char.image} alt={char.name} width={80} />
            <div>{char.name}</div>
            <div>Tier: {char.tier}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default App;
