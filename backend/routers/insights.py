from fastapi import APIRouter

router = APIRouter()

# Insights are generated as part of /upload. This router is a placeholder
# for future standalone insight regeneration endpoints.

@router.get("/insights/ping")
def ping():
    return {"module": "insights", "status": "ok"}
