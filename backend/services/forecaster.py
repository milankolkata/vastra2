"""
Demand forecasting: tries Prophet first, falls back to linear trend.
Returns 30-day forecast with a plain-English summary.
"""
from __future__ import annotations
import warnings
from typing import Optional
import pandas as pd
import numpy as np

warnings.filterwarnings("ignore")


def _prophet_forecast(ts: pd.DataFrame, periods: int) -> tuple[list[dict], str]:
    from prophet import Prophet  # type: ignore

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        seasonality_mode="multiplicative",
        changepoint_prior_scale=0.1,
    )
    model.fit(ts)
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    result = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
    result = result.rename(columns={"ds": "date", "yhat": "predicted", "yhat_lower": "lower", "yhat_upper": "upper"})
    result["date"] = result["date"].dt.strftime("%Y-%m-%d")
    result["predicted"] = result["predicted"].clip(lower=0).round(1)
    result["lower"] = result["lower"].clip(lower=0).round(1)
    result["upper"] = result["upper"].clip(lower=0).round(1)
    return result.to_dict(orient="records"), "prophet"


def _linear_forecast(ts: pd.DataFrame, periods: int) -> tuple[list[dict], str]:
    """Simple linear regression fallback."""
    y = ts["y"].values.astype(float)
    x = np.arange(len(y))

    # Weighted least squares – recent points matter more
    weights = np.linspace(0.3, 1.0, len(y))
    coeffs = np.polyfit(x, y, deg=1, w=weights)
    slope, intercept = coeffs

    last_date = pd.Timestamp(ts["ds"].iloc[-1])
    records = []
    for i in range(1, periods + 1):
        pred = max(0.0, slope * (len(y) + i - 1) + intercept)
        records.append({
            "date": (last_date + pd.Timedelta(days=i)).strftime("%Y-%m-%d"),
            "predicted": round(pred, 1),
            "lower": round(max(0, pred * 0.8), 1),
            "upper": round(pred * 1.2, 1),
        })
    return records, "linear"


def _build_timeseries(df: pd.DataFrame) -> Optional[pd.DataFrame]:
    if "date" not in df.columns:
        return None
    ts = (
        df.groupby(df["date"].dt.date)["quantity"]
        .sum()
        .reset_index()
        .rename(columns={"date": "ds", "quantity": "y"})
    )
    ts["ds"] = pd.to_datetime(ts["ds"])
    ts = ts.sort_values("ds")
    # Need at least 14 data points
    if len(ts) < 14:
        # Upsample by repeating weekly pattern
        full_range = pd.date_range(ts["ds"].min(), ts["ds"].max(), freq="D")
        ts = ts.set_index("ds").reindex(full_range).fillna(method="ffill").fillna(0).reset_index()
        ts.columns = ["ds", "y"]
    return ts


def _plain_english_summary(historical_avg: float, forecast_avg: float, method: str) -> dict:
    if historical_avg == 0:
        pct = 0.0
    else:
        pct = ((forecast_avg - historical_avg) / historical_avg) * 100

    direction = "increase" if pct >= 0 else "decrease"
    abs_pct = abs(round(pct, 1))

    if abs_pct < 5:
        trend = "remain stable"
        emoji = "📊"
        color = "blue"
    elif pct >= 20:
        trend = f"increase significantly by ~{abs_pct}%"
        emoji = "🚀"
        color = "green"
    elif pct > 0:
        trend = f"increase by ~{abs_pct}%"
        emoji = "📈"
        color = "green"
    elif pct <= -20:
        trend = f"decrease significantly by ~{abs_pct}%"
        emoji = "⚠️"
        color = "red"
    else:
        trend = f"decrease by ~{abs_pct}%"
        emoji = "📉"
        color = "orange"

    return {
        "summary": f"Sales are expected to {trend} next month.",
        "direction": direction,
        "change_pct": round(pct, 1),
        "emoji": emoji,
        "color": color,
        "method": method,
    }


def generate_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    ts = _build_timeseries(df)
    if ts is None or len(ts) == 0:
        return {"error": "Not enough data to generate a forecast.", "predictions": []}

    historical_avg = float(ts["y"].tail(30).mean())

    try:
        predictions, method = _prophet_forecast(ts, periods)
    except Exception:
        try:
            predictions, method = _linear_forecast(ts, periods)
        except Exception as exc:
            return {"error": str(exc), "predictions": []}

    forecast_avg = float(np.mean([p["predicted"] for p in predictions]))
    summary = _plain_english_summary(historical_avg, forecast_avg, method)

    # Top 3 peak days
    sorted_preds = sorted(predictions, key=lambda x: x["predicted"], reverse=True)
    peak_days = sorted_preds[:3]

    return {
        "predictions": predictions,
        "summary": summary,
        "historical_daily_avg": round(historical_avg, 1),
        "forecast_daily_avg": round(forecast_avg, 1),
        "peak_days": peak_days,
    }
