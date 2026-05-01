# Vastra AI — Ethnic Wear Sales Intelligence Tool v2

> Upload your sales data → instantly understand what to restock, what to stop buying, and what will sell next month. Plus: Design Library, Smart Customer Targeting, and Lead Discovery.

Built for Indian ethnic wear store owners (salwar suits, sarees, kurtis, lehengas).

---

## What It Does

### Sales Intelligence (Module 1)
| Feature | Description |
|---|---|
| 📁 **File Upload** | Drag-and-drop CSV or Excel. Works with flexible column names. |
| 📊 **Insights Dashboard** | Top products, category trends, color trends, fabric trends |
| ⚠️ **Dead Stock Detection** | Products with zero or low sales in last 30 days |
| 🔮 **30-Day Forecast** | Prophet AI or linear trend fallback |
| 💡 **Actionable Insights** | Plain-English recommendations (no jargon) |
| 🪔 **Festival Opportunities** | Upcoming Indian festivals with countdowns and stock suggestions |

### Design Library — Module 2
| Feature | Description |
|---|---|
| 👗 **Design Catalog** | Upload and manage your entire design collection with images |
| 🤖 **Design Intelligence** | AI auto-detects dominant colors from uploaded images |
| 🔍 **Smart Filters** | Filter by category, color, fabric |
| 👥 **Customer Matching** | Click any design to see which customers match it |

### Smart Customer Targeting — Module 3
| Feature | Description |
|---|---|
| 👤 **Customer Profiles** | Store customer preferences: categories, styles, colors, budget |
| 📷 **Reference Images** | Upload outfit images a customer likes for visual AI matching |
| 🎯 **Match Scoring** | Multi-factor scoring: category (20%) + color (20%) + style (30%) + image similarity (30%) |
| 💬 **WhatsApp Integration** | One-click pre-filled WhatsApp message to matched customers |

### Lead Discovery — Module 4
| Feature | Description |
|---|---|
| 🗺️ **City Search** | Find ethnic wear businesses in any Indian city |
| 📍 **Google Places API** | Real business data: name, address, rating, phone |
| 📥 **Export CSV** | Download lead list for follow-up |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS + **ShadCN** + Recharts |
| Backend | FastAPI (Python) |
| Data Processing | Pandas |
| Forecasting | Prophet (with linear fallback) |
| Database / Auth / Storage | **Supabase** (required for Design Library & Targeting) |
| Image Embeddings | **CLIP via sentence-transformers** (with colour-histogram fallback) |
| Lead Discovery | **Google Places API** |

---

## Project Structure

```
vastra-ai/
├── backend/                 # FastAPI backend
│   ├── main.py              # App entry point
│   ├── config.py            # Settings / env vars
│   ├── requirements.txt
│   ├── routers/
│   │   ├── upload.py        # POST /api/upload
│   │   ├── festivals.py     # GET /api/festivals/*
│   │   ├── insights.py
│   │   └── forecast.py
│   ├── services/
│   │   ├── data_processor.py    # Pandas cleaning + analysis
│   │   ├── forecaster.py        # Prophet / linear forecast
│   │   ├── insights_generator.py
│   │   └── festival_service.py  # Festival calendar + alerts
│   └── data/
│       └── festivals.json   # Preloaded festival dataset
│
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── InsightsPanel.tsx
│   │   ├── TopProductsTable.tsx
│   │   ├── DeadStockTable.tsx
│   │   ├── ForecastSection.tsx
│   │   ├── FestivalOpportunities.tsx
│   │   ├── PreviewTable.tsx
│   │   ├── charts/
│   │   │   ├── SalesTrendChart.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   └── ColorFabricChart.tsx
│   │   └── ui/
│   │       ├── StatCard.tsx
│   │       └── SectionHeader.tsx
│   └── lib/
│       ├── api.ts           # Axios API client
│       └── types.ts         # TypeScript types
│
└── sample_data/
    └── sample_sales.csv     # Test file with full year of data
```

---

## Setup Instructions

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1. Clone / Open the Project

```bash
cd "vastra ai"
```

---

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> **Note on Prophet:** Prophet requires `pystan` or `cmdstanpy`. If installation fails:
> ```bash
> pip install prophet --no-build-isolation
> ```
> If Prophet still fails, the system automatically falls back to a linear trend model.

#### Configure Environment Variables (optional)

```bash
cp .env.example .env
# Edit .env and add your Supabase credentials if needed
```

#### Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API docs (Swagger): `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

### 4. Test with Sample Data

1. Open `http://localhost:3000`
2. Click **Upload Sales File**
3. Upload `sample_data/sample_sales.csv`
4. See the full dashboard with insights, trends, and forecast

---

## Expected CSV Format

| Column | Required | Accepted Names |
|---|---|---|
| Date | ✅ Yes | date, sale_date, order_date, transaction_date |
| Product Name | ✅ Yes | product, product_name, design, design_number, sku |
| Quantity Sold | ✅ Yes | quantity, qty, units, units_sold, pieces |
| Category | ❌ Optional | category, type, product_type, segment |
| Price | ❌ Optional | price, unit_price, selling_price, mrp, rate |
| Color | ❌ Optional | color, colour, shade, hue |
| Fabric | ❌ Optional | fabric, material, cloth, textile |

> The tool works even if optional columns are missing — it will simply skip those analyses.

---

## Festival Data

The following festivals are preloaded:

| Festival | Primary Region | Key Products |
|---|---|---|
| Diwali (Oct) | Pan India | Silk sarees, embroidered suits, lehengas |
| Navratri (Oct) | Gujarat, Rajasthan | Chaniya choli, bandhani suits |
| Eid ul-Fitr (Mar) | UP, Bihar, Bengal | Anarkali suits, chikankari |
| Durga Puja (Oct) | West Bengal | Bengali sarees, tant |
| Onam (Aug) | Kerala | Kasavu sarees, white sets |
| Pongal (Jan) | Tamil Nadu | Kanjivaram silk, cotton suits |
| Raksha Bandhan (Aug) | Pan India | Gift sets, kurtis |
| Wedding Season (Nov–Feb) | Pan India | Bridal lehengas, heavy sarees |
| Holi (Mar) | North India | Affordable cotton kurtis |
| Eid ul-Adha (Jun) | UP, Bihar, Bengal | Sharara sets, anarkali |

---

## Supabase Setup (Optional)

Supabase is used for authentication and persistent storage. The app works without it.

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API**
3. Copy your `Project URL` and `anon public` key
4. Add to `backend/.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/upload` | Upload and analyse sales file |
| `GET` | `/api/festivals/upcoming?n=5` | Get next N upcoming festivals |
| `GET` | `/api/festivals/calendar` | Full year festival calendar |

---

## Performance

- Handles files up to **10,000 rows**
- Processing time: **2–5 seconds** (depending on Prophet availability)
- Prophet fallback: **< 1 second**

---

## Troubleshooting

**Prophet installation fails:**
```bash
pip install pystan==2.19.1.1
pip install prophet
```

**CORS errors in browser:**
Make sure the backend is running on port 8000 and frontend on port 3000.

**"Module not found" errors:**
```bash
pip install -r requirements.txt --upgrade
```

**File won't upload:**
- Check the file is CSV or Excel (.xlsx/.xls)
- Ensure the file has at least Date, Product Name, and Quantity columns

---

## License

MIT — built for Indian ethnic wear store owners 🇮🇳
#   V a s t r a - a i  
 