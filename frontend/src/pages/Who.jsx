import Guru from '../assets/Guru.jpg';
import RJS from '../assets/RJS.jpg';
import Sid from '../assets/Sid.jpg'
import Sayali from '../assets/Sayali.png'
import bgImage from '../assets/bg.png';

export default function Who() {
    return (
        <div 
            className="min-h-screen w-screen text-white flex flex-col items-center justify-center py-12 px-4 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Title */}
            <h2 className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                Who We Are
            </h2>

            {/* Team Section */}
            <div className="max-w-5xl w-full">
                <div className="flex flex-wrap justify-center md:justify-between gap-8">
                    {[
                        { 
                            name: "Siddhi Pardeshi", 
                            img: Sid, 
                            contribution: "Siddhi led dataset curation, collecting, structuring, and preprocessing transliterated Marathi text for training. She also developed the FastAPI-based sentiment prediction system and integrated it into the web interface. Additionally, she played a key role in the research paper, contributing to the literature review, research gap identification, and writing. She also assisted in UI design and testing to enhance the user experience." 
                        },
                        { 
                            name: "Gurunath Salve", 
                            img: Guru, 
                            contribution: "Gurunath was responsible for data preprocessing and NLP techniques, applying tokenization, stopword removal, and feature extraction using BoW, TF-IDF, and Word2Vec. He led machine learning model development, training and fine-tuning Logistic Regression and SVM models for optimal performance. He also structured and published the dataset on Kaggle and managed final testing and integration to ensure smooth functionality." 
                        },
                        { 
                            name: "Sayali Thakur", 
                            img: Sayali, 
                            contribution: "Sayali contributed to dataset curation, assisting in data collection and annotation for sentiment classification. She conducted performance evaluation, analyzing model accuracy, precision, recall, and F1-score. She also managed project documentation, compiling reports and structuring research findings. Additionally, she worked on model optimization and comparative analysis, determining SVM + BoW as the best-performing model." 
                        }
                    ].map((member, index) => (
                        <div key={index} className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 w-72 text-center">
                            <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                            <div className="text-lg font-semibold text-purple-500">{member.name}</div>
                            <p className="text-gray-300 text-justify text-sm">{member.contribution}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guide Contribution Section */}
            <h2 className="text-2xl mt-10 font-bold text-center bg-gradient-to-r from-pink-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
                Our Guide
            </h2>
            <div className="max-w-5xl w-full mt-12">
                <div className="flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 space-y-6 md:space-y-0 md:space-x-6">
                    <img src={RJS} alt="Guide" className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg" />
                    <div>
                        <h3 className="text-2xl font-semibold text-purple-500">Mr. R J Sutar</h3>
                        <p className="mt-2 text-gray-300 text-justify p-2">
                            Our guide, <span className="font-semibold">Mr. Rishikesh J. Sutar</span>, provided invaluable expertise in Natural Language Processing (NLP) 
                            and machine learning. He offered key insights on dataset preparation, model selection, and optimization, 
                            ensuring the project met high research standards. His mentorship was instrumental in structuring the methodology, 
                            validating results, and refining the research approach.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
