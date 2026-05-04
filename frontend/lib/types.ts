export interface SummaryStats {
  total_rows: number;
  total_units: number;
  total_revenue: number;
  unique_products: number;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
  available_columns: string[];
}

export interface TopProduct {
  product: string;
  units: number;
  revenue: number;
}

export interface CategoryData {
  category: string;
  units: number;
  revenue: number;
  share_pct: number;
}

export interface ColorData {
  color: string;
  units: number;
}

export interface FabricData {
  fabric: string;
  units: number;
}

export interface DeadStockItem {
  product: string;
  units_last_30d: number;
  status: "Dead Stock" | "Slow Moving";
}

export interface TrendPoint {
  date: string;
  units: number;
  revenue: number;
}

export interface WeekPoint {
  week: string;
  units: number;
  revenue: number;
}

export interface MonthPoint {
  month: string;
  units: number;
  revenue: number;
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lower: number;
  upper: number;
}

export interface ForecastSummary {
  summary: string;
  direction: string;
  change_pct: number;
  emoji: string;
  color: string;
  method: string;
}

export interface ForecastResult {
  predictions: ForecastPoint[];
  summary: ForecastSummary;
  historical_daily_avg: number;
  forecast_daily_avg: number;
  peak_days: ForecastPoint[];
  error?: string;
}

export interface Insight {
  type: string;
  icon: string;
  title: string;
  body: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export interface UploadResponse {
  status: string;
  filename: string;
  preview: {
    columns: string[];
    rows: Record<string, string>[];
  };
  column_mapping: Record<string, string>;
  summary: SummaryStats;
  top_products: TopProduct[];
  category_breakdown: CategoryData[];
  color_trends: ColorData[];
  fabric_trends: FabricData[];
  dead_stock: DeadStockItem[];
  daily_trend: TrendPoint[];
  weekly_trend: WeekPoint[];
  monthly_summary: MonthPoint[];
  forecast: ForecastResult;
  insights: Insight[];
}

export interface UrgencyLevel {
  label: string;
  color: string;
  bg: string;
  text: string;
  border: string;
}

export interface Festival {
  id: string;
  name: string;
  category: "festive" | "wedding";
  date: string;
  date_iso: string;
  days_remaining: number;
  duration_days: number;
  primary_regions: string[];
  secondary_regions: string[];
  urgency: UrgencyLevel;
  alert: string | null;
  product_suggestions: string[];
  color_suggestions: string[];
  fabric_suggestions: string[];
  historical_insights: string[];
  notes: string;
}

// ── Design Library ────────────────────────────────────────────
export interface AutoColor {
  hex: string;
  name_approx: string;
  percentage: number;
}

export interface AutoTags {
  embroidery_type: string | null;
  print_type: string | null;
  fabric_hint: string | null;
  occasion_tags: string[];
  work_description: string | null;
  confidence: "high" | "medium" | "low" | null;
}

export interface Design {
  id: string;
  name: string;
  category: string | null;
  color: string | null;
  fabric: string | null;
  work_type: string | null;
  embroidery_type: string | null;
  print_type: string | null;
  occasion_tags: string[];
  price: number | null;
  image_url: string;
  auto_colors: AutoColor[] | null;
  auto_tags: AutoTags | null;
  created_at: string;
}

export interface DesignCreatePayload {
  name: string;
  category: string;
  color: string;
  fabric: string;
  work_type: string;
  embroidery_type: string;
  print_type: string;
  occasion_tags: string[];
  price: string;
}

// ── Customer Targeting ────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  region_city: string | null;
  region_state: string | null;

  // Legacy fields (still used)
  preferred_categories: string[];
  preferred_styles: string[];
  color_preference: string[];

  // Rich Indian wear preferences
  embroidery_preferences: string[];
  print_preferences: string[];
  fabric_preferences: string[];
  occasion_preferences: string[];

  price_min: number | null;
  price_max: number | null;
  notes: string | null;
  image_pref_count?: number;
  created_at: string;
}

export interface CustomerMatch {
  customer_id: string;
  customer_name: string;
  phone: string | null;
  region: string;
  score: number;
  reasons: string[];
  whatsapp_url: string | null;
}

// ── Trends ────────────────────────────────────────────────────
export interface Trend {
  id: string;
  title: string;
  product_type: string;
  category: string;
  work_type: string;
  fabric_type: string;
  colors: string[];
  color_names: string[];
  region: string;
  festival_tags: string[];
  why_trending: string;
  demand_insight: string;
  who_should_sell: string;
  fabric_insight: string;
  source_name: string;
  source_url: string;
  image_url: string;
  trend_score: number;
}

export interface TrendListResponse {
  trends: Trend[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface TrendCatalogMatch {
  id: string;
  name: string;
  category: string | null;
  color: string | null;
  work_type: string | null;
  image_url: string;
  match_score: number;
}

// ── Lead Discovery ────────────────────────────────────────────
export interface Lead {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  total_ratings: number;
  phone: string | null;
  website: string | null;
  maps_url: string;
}
