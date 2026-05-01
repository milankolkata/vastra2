from fastapi import APIRouter

router = APIRouter()

# Forecast is generated as part of /upload. This router is a placeholder.

@router.get("/forecast/ping")
def ping():
    return {"module": "forecast", "status": "ok"}
