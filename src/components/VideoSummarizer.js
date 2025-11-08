import React, { useState } from 'react';

function VideoSummarizer() {
    const [videoUrl, setVideoUrl] = useState('');
    const [prompt, setPrompt] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSummarize = async () => {
        setIsLoading(true);
        setError(null);
        setSummary('');

        try {
            const response = await fetch('http://localhost:3001/api/summarize-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoUrl, prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to summarize video.');
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="video-summarizer">
            <h2>YouTube Video Summarizer</h2>
            <div className="input-group">
                <label htmlFor="videoUrl">YouTube Video URL:</label>
                <input
                    type="text"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                />
            </div>
            <div className="input-group">
                <label htmlFor="prompt">Summarization Prompt:</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Summarize the key points of this video."
                />
            </div>
            <button onClick={handleSummarize} disabled={isLoading}>
                {isLoading ? 'Summarizing...' : 'Summarize'}
            </button>
            {error && <div className="error-message">{error}</div>}
            {summary && (
                <div className="summary-output">
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default VideoSummarizer;
