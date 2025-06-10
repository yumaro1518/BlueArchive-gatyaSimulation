import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './App.css'; // デザインCSS別ファイルで調整可

function App() {
  const [result, setResult] = useState([]);
  const [type, setType] = useState("normal");
  const resultRef = useRef(null);

  const drawGacha = async (count) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const res = await fetch(`/api/gacha/${type}`);
      const data = await res.json();
      results.push(data);
    }
    setResult(results);
    saveHistory(results);
  };

  const saveHistory = (results) => {
    const prev = JSON.parse(localStorage.getItem("gachaHistory")) || [];
    const entry = {
      timestamp: new Date().toLocaleString(),
      results
    };
    localStorage.setItem("gachaHistory", JSON.stringify([entry, ...prev]));
  };

  const captureAndDownload = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current);
    const dataUrl = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "gacha_result.png";
    a.click();
  };

  const shareOnTwitter = () => {
    const names = result.map(c => c.name).join("、");
    const tweet = encodeURIComponent(`ブルアカ風ガチャ結果！\n【${names}】\n#ブルアカ #ガチャシミュ`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank");
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>ブルアカ風ガチャシミュ</h1>

      <div style={{ marginBottom: '12px' }}>
        <label>ガチャ種類：</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="normal">通常</option>
          <option value="pickup">ピックアップ</option>
          <option value="anniversary">周年</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button onClick={() => drawGacha(1)}>1連ガチャ</button>
        <button onClick={() => drawGacha(10)}>10連ガチャ</button>
      </div>

      {result.length > 0 && (
        <>
          <div ref={resultRef} style={{
            padding: '16px', background: '#f4f4f4',
            borderRadius: '12px', maxWidth: '600px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '12px'
            }}>
              {result.map((char, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '8px',
                  textAlign: 'center',
                  padding: '4px'
                }}>
                  <img src={char.image} alt={char.name} width={72} />
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginTop: '4px'
                  }}>{char.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '16px'
          }}>
            <button onClick={captureAndDownload}>画像で保存</button>
            <button onClick={shareOnTwitter}>Twitterに投稿</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;