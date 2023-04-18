import React, { useState } from 'react';
import axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const Home = () => {
  const [codeText, setCodeText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    setLoading(true);

    try {
      const response = await axios.post('/api/analyzeCode', {
        codeText,
      });
      setSuggestions(response.data.issues);
    } catch (error) {
      console.error('Error analyzing code:', error.response.data);
    }

    setLoading(false);
  };

  const handleCodeTextChange = (event) => {
    setCodeText(event.target.value);
  };

  return (
    <div className='container'>
      <h1>Code Analyzer</h1>
      <textarea
        placeholder="Paste your code here"
        value={codeText}
        onChange={handleCodeTextChange}
        rows="10"
        cols="50"
      ></textarea>
      <button onClick={analyzeCode} disabled={loading}>
        Analyze
      </button>
      {loading && <p>Loading...</p>}
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
      <h2>Highlighted Code</h2>
      <SyntaxHighlighter language="javascript" style={docco}>
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
};

export default Home;
