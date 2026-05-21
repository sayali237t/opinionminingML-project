import bgImage from '../assets/bg.png'; // Import background image

export default function What() {
    return (
        <div 
            className="min-h-screen w-screen text-white flex flex-col items-center justify-center py-12 px-4 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Title */}
            <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                What is Sentiment Analysis?
            </h2>

            {/* Content Section */}
            <div className="max-w-3xl w-full space-y-6">
                {[
                    {
                        title: "What is Sentiment Analysis?",
                        text: "Sentiment analysis is the process of determining the emotional tone behind a body of text. It helps us understand attitudes, opinions, and emotions expressed in online mentions, reviews, or comments.",
                    },
                    {
                        title: "Implementation in Our Project",
                        text: "We use machine learning techniques like Bag of Words (BoW), TF-IDF, and Word2Vec to analyze transliterated Marathi text. The model is trained on a large corpus of data and provides real-time predictions of sentiment.",
                    },
                    {
                        title: "Dataset Details & Kaggle Link",
                        text: "The dataset used in this project is curated from various sources, including social media comments in transliterated Marathi. You can access the dataset on Kaggle using the link below:",
                        link: "https://www.kaggle.com/datasets/gurunathsalve/transliterated-marathi-dataset",
                    },
                ].map((item, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
                        <h3 className="text-2xl font-semibold text-purple-400">{item.title}</h3>
                        <p className="mt-2 text-gray-300">{item.text}</p>
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline mt-2 inline-block">
                                Kaggle Dataset
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
