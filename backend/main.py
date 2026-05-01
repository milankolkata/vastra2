from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import upload, insights, forecast, festivals, designs, customers, leads, trends

app = FastAPI(
    title="Vastra AI – Ethnic Wear Sales Intelligence",
    version="2.0.0",
    description="Upload sales data → insights, forecasts, design library, customer targeting, lead discovery",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list + ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Existing routers ──────────────────────────────────────────
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(festivals.router, prefix="/api", tags=["Festivals"])

# ── New module routers ────────────────────────────────────────
app.include_router(designs.router, prefix="/api", tags=["Design Library"])
app.include_router(customers.router, prefix="/api", tags=["Customer Targeting"])
app.include_router(leads.router, prefix="/api", tags=["Lead Discovery"])
app.include_router(trends.router, prefix="/api", tags=["Trends"])


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Vastra AI Backend v2",
        "supabase": settings.supabase_configured,
        "google_places": settings.google_places_configured,
    }
