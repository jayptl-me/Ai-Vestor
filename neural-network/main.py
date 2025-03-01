from fastapi import FastAPI, HTTPException
from src.pipelines.predection import PredictionPipeline
from fastapi.middleware.cors import CORSMiddleware
from src.schemas.response import Response

app = FastAPI(
    title="Stock Prediction API",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
prediction_pipeline = PredictionPipeline()


@app.get("/predict/{ticker}", response_model=Response)
async def predict_stock(ticker: str, interval: str, timeframe: str):
    """FastAPI endpoint to predict stock prices."""
    try:
        result = prediction_pipeline.predict(ticker, timeframe, interval)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)