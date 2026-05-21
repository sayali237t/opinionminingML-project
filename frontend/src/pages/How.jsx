import bgImage from '../assets/bg.png'; // Import background image

export default function How() {
    return (
        <div 
            className="min-h-screen w-screen text-white flex flex-col items-center justify-center py-12 px-4 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Title */}
            <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                How to Use
            </h2>

            {/* Steps Section */}
            <div className="max-w-3xl w-full space-y-6">
                {[
                    "Enter the transliterated Marathi text in the box.",
                    "Click the 'Analyze Sentiment' button to process the text.",
                    "See the sentiment result (Positive, Negative, or Neutral) along with the score."
                ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-6 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
                        <div className="w-10 h-10 flex items-center justify-center text-lg font-semibold text-white border border-gray-400/50 rounded-full">
                            {index + 1}
                        </div>
                        <p className="text-lg text-gray-300">{step}</p>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl w-full mt-12">
                <h3 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                    Frequently Asked Questions
                </h3>
                <div className="space-y-6">
                    {[
                        { q: "Can I enter text in Devanagari script?", a: "No, this model is trained for Romanized Marathi only." },
                        { q: "How accurate is the sentiment analysis?", a: "Our model achieved 81% accuracy using an SVM + BoW approach." },
                        { q: "What if my text has mixed languages?", a: "The model works best with pure transliterated Marathi but can handle minor code-mixing." }
                    ].map((faq, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
                            <p className="text-lg font-semibold text-purple-500">Q: {faq.q}</p>
                            <p className="text-lg text-gray-300 mt-2">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
