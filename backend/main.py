from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.sentiment_logic import MarathiSentimentAnalyzer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the sentiment analyzer
try:
    analyzer = MarathiSentimentAnalyzer()
    logger.info("Training sentiment analysis model...")
    accuracy = analyzer.train_model()
    logger.info(f"Model trained successfully with accuracy: {accuracy:.2f}")
except Exception as e:
    logger.error(f"Failed to initialize sentiment analyzer: {e}")
    analyzer = None

app = FastAPI(
    title="Transliterated Marathi Opinion Mining API",
    description=(
        "This API performs opinion mining on transliterated Marathi text using a pre-trained "
        "Support Vector Machine (SVM) model with Bag-of-Words (BoW) representation. It analyzes "
        "both sentence-level and paragraph-level sentiments by splitting the input into sentences "
        "and aggregating the results."
    ),
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Request models
class SentimentRequest(BaseModel):
    text: str

class ParagraphRequest(BaseModel):
    paragraph: str

# Response models
class SentimentResponse(BaseModel):
    text: str
    score: int
    label: str
    cleaned_text: str

class ParagraphResponse(BaseModel):
    paragraph: str
    average_score: float
    average_label: str
    sentence_details: list

# Health check endpoint
@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "Transliterated Marathi Opinion Mining API",
        "status": "active",
        "model_status": "trained" if analyzer else "not available"
    }

# Endpoint for single sentence sentiment analysis
@app.post("/analyze_sentence", response_model=SentimentResponse)
def analyze_sentence_endpoint(request: SentimentRequest):
    """Analyze sentiment of a single sentence"""
    if not analyzer:
        raise HTTPException(status_code=503, detail="Sentiment analyzer not available")
    
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        score, label, cleaned_text = analyzer.analyze_sentence(text)
        
        return SentimentResponse(
            text=text,
            score=score,
            label=label,
            cleaned_text=cleaned_text
        )
    
    except Exception as e:
        logger.error(f"Error analyzing sentence: {e}")
        raise HTTPException(status_code=500, detail="Error processing sentence analysis")

# Endpoint for paragraph sentiment analysis
@app.post("/analyze_paragraph", response_model=ParagraphResponse)
def analyze_paragraph_endpoint(request: ParagraphRequest):
    """Analyze sentiment of a paragraph (multiple sentences)"""
    if not analyzer:
        raise HTTPException(status_code=503, detail="Sentiment analyzer not available")
    
    paragraph = request.paragraph.strip()
    if not paragraph:
        raise HTTPException(status_code=400, detail="Input paragraph cannot be empty.")

    try:
        avg_score, avg_label, sentence_details = analyzer.analyze_paragraph(paragraph)
        
        return ParagraphResponse(
            paragraph=paragraph,
            average_score=round(avg_score, 2),
            average_label=avg_label,
            sentence_details=sentence_details
        )
    
    except Exception as e:
        logger.error(f"Error analyzing paragraph: {e}")
        raise HTTPException(status_code=500, detail="Error processing paragraph analysis")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)