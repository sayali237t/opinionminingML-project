import pandas as pd
import numpy as np
import nltk
import re
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import classification_report, accuracy_score

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

class MarathiSentimentAnalyzer:
    def __init__(self, lexicon_path='data/Senti_Words.csv', data_path='data/Data.csv'):
        """Initialize the sentiment analyzer with data paths"""
        self.lexicon_path = lexicon_path
        self.data_path = data_path
        self.lexicon = None
        self.model = None
        self.vectorizer = None
        self.sentiment_mapping = {
            3: "Most Positive",
            2: "More Positive", 
            1: "Positive",
            0: "Neutral",
            -1: "Negative",
            -2: "More Negative",
            -3: "Most Negative"
        }
        
    def load_data(self):
        """Load lexicon and training data"""
        try:
            self.lexicon = pd.read_csv(self.lexicon_path)
            sentences_df = pd.read_csv(self.data_path)
            return sentences_df
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Data file not found: {e}")
        except Exception as e:
            raise Exception(f"Error loading data: {e}")
    
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        if not isinstance(text, str):
            return ""
        
        text = text.lower()
        text = re.sub(r"[^a-zA-Z\s]", "", text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def calculate_sentiment_score(self, sentence):
        """Calculate sentiment score using lexicon"""
        if not isinstance(sentence, str) or not sentence.strip():
            return 0
            
        words = sentence.split()
        score = 0
        
        for word in words:
            if word in self.lexicon['Word'].values:
                weight = self.lexicon.loc[self.lexicon['Word'] == word, 'Score'].values[0]
                score += weight
                
        return score
    
    def normalize_score(self, score, min_score, max_score, new_min=-3, new_max=3):
        """Normalize score to specified range"""
        if max_score == min_score:
            return new_min
        normalized = ((score - min_score) / (max_score - min_score)) * (new_max - new_min) + new_min
        return normalized
    
    def classify_score(self, score):
        """Classify normalized score into discrete categories"""
        if score <= -2.5:
            return -3
        elif score <= -1.5:
            return -2
        elif score <= -0.5:
            return -1
        elif score <= 0.5:
            return 0
        elif score <= 1.5:
            return 1
        elif score <= 2.5:
            return 2
        else:
            return 3
    
    def prepare_training_data(self):
        """Prepare and process training data"""
        # Load data
        sentences_df = self.load_data()
        
        # Preprocess sentences
        sentences_df['Cleaned_Sentence'] = sentences_df['Sentence'].apply(self.preprocess_text)
        
        # Calculate sentiment scores
        scores_df = pd.DataFrame()
        scores_df['Sentence'] = sentences_df['Cleaned_Sentence']
        scores_df['Score'] = scores_df['Sentence'].apply(self.calculate_sentiment_score)
        
        # Normalize scores
        current_min = scores_df['Score'].min()
        current_max = scores_df['Score'].max()
        scores_df['Normalized_Score'] = scores_df['Score'].apply(
            lambda x: self.normalize_score(x, current_min, current_max)
        )
        
        # Classify scores
        scores_df['Classified_Score'] = scores_df['Normalized_Score'].apply(self.classify_score)
        
        return scores_df
    
    def train_model(self):
        """Train the SVM model"""
        # Prepare training data
        df_scores = self.prepare_training_data()
        
        # Prepare features and labels
        X = df_scores['Sentence']
        y = df_scores['Classified_Score']
        
        # Vectorize text
        self.vectorizer = CountVectorizer()
        X_vectorized = self.vectorizer.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_vectorized, y, test_size=0.2, random_state=42
        )
        
        # Train SVM model
        self.model = SVC(kernel='linear')
        self.model.fit(X_train, y_train)
        
        # Calculate accuracy
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained successfully! Accuracy: {accuracy:.2f}")
        return accuracy
    
    def analyze_sentence(self, sentence):
        """Analyze sentiment of a single sentence"""
        if not self.model or not self.vectorizer:
            raise Exception("Model not trained. Please call train_model() first.")
        
        # Preprocess sentence
        cleaned_sentence = self.preprocess_text(sentence)
        
        if not cleaned_sentence:
            return 0, "Neutral", "Empty or invalid sentence"
        
        # Vectorize and predict
        sentence_vector = self.vectorizer.transform([cleaned_sentence])
        prediction = self.model.predict(sentence_vector)[0]
        
        return prediction, self.sentiment_mapping[prediction], cleaned_sentence
    
    def analyze_paragraph(self, paragraph):
        """Analyze sentiment of a paragraph (multiple sentences)"""
        if not self.model or not self.vectorizer:
            raise Exception("Model not trained. Please call train_model() first.")
        
        if not isinstance(paragraph, str) or not paragraph.strip():
            return 0, "Neutral", []
        
        # Tokenize paragraph into sentences
        sentences = nltk.sent_tokenize(paragraph)
        
        sentence_scores = []
        sentence_sentiments = []
        
        for sentence in sentences:
            score, sentiment_label, cleaned = self.analyze_sentence(sentence)
            sentence_scores.append(score)
            sentence_sentiments.append(f"{sentiment_label} [{score}]")
        
        # Calculate average sentiment
        if sentence_scores:
            avg_sentiment_score = np.mean(sentence_scores)
            avg_sentiment_label = self.sentiment_mapping[int(round(avg_sentiment_score))]
        else:
            avg_sentiment_score = 0
            avg_sentiment_label = "Neutral"
        
        return avg_sentiment_score, avg_sentiment_label, sentence_sentiments

# Example usage
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = MarathiSentimentAnalyzer()
    
    # Train model
    print("Training model...")
    accuracy = analyzer.train_model()
    
    # Test with sample text
    sample_text = "mi khup khush aahe"
    score, label, details = analyzer.analyze_sentence(sample_text)
    print(f"\nSample Analysis:")
    print(f"Text: {sample_text}")
    print(f"Sentiment: {label} (Score: {score})")
    
    # Test paragraph analysis
    sample_paragraph = "mi khup khush aahe. pan aaj thoda sad aahe."
    avg_score, avg_label, sentence_details = analyzer.analyze_paragraph(sample_paragraph)
    print(f"\nParagraph Analysis:")
    print(f"Text: {sample_paragraph}")
    print(f"Overall Sentiment: {avg_label} (Score: {avg_score:.2f})")
    print(f"Sentence Details: {sentence_details}")