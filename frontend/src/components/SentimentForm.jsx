import { useState } from "react";

export default function SentimentForm() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisMode, setAnalysisMode] = useState("paragraph"); // "sentence" or "paragraph"

    // Function to get color based on sentiment label
    const getSentimentColor = (label) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("positive")) return "text-green-400";
        if (lowerLabel.includes("negative")) return "text-red-400";
        return "text-yellow-400";
    };

    // Function to get background color for score display
    const getScoreColor = (score) => {
        if (score >= 1) return "bg-green-500/20 border-green-400";
        if (score <= -1) return "bg-red-500/20 border-red-400";
        return "bg-yellow-500/20 border-yellow-400";
    };

    const analyzeSentiment = async () => {
        if (!text.trim()) {
            alert("Please enter some text.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const endpoint = analysisMode === "sentence" ? "analyze_sentence" : "analyze_paragraph";
            const requestBody = analysisMode === "sentence" 
                ? { text } 
                : { paragraph: text };

            const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Analysis failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Clear results when switching modes
    const handleModeChange = (mode) => {
        setAnalysisMode(mode);
        setResult(null);
        setError(null);
    };

    return (
        <div className="flex items-center justify-center bg-black text-white px-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-8 w-full max-w-2xl">
                
                {/* Mode Selection */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-center text-white">
                        Transliterated Marathi Sentiment Analysis
                    </h2>
                    <div className="flex space-x-2 bg-white/5 p-1 rounded-lg">
                        <button
                            className={`flex-1 py-2 px-4 rounded-md transition-all ${
                                analysisMode === "sentence"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                            onClick={() => handleModeChange("sentence")}
                        >
                            Single Sentence
                        </button>
                        <button
                            className={`flex-1 py-2 px-4 rounded-md transition-all ${
                                analysisMode === "paragraph"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-white"
                            }`}
                            onClick={() => handleModeChange("paragraph")}
                        >
                            Paragraph
                        </button>
                    </div>
                </div>

                {/* Input Box */}
                <textarea
                    className="w-full p-4 bg-white/20 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-300 resize-none"
                    placeholder={`Enter transliterated Marathi ${analysisMode}...`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={analysisMode === "paragraph" ? 6 : 3}
                ></textarea>

                {/* Analyze Button */}
                <button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 mt-4 rounded-lg hover:opacity-80 transition-all disabled:opacity-50 font-medium"
                    onClick={analyzeSentiment}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : `Analyze ${analysisMode === "sentence" ? "Sentence" : "Paragraph"}`}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-400 rounded-lg">
                        <p className="text-red-400 text-center">{error}</p>
                    </div>
                )}

                {/* Sentiment Result */}
                {result && (
                    <div className="mt-6 space-y-4">
                        {analysisMode === "sentence" ? (
                            // Single Sentence Result
                            <div className={`p-4 rounded-lg border ${getScoreColor(result.score)}`}>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-white mb-2">Analysis Result</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-300">
                                            <span className="font-medium">Sentiment:</span>
                                            <span className={`ml-2 font-semibold ${getSentimentColor(result.label)}`}>
                                                {result.label}
                                            </span>
                                        </p>
                                        <p className="text-gray-300">
                                            <span className="font-medium">Score:</span>
                                            <span className="ml-2 font-bold text-white">{result.score}</span>
                                        </p>
                                        {result.cleaned_text !== text.trim() && (
                                            <p className="text-sm text-gray-400 mt-2">
                                                <span className="font-medium">Processed text:</span> {result.cleaned_text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Paragraph Result
                            <div className={`p-4 rounded-lg border ${getScoreColor(result.average_score)}`}>
                                <div className="text-center mb-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">Overall Sentiment</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-300">
                                            <span className="font-medium">Average Sentiment:</span>
                                            <span className={`ml-2 font-semibold ${getSentimentColor(result.average_label)}`}>
                                                {result.average_label}
                                            </span>
                                        </p>
                                        <p className="text-gray-300">
                                            <span className="font-medium">Average Score:</span>
                                            <span className="ml-2 font-bold text-white">{result.average_score}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Sentence-by-sentence breakdown */}
                                {result.sentence_details && result.sentence_details.length > 1 && (
                                    <div className="mt-4 pt-4 border-t border-white/20">
                                        <h4 className="text-md font-medium text-white mb-3 text-center">
                                            Sentence Breakdown
                                        </h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {result.sentence_details.map((detail, index) => {
                                                const [label, score] = detail.split(' [');
                                                const numericScore = score ? parseInt(score.replace(']', '')) : 0;
                                                
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={`p-2 rounded border text-sm ${getScoreColor(numericScore)}`}
                                                    >
                                                        <span className="text-gray-300">Sentence {index + 1}: </span>
                                                        <span className={getSentimentColor(label)}>
                                                            {detail}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}