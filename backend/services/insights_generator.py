"""
Generates plain-English, actionable insights from processed sales data.
No jargon – written for Indian ethnic wear store owners.
"""
from __future__ import annotations
import pandas as pd


def generate_insights(df: pd.DataFrame, summary: dict) -> list[dict]:
    insights: list[dict] = []

    # 1. Top-selling category
    if "category" in df.columns:
        cat_grp = df.groupby("category")["quantity"].sum().sort_values(ascending=False)
        if len(cat_grp):
            top_cat = cat_grp.index[0]
            top_pct = round(cat_grp.iloc[0] / cat_grp.sum() * 100, 1)
            insights.append({
                "type": "top_category",
                "icon": "🏆",
                "title": f"{top_cat} leads your sales",
                "body": f"{top_cat} accounts for {top_pct}% of all units sold. Keep strong stock of this category.",
                "action": f"Ensure {top_cat} is always well-stocked and prominently displayed.",
                "priority": "high",
            })

    # 2. Top color
    if "color" in df.columns:
        color_grp = df.groupby("color")["quantity"].sum().sort_values(ascending=False)
        if len(color_grp) > 0:
            top_color = color_grp.index[0]
            insights.append({
                "type": "top_color",
                "icon": "🎨",
                "title": f"{top_color} is your bestselling color",
                "body": f"Designs in {top_color} are consistently your top sellers.",
                "action": f"When sourcing new stock, prioritise {top_color} shades.",
                "priority": "medium",
            })

        # Trending color (recent 30d vs previous 30d)
        if "date" in df.columns and len(df["date"].dropna()):
            cutoff = df["date"].max() - pd.Timedelta(days=30)
            prev_cutoff = cutoff - pd.Timedelta(days=30)
            recent = df[df["date"] >= cutoff].groupby("color")["quantity"].sum()
            prev = df[(df["date"] >= prev_cutoff) & (df["date"] < cutoff)].groupby("color")["quantity"].sum()
            trending = []
            for color in recent.index:
                prev_qty = prev.get(color, 0)
                if prev_qty > 0:
                    growth = (recent[color] - prev_qty) / prev_qty * 100
                    if growth > 20:
                        trending.append((color, round(growth, 1)))
            if trending:
                trending.sort(key=lambda x: -x[1])
                t_color, t_growth = trending[0]
                insights.append({
                    "type": "trending_color",
                    "icon": "📈",
                    "title": f"{t_color} is trending upward",
                    "body": f"Sales of {t_color} designs have grown by {t_growth}% compared to the previous month.",
                    "action": f"Stock up on {t_color} options before demand peaks.",
                    "priority": "high",
                })

    # 3. Top fabric
    if "fabric" in df.columns:
        fabric_grp = df.groupby("fabric")["quantity"].sum().sort_values(ascending=False)
        if len(fabric_grp):
            top_fabric = fabric_grp.index[0]
            insights.append({
                "type": "top_fabric",
                "icon": "🧵",
                "title": f"{top_fabric} fabric sells best",
                "body": f"Customers prefer {top_fabric} fabric. This should guide your next buying trip.",
                "action": f"Focus on {top_fabric} when sourcing new designs.",
                "priority": "medium",
            })

    # 4. Dead stock warning
    if "date" in df.columns:
        cutoff = df["date"].max() - pd.Timedelta(days=30)
        recent_products = df[df["date"] >= cutoff]["product"].unique()
        all_products = df["product"].unique()
        dead = [p for p in all_products if p not in recent_products]
        if dead:
            count = len(dead)
            sample = ", ".join(dead[:3])
            insights.append({
                "type": "dead_stock",
                "icon": "⚠️",
                "title": f"{count} designs haven't sold in 30 days",
                "body": f"Designs like {sample} (and {count - 3} more) show no sales recently.",
                "action": "Consider discounting these items, bundling them as offers, or clearing them out to free up working capital.",
                "priority": "high",
            })

    # 5. Revenue concentration
    if "product" in df.columns:
        prod_rev = df.groupby("product")["revenue"].sum().sort_values(ascending=False)
        if len(prod_rev) >= 5:
            top5_pct = round(prod_rev.head(5).sum() / prod_rev.sum() * 100, 1)
            if top5_pct > 60:
                insights.append({
                    "type": "concentration_risk",
                    "icon": "💡",
                    "title": "Your top 5 designs drive most revenue",
                    "body": f"Your top 5 designs contribute {top5_pct}% of total revenue. This is high concentration.",
                    "action": "Diversify your catalogue to reduce risk. Experiment with 5-10 new designs next season.",
                    "priority": "medium",
                })

    # 6. Sales growth (last 30d vs previous 30d)
    if "date" in df.columns and len(df["date"].dropna()):
        cutoff = df["date"].max() - pd.Timedelta(days=30)
        prev_cutoff = cutoff - pd.Timedelta(days=30)
        recent_qty = df[df["date"] >= cutoff]["quantity"].sum()
        prev_qty = df[(df["date"] >= prev_cutoff) & (df["date"] < cutoff)]["quantity"].sum()
        if prev_qty > 0:
            growth = (recent_qty - prev_qty) / prev_qty * 100
            if growth > 10:
                insights.append({
                    "type": "sales_growth",
                    "icon": "🚀",
                    "title": f"Sales up {round(growth, 1)}% this month",
                    "body": f"You sold {int(recent_qty)} units this month vs {int(prev_qty)} last month.",
                    "action": "Great momentum! Ensure sufficient stock for continued growth.",
                    "priority": "low",
                })
            elif growth < -10:
                insights.append({
                    "type": "sales_decline",
                    "icon": "📉",
                    "title": f"Sales down {round(abs(growth), 1)}% this month",
                    "body": f"You sold {int(recent_qty)} units this month vs {int(prev_qty)} last month.",
                    "action": "Review pricing, run promotions, or push on social media to recover momentum.",
                    "priority": "high",
                })

    # Limit to 5 most actionable
    priority_order = {"high": 0, "medium": 1, "low": 2}
    insights.sort(key=lambda x: priority_order.get(x["priority"], 3))
    return insights[:5]
