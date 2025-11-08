import React from 'react';
import VideoSummarizer from './components/VideoSummarizer';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Multimodal AI Video Summarizer</h1>
            </header>
            <main>
                <VideoSummarizer />
            </main>
        </div>
    );
}

export default App;
