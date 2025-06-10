import { useState } from 'react'
import './App.css'

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
