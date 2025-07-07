import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/summarize", { text });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setSummary(" Failed to summarize text.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🧠 <b><i>MindMint</i></b>: AI Summarizer</h1>
      <textarea
        placeholder= "Paste or type text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div className="summary-box">
          <h2>📝 Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
