import { useEffect, useState } from 'react';

//ガチャ履歴を一覧表示するコンポーネント(ページ要素)
const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("gachaHistory")) || [];
    setHistory(stored);
  }, []);

  return (
    <div>
      <h2>ガチャ履歴</h2>
      {history.length === 0 ? (
        <p>履歴がありません。</p>
      ) : (
        history.map((entry, idx) => (
          <div key={idx} style={{ borderBottom: '1px solid #ccc', margin: '8px 0' }}>
            <p>日時: {entry.timestamp}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {entry.results.map((char, i) => (
                <div key={i} style={{ margin: '4px', textAlign: 'center' }}>
                  <img src={char.image} width={60} />
                  <div>{char.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;