import SentimentForm from "../components/SentimentForm.jsx";
import bgImage from "../assets/bg.png"; // Import background image

export default function Home() {
    return (
        <div 
            className="flex mt-[-10%] flex-col items-center justify-center min-h-screen w-screen text-white px-6 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="bg-transparent">
            {/* Centered Content Wrapper */}
            <div className="max-w-4xl w-full text-center">
                
                {/* Engaging Title */}
                <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg">
                    Decode Emotions in Text  
                </h1>

                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Uncover hidden emotions in transliterated Marathi text with AI-powered sentiment analysis.  
                    Instantly detect if a statement is Positive, Negative, or Neutral.
                </p>

                {/* Sentiment Input Form */}
                <SentimentForm placeholder="Type or paste Marathi text here..." />
            </div>

            </div>
            {/* Disclaimer Bar */}
            <div className="fixed bottom-0 w-full bg-gray-900 text-gray-300 text-center py-3 shadow-lg">
                ⚠️ Sentiment analysis results are AI-generated and may not always be accurate. Please interpret accordingly.
            </div>
        </div>
    );
}
