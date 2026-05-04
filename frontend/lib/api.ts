import axios from "axios";
import type {
  UploadResponse, Festival,
  Design, Customer, CustomerMatch, Lead,
  Trend, TrendListResponse, TrendCatalogMatch,
} from "./types";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 60000,
});

// ── Sales Intelligence (existing) ────────────────────────────
export async function uploadSalesFile(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await API.post<UploadResponse>("/api/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getUpcomingFestivals(n = 5): Promise<Festival[]> {
  const { data } = await API.get<{ festivals: Festival[] }>(`/api/festivals/upcoming?n=${n}`);
  return data.festivals;
}

export async function getFestivalsCalendar(): Promise<Festival[]> {
  const { data } = await API.get<{ calendar: Festival[] }>("/api/festivals/calendar");
  return data.calendar;
}

// ── Design Library ────────────────────────────────────────────
export async function createDesign(
  file: File,
  meta: {
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
): Promise<{ design: Design; design_intelligence: any }> {
  const form = new FormData();
  form.append("file", file);
  const { occasion_tags, ...rest } = meta;
  Object.entries(rest).forEach(([k, v]) => form.append(k, v));
  form.append("occasion_tags", JSON.stringify(occasion_tags));
  const { data } = await API.post("/api/designs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listDesigns(filters?: {
  category?: string; color?: string; fabric?: string;
}): Promise<Design[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.color) params.append("color", filters.color);
  if (filters?.fabric) params.append("fabric", filters.fabric);
  const { data } = await API.get<{ designs: Design[] }>(`/api/designs?${params.toString()}`);
  return data.designs;
}

export async function deleteDesign(id: string): Promise<void> {
  await API.delete(`/api/designs/${id}`);
}

export async function getDesignMatches(
  designId: string,
  topN = 10
): Promise<{ matches: CustomerMatch[]; total_customers: number }> {
  const { data } = await API.get(`/api/designs/${designId}/matches?top_n=${topN}`);
  return data;
}

// ── Customer Targeting ────────────────────────────────────────
export async function createCustomer(payload: Partial<Customer>): Promise<Customer> {
  const { data } = await API.post<{ customer: Customer }>("/api/customers", payload);
  return data.customer;
}

export async function listCustomers(): Promise<Customer[]> {
  const { data } = await API.get<{ customers: Customer[] }>("/api/customers");
  return data.customers;
}

export async function updateCustomer(id: string, payload: Partial<Customer>): Promise<Customer> {
  const { data } = await API.put<{ customer: Customer }>(`/api/customers/${id}`, payload);
  return data.customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  await API.delete(`/api/customers/${id}`);
}

export async function uploadCustomerImage(
  customerId: string,
  file: File
): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  await API.post(`/api/customers/${customerId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function listCustomerImages(
  customerId: string
): Promise<{ id: string; image_url: string; created_at: string }[]> {
  const { data } = await API.get(`/api/customers/${customerId}/images`);
  return data.images;
}

export async function deleteCustomerImage(prefId: string): Promise<void> {
  await API.delete(`/api/customers/images/${prefId}`);
}

// ── Trends ────────────────────────────────────────────────────
export async function listTrends(params?: {
  product_type?: string;
  work_type?:    string;
  fabric_type?:  string;
  region?:       string;
  time_filter?:  string;
  is_fabric?:    boolean;
  limit?:        number;
  offset?:       number;
}): Promise<TrendListResponse> {
  const qs = new URLSearchParams();
  if (params?.product_type) qs.append("product_type", params.product_type);
  if (params?.work_type)    qs.append("work_type",    params.work_type);
  if (params?.fabric_type)  qs.append("fabric_type",  params.fabric_type);
  if (params?.region)       qs.append("region",       params.region);
  if (params?.time_filter)  qs.append("time_filter",  params.time_filter);
  if (params?.is_fabric)    qs.append("is_fabric",    "true");
  if (params?.limit != null)  qs.append("limit",  String(params.limit));
  if (params?.offset != null) qs.append("offset", String(params.offset));
  const { data } = await API.get<TrendListResponse>(`/api/trends?${qs.toString()}`);
  return data;
}

export async function matchTrendWithCatalog(
  trendId: string
): Promise<{ matches: TrendCatalogMatch[]; total_designs: number; trend_title: string }> {
  const { data } = await API.get(`/api/trends/${trendId}/match`);
  return data;
}

// ── Lead Discovery ────────────────────────────────────────────
export async function searchLeads(params: {
  city: string;
  business_type?: string;
  max_results?: number;
}): Promise<{ businesses: Lead[]; total: number; city: string }> {
  const qs = new URLSearchParams({ city: params.city });
  if (params.business_type) qs.append("business_type", params.business_type);
  if (params.max_results) qs.append("max_results", String(params.max_results));
  const { data } = await API.get(`/api/leads/search?${qs.toString()}`);
  return data;
}
