  import React, { useState } from 'react';
  import axios from 'axios';
  import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
  import dynamic from 'next/dynamic';
  import { RotatingTriangles, Triangle } from 'react-loader-spinner';

  const AceEditor = dynamic(
    import('react-ace').then((mod) => mod.default),
    { ssr: false }
  );

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

  return (
    <div className='container' style={{ fontFamily: 'Arial', margin: 'auto', width: '50%', padding: '10px' }}>
      <h1 style={{ textAlign: 'center' }}>Code Review Bot</h1>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={codeText}
        onChange={setCodeText}
        name="codeEditor"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        style={{ width: '100%', marginBottom: '20px' }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <button
        onClick={analyzeCode}
        disabled={loading}
        style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {loading && (
        <div className="loading">
          <Triangle
            visible={true}
            height="80"
            width="80"
            ariaLabel="rotating-triangels-loading"
            wrapperStyle={{}}
            wrapperClass="rotating-triangels-wrapper"
          />
          <p>Loading...</p>
        </div>
      )}
      {suggestions.length > 0 && <h2 style={{ marginBottom: '10px' }}>Suggestions</h2>}
      <ul style={{ padding: '10px' }}>
        {suggestions.map((suggestion, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <strong>Line {suggestion.lineNumber}:</strong> {suggestion.issue}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Highlighted Code</h2>
      <div style={{ padding: '10px' }}>
        <SyntaxHighlighter language="javascript" style={docco}>
          {codeText}
        </SyntaxHighlighter>
      </div>
      <div className="donation-section">
        <h2>Support Our Work</h2>
        <p>
          We're glad you're finding this Resume Analyzer helpful! We developed this tool to support job seekers like you.
          However, running this service involves some costs. For example, each time the tool analyzes a resume, it makes an API call which incurs a cost. 
          To keep this service free and accessible to all, we're relying on the generosity of users who are able to contribute.
        </p>
        <p>
          If you're in a position to do so, please consider supporting our work. Any contribution, no matter how small, can make a big difference and allow us to continue improving and maintaining this tool. 
          Thank you for your support!
        </p>
        <a href="https://www.buymeacoffee.com/thebranch" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
            alt="Buy Me A Coffee" 
            style={{height: 50, width: 217}}
          />
        </a>
      </div>
    </div>
  );
};

export default Home;
