"""
Trends Service – 62-item curated ethnic wear trend intelligence.

Scores are recomputed on every request based on current date + festival
proximity, so they stay seasonally fresh without manual intervention.
Images are fetched from Unsplash API (optional) and cached in memory.
"""
from __future__ import annotations
from datetime import date
from typing import Optional
from services.image_service import fetch_image_url

# ─────────────────────────────────────────────────────────────────────────────
# Festival → month mapping for dynamic scoring
# ─────────────────────────────────────────────────────────────────────────────
FESTIVAL_MONTHS: dict[str, list[int]] = {
    "Navratri":     [3, 4, 9, 10],
    "Garba":        [9, 10],
    "Diwali":       [10, 11],
    "Karva Chauth": [10, 11],
    "Eid":          [3, 4],
    "Wedding":      [11, 12, 1, 2],
    "Durga Puja":   [9, 10],
    "Pongal":       [1],
    "Onam":         [8, 9],
    "Holi":         [2, 3],
    "Teej":         [7, 8, 9],
    "Lohri":        [1],
    "Baisakhi":     [4],
    "New Year":     [12, 1],
    "Ganesh Chaturthi": [8, 9],
    "Summer":       [4, 5, 6],
    "Festive":      [9, 10, 11],
    "Casual Wear":  [],
}

# ─────────────────────────────────────────────────────────────────────────────
# Source URL builders — safe search-page links, no scraping
# ─────────────────────────────────────────────────────────────────────────────
SOURCE_URLS: dict[str, str] = {
    "Myntra":       "https://www.myntra.com/{query}",
    "Meesho":       "https://meesho.com/search?q={query}",
    "Pinterest":    "https://www.pinterest.com/search/pins/?q={query}",
    "Google Trends":"https://trends.google.com/trends/explore?q={query}&geo=IN",
    "Amazon India": "https://www.amazon.in/s?k={query}",
    "Nykaa Fashion":"https://www.nykaafashion.com/search?q={query}",
}

def build_source_url(source_name: str, query: str) -> str:
    template = SOURCE_URLS.get(source_name, "https://www.google.com/search?q={query}")
    return template.format(query=query.replace(" ", "+"))

# ─────────────────────────────────────────────────────────────────────────────
# 62-item curated trend dataset
# Fields:
#   id, title, product_type, category, work_type, fabric_type,
#   colors (hex list), color_names, base_score, region, festival_tags,
#   why_trending, demand_insight, who_should_sell, fabric_insight,
#   source_name, source_search_query, unsplash_query
# ─────────────────────────────────────────────────────────────────────────────
TRENDS_DATASET: list[dict] = [

    # ══════════════════════════════════════════════════════════════
    # SAREES (14 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t001", "product_type": "Saree", "category": "Banarasi",
        "title": "Banarasi Katan Silk Saree",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#8B0000", "#FFD700", "#800020"], "color_names": ["Deep Red", "Gold", "Maroon"],
        "base_score": 93, "region": "All India",
        "festival_tags": ["Wedding", "Diwali", "Karva Chauth"],
        "why_trending": "Authentic Banarasi weaves are seeing a strong revival driven by 'heritage fashion' content on Instagram Reels and celebrity bridal looks.",
        "demand_insight": "Consistently top-10 seller Oct–Feb. Stock 60+ days before wedding season. Deep red and gold move 3x faster than other colours.",
        "who_should_sell": "Ideal for bridal wear retailers, wedding shopping destinations, and premium saree boutiques across all regions.",
        "fabric_insight": "Pure katan silk base fabric accounts for 70% of premium Banarasi demand. Georgette variants growing in affordable segment.",
        "source_name": "Myntra", "source_search_query": "banarasi katan silk saree",
        "unsplash_query": "banarasi silk saree india traditional",
    },
    {
        "id": "t002", "product_type": "Saree", "category": "Kanjivaram",
        "title": "Kanjivaram Pure Silk Saree",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#4B0082", "#FFD700", "#006400"], "color_names": ["Indigo", "Gold", "Dark Green"],
        "base_score": 91, "region": "South India",
        "festival_tags": ["Wedding", "Pongal", "Onam"],
        "why_trending": "Kanjivaram silk is the defining bridal look for South Indian weddings. National demand growing as North Indian brides embrace heavyweight silk.",
        "demand_insight": "Peak demand Nov–Mar (Tamil wedding season) and Jan (Pongal). Premium segment ₹8,000–₹50,000. Authenticity-verified sarees command 40% premium.",
        "who_should_sell": "South India–focused bridal stores, premium saree boutiques, and heritage silk retailers in Chennai, Coimbatore, and Bengaluru.",
        "fabric_insight": "Pure mulberry silk with zari weight above 120g/m² is the benchmark buyers ask for. Synthetic blends sell at ₹2,000–₹4,000 for mass market.",
        "source_name": "Myntra", "source_search_query": "kanjivaram pure silk saree",
        "unsplash_query": "kanjivaram silk saree south india",
    },
    {
        "id": "t003", "product_type": "Saree", "category": "Chanderi",
        "title": "Chanderi Silk-Cotton Saree",
        "work_type": "Handwork", "fabric_type": "Chanderi",
        "colors": ["#F5F5DC", "#DEB887", "#D4AC0D"], "color_names": ["Ivory", "Tan", "Mustard Gold"],
        "base_score": 78, "region": "Central India",
        "festival_tags": ["Wedding", "Festive", "Summer"],
        "why_trending": "Chanderi's sheer texture and natural sheen are winning over urban buyers who want lightweight elegance without synthetic feel.",
        "demand_insight": "Strong demand in MP, Maharashtra, and Gujarat. Online demand growing 22% YoY. Ivory and pastels lead in summer; jewel tones for winter.",
        "who_should_sell": "Boutique saree stores, artisan craft retailers, and premium online sellers. GI-tag marketing significantly improves price realisation.",
        "fabric_insight": "Chanderi silk-cotton blend (60:40) balances drape with durability. Pure silk Chanderi commands ₹3,000+ vs ₹800–₹1,500 for cotton variants.",
        "source_name": "Nykaa Fashion", "source_search_query": "chanderi silk cotton saree",
        "unsplash_query": "chanderi saree indian fashion elegant",
    },
    {
        "id": "t004", "product_type": "Saree", "category": "Organza",
        "title": "Pure Organza Embroidered Saree",
        "work_type": "Machine Work", "fabric_type": "Organza",
        "colors": ["#FFF8E7", "#F5CBA7", "#FFD700"], "color_names": ["Ivory", "Peach", "Gold"],
        "base_score": 85, "region": "All India",
        "festival_tags": ["Wedding", "Summer", "Festive"],
        "why_trending": "Organza is the defining saree fabric for 2024–25 — its sheer drape photographs beautifully, making it dominant on bridal Instagram content.",
        "demand_insight": "Ivory and pastel organza 3x more popular than dark shades. Sequin border and mirror work trims drive 35% price premium. Peak April–June and Oct–Dec.",
        "who_should_sell": "Bridal wear stores, saree boutiques targeting urban brides aged 22–35, and premium ethnic fashion retailers.",
        "fabric_insight": "Korean organza is the most popular base — smoother handle than Chinese variants. Buyers specifically request 'Korean organza' at the counter.",
        "source_name": "Myntra", "source_search_query": "organza embroidered saree",
        "unsplash_query": "organza saree fashion photoshoot India",
    },
    {
        "id": "t005", "product_type": "Saree", "category": "Linen",
        "title": "Pure Linen Saree with Zari Border",
        "work_type": "Zari Work", "fabric_type": "Linen",
        "colors": ["#F5DEB3", "#8B6914", "#2F4F4F"], "color_names": ["Wheat", "Khaki Gold", "Dark Slate"],
        "base_score": 74, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear"],
        "why_trending": "Sustainable fashion trend pushing linen sarees into premium casual wear. Urban professionals choosing linen for office ethnic days and summer occasions.",
        "demand_insight": "₹800–₹2,500 sweet spot. Demand highest April–August. Linen-silk blends at premium. Natural dye variants command additional 25% premium.",
        "who_should_sell": "Saree stores targeting working women and urban buyers. Online resellers with good photography can build strong repeat customer base.",
        "fabric_insight": "Linen 14s count (coarser weave) is preferred for structured drape. Linen-silk blends gaining share in ₹2,500–₹5,000 tier.",
        "source_name": "Amazon India", "source_search_query": "pure linen saree zari border",
        "unsplash_query": "linen saree india summer fashion",
    },
    {
        "id": "t006", "product_type": "Saree", "category": "Cotton",
        "title": "Handloom Cotton Tant Saree",
        "work_type": "Kantha Work", "fabric_type": "Cotton",
        "colors": ["#FF4500", "#FFD700", "#008000"], "color_names": ["Vermilion", "Yellow", "Forest Green"],
        "base_score": 71, "region": "East India",
        "festival_tags": ["Durga Puja", "Festive", "Casual Wear"],
        "why_trending": "Handloom Bengal cotton sarees with Kantha stitch are seeing national collector demand. The artisan story resonates strongly with millennial buyers.",
        "demand_insight": "Durga Puja orders must start in August. Fair-trade and artisan-certified sarees sell at 30% premium. Strong repeat purchase rate among conscious buyers.",
        "who_should_sell": "Craft retailers, fair-trade boutiques, and stores targeting urban buyers interested in handloom heritage. East India home market year-round.",
        "fabric_insight": "Tant cotton (80–100 count) is preferred for its soft handle. GI-certified 'Banglar Tant' tag dramatically improves pricing power.",
        "source_name": "Amazon India", "source_search_query": "handloom cotton tant saree bengal",
        "unsplash_query": "handloom cotton saree traditional Bengal India",
    },
    {
        "id": "t007", "product_type": "Saree", "category": "Tissue",
        "title": "Gold Tissue Silk Saree",
        "work_type": "Zari Work", "fabric_type": "Tissue Silk",
        "colors": ["#FFD700", "#C0A010", "#FFF8DC"], "color_names": ["Gold", "Dark Gold", "Cornsilk"],
        "base_score": 82, "region": "All India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Tissue sarees are the top festive and reception choice — lightweight with a metallic sheen that photographs brilliantly under event lighting.",
        "demand_insight": "Peak demand Sep–Feb covering both festive and wedding seasons. Gold and rose gold are top sellers. Mid-range ₹1,500–₹4,000 dominates.",
        "who_should_sell": "Festive wear and wedding shopping destinations. Bundle with complementary blouse fabric for higher average order value.",
        "fabric_insight": "Polyester tissue with metallic yarn is the accessible segment. Pure silk tissue with gold zari is the premium tier commanding ₹8,000–₹20,000.",
        "source_name": "Meesho", "source_search_query": "gold tissue silk saree festive",
        "unsplash_query": "tissue saree gold elegant fashion India",
    },
    {
        "id": "t008", "product_type": "Saree", "category": "Kalamkari",
        "title": "Kalamkari Hand-Painted Saree",
        "work_type": "Handpaint", "fabric_type": "Cotton",
        "colors": ["#8B4513", "#DC143C", "#006400"], "color_names": ["Saddle Brown", "Crimson", "Forest Green"],
        "base_score": 69, "region": "South India",
        "festival_tags": ["Festive", "Casual Wear"],
        "why_trending": "Kalamkari art is finding new audiences through artisan Instagram accounts and sustainable fashion communities.",
        "demand_insight": "Niche but growing. Urban buyers and art collectors pay ₹3,000–₹12,000 for hand-painted originals. Machine Kalamkari prints at ₹500–₹800 for volume.",
        "who_should_sell": "Craft and artisan retailers, boutique stores with story-telling capability. Strong fit for exhibition sales and online direct-to-consumer.",
        "fabric_insight": "Cotton base (60s count) for hand-painted; polyester or cotton-silk for machine print versions. Natural colour variants command strong premium.",
        "source_name": "Pinterest", "source_search_query": "kalamkari saree handpainted artisan",
        "unsplash_query": "kalamkari hand painted saree India craft",
    },
    {
        "id": "t009", "product_type": "Saree", "category": "Ajrakh",
        "title": "Ajrakh Block Print Saree",
        "work_type": "Block Print", "fabric_type": "Cotton",
        "colors": ["#003366", "#8B0000", "#F5DEB3"], "color_names": ["Navy", "Deep Red", "Wheat"],
        "base_score": 72, "region": "West India",
        "festival_tags": ["Festive", "Casual Wear"],
        "why_trending": "Ajrakh's geometric indigo-and-madder patterns are trending heavily in sustainable fashion circles. UNESCO recognition driving international demand.",
        "demand_insight": "Premium buyers in Tier-1 cities. Online sales growing 28% YoY. GI-certified natural-dye Ajrakh sells at 50% premium over synthetic-dye versions.",
        "who_should_sell": "Boutique stores, sustainable fashion retailers, craft exhibition sellers. Strong Instagram and Etsy channel potential.",
        "fabric_insight": "Cotton mulmul (50–60s count) is the traditional base. Buyers increasingly request fabric-weight certification. Natural dye versions test with pH strips.",
        "source_name": "Pinterest", "source_search_query": "ajrakh block print saree Kutch",
        "unsplash_query": "ajrakh block print textile India",
    },
    {
        "id": "t010", "product_type": "Saree", "category": "Bandhani",
        "title": "Bandhani Silk Saree",
        "work_type": "Bandhani", "fabric_type": "Silk",
        "colors": ["#DC143C", "#FF8C00", "#FFD700"], "color_names": ["Crimson", "Dark Orange", "Gold"],
        "base_score": 76, "region": "West India",
        "festival_tags": ["Navratri", "Garba", "Wedding"],
        "why_trending": "Bandhani silk is the definitive Navratri and Garba look in Gujarat and Rajasthan. National demand growing as the style goes pan-India.",
        "demand_insight": "Navratri demand spikes 500% in Gujarat/Rajasthan. Stock 8 weeks in advance. Red, yellow, and royal blue sell fastest during festive season.",
        "who_should_sell": "Western India saree stores, Garba/Navratri festive pop-up sellers, and online stores with festive season inventory planning.",
        "fabric_insight": "Gajji silk (Rajkot silk) is preferred base for premium Bandhani. Georgette Bandhani captures mid-market at ₹1,500–₹3,000.",
        "source_name": "Myntra", "source_search_query": "bandhani silk saree navratri",
        "unsplash_query": "bandhani tie dye saree colorful India",
    },
    {
        "id": "t011", "product_type": "Saree", "category": "Digital Print",
        "title": "Chiffon Digital Print Saree",
        "work_type": "Digital Print", "fabric_type": "Chiffon",
        "colors": ["#00CED1", "#FF69B4", "#9370DB"], "color_names": ["Teal", "Hot Pink", "Violet"],
        "base_score": 68, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear", "Festive"],
        "why_trending": "Digital printing allows photorealistic and bold patterns at low cost — high Instagram appeal and strong impulse purchase behaviour.",
        "demand_insight": "Under ₹600 segment dominates. High velocity, low margin. Bundle 3–5 pieces for better retailer deal. Floral and abstract patterns lead.",
        "who_should_sell": "Volume retailers, online resellers, and wholesale distributors targeting price-sensitive buyers in Tier-2 and Tier-3 cities.",
        "fabric_insight": "Korean chiffon base fabric with direct digital printing. Weight 50–60 GSM preferred. Buyers inspect print sharpness and colour fastness.",
        "source_name": "Meesho", "source_search_query": "chiffon digital print saree under 500",
        "unsplash_query": "chiffon printed saree colorful India",
    },
    {
        "id": "t012", "product_type": "Saree", "category": "Net",
        "title": "Designer Net Saree with Sequins",
        "work_type": "Sequins Work", "fabric_type": "Net",
        "colors": ["#C0C0C0", "#FFD700", "#000000"], "color_names": ["Silver", "Gold", "Black"],
        "base_score": 80, "region": "All India",
        "festival_tags": ["Wedding", "New Year", "Festive"],
        "why_trending": "Net sarees with heavy sequin work are the top cocktail and reception choice. Black-and-gold and silver net sarees dominating party wear.",
        "demand_insight": "Premium tier ₹2,500–₹8,000. Peak Oct–Feb. Black, silver, and champagne gold fastest movers. Photo-friendly sheen = high social media demand.",
        "who_should_sell": "Bridal and party wear boutiques, evening wear retailers, and premium online ethnic fashion stores.",
        "fabric_insight": "Soft net (not stiff) base gives better drape. Double-layered with satin lining for opacity. Imported Korean net dominates premium segment.",
        "source_name": "Myntra", "source_search_query": "designer net saree sequins party wear",
        "unsplash_query": "net saree sequins designer India fashion",
    },
    {
        "id": "t013", "product_type": "Saree", "category": "Ikat",
        "title": "Pochampally Ikat Silk Saree",
        "work_type": "Handwork", "fabric_type": "Silk",
        "colors": ["#4B0082", "#FF4500", "#FFD700"], "color_names": ["Purple", "Vermilion", "Gold"],
        "base_score": 73, "region": "South India",
        "festival_tags": ["Festive", "Wedding", "Casual Wear"],
        "why_trending": "Ikat weave is gaining national traction as a premium handloom category. GI tag and artisan storytelling resonating with conscious consumers.",
        "demand_insight": "Andhra and Telangana home market strong. National demand from premium boutiques growing 20% YoY. Silk Ikat ₹3,000–₹12,000 commands artisan premium.",
        "who_should_sell": "Premium handloom stores, boutique saree retailers, and stores with strong social media narrative capability.",
        "fabric_insight": "Silk warp with cotton weft gives the classic feel. Pure silk Ikat for premium; polyester imitations at ₹400–₹800 for volume segment.",
        "source_name": "Amazon India", "source_search_query": "pochampally ikat silk saree",
        "unsplash_query": "ikat weave saree handloom India Pochampally",
    },
    {
        "id": "t014", "product_type": "Saree", "category": "Patola",
        "title": "Patan Patola Double Ikat Saree",
        "work_type": "Handwork", "fabric_type": "Silk",
        "colors": ["#8B0000", "#FFD700", "#006400"], "color_names": ["Deep Red", "Gold", "Emerald"],
        "base_score": 77, "region": "West India",
        "festival_tags": ["Wedding", "Festive"],
        "why_trending": "Patola's extreme rarity (less than 100 weavers worldwide) and UNESCO attention making it a collectible. Investment piece positioning driving high-end demand.",
        "demand_insight": "Ultra-premium segment ₹15,000–₹5,00,000. One Patola saree = 6 months of weaving. Very niche but zero price pressure from alternatives.",
        "who_should_sell": "Luxury heritage saree stores only. Not a volume product — one authentic Patola per season with right storytelling works better than carrying 10.",
        "fabric_insight": "Pure silk double-ikat. 'Rajkot Patola' (single ikat) is more accessible at ₹3,000–₹15,000. Machine imitations sell at ₹500–₹1,500.",
        "source_name": "Pinterest", "source_search_query": "patan patola double ikat saree Gujarat",
        "unsplash_query": "Patola ikat silk saree India luxury traditional",
    },

    # ══════════════════════════════════════════════════════════════
    # LEHENGAS (10 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t015", "product_type": "Lehenga", "category": "Floral",
        "title": "Pastel Floral Georgette Lehenga",
        "work_type": "Machine Work", "fabric_type": "Georgette",
        "colors": ["#FFB7C5", "#E8D5F5", "#B2EBF2"], "color_names": ["Blush Pink", "Lavender", "Mint"],
        "base_score": 89, "region": "North India",
        "festival_tags": ["Wedding", "Navratri", "Festive"],
        "why_trending": "Pastel florals dominating wedding season — brides and guests opting for softer tones over heavy traditional reds and maroons.",
        "demand_insight": "Delhi, Jaipur, Chandigarh search volume up 34%. Restock 6–8 weeks before wedding season. Blush pink and lavender are the two fastest-moving shades.",
        "who_should_sell": "Wedding wear retailers, boutiques targeting brides' guest list (sisters, cousins, bridesmaids), and festive wear stores.",
        "fabric_insight": "Double georgette base (60–70 GSM) preferred for heavy embroidery. Single georgette for lightweight summer lehengas. Faux georgette for ₹800–₹1,500 tier.",
        "source_name": "Myntra", "source_search_query": "pastel floral lehenga wedding",
        "unsplash_query": "lehenga floral pastel Indian wedding fashion",
    },
    {
        "id": "t016", "product_type": "Lehenga", "category": "Mirror Work",
        "title": "Mirror Work Ghagra Set",
        "work_type": "Mirror Work", "fabric_type": "Rayon",
        "colors": ["#FF4500", "#FF8C00", "#FFD700"], "color_names": ["Scarlet", "Orange", "Gold"],
        "base_score": 82, "region": "West India",
        "festival_tags": ["Navratri", "Garba", "Festive"],
        "why_trending": "Mirror work ghagras are THE Navratri and Garba look — demand spikes 400% in Gujarat and Rajasthan during festive season.",
        "demand_insight": "Stock 8 weeks before Navratri. Scarlet, royal blue, and emerald sell fastest. Size M–L highest sell-through. ₹1,200–₹3,500 sweet spot.",
        "who_should_sell": "Western India festive wear retailers. Pre-Navratri pop-up sellers in Gujarat, Rajasthan. Online sellers with festive season inventory strategy.",
        "fabric_insight": "Cotton or rayon base for mirror work ghagra. Heavy mirror work needs stable fabric. Rayon gives better sheen; cotton for breathability in Garba dancing.",
        "source_name": "Meesho", "source_search_query": "mirror work ghagra navratri",
        "unsplash_query": "mirror work lehenga navratri Indian festival",
    },
    {
        "id": "t017", "product_type": "Lehenga", "category": "Sequins",
        "title": "Sequin Crop-Top Lehenga",
        "work_type": "Sequins Work", "fabric_type": "Net",
        "colors": ["#C0C0C0", "#FFD700", "#1C1C1C"], "color_names": ["Silver", "Gold", "Charcoal"],
        "base_score": 87, "region": "All India",
        "festival_tags": ["Wedding", "New Year", "Festive"],
        "why_trending": "Crop-top lehenga is the definitive cocktail and reception look. Sequin finishes and cape-style blouses trending across Instagram and wedding videos.",
        "demand_insight": "Premium ₹3,000–₹12,000 segment moving well. Silver and champagne gold top colours. Buyer profile: urban women 22–35 for receptions and cocktail parties.",
        "who_should_sell": "Premium ethnic fashion boutiques, bridal stores with cocktail/reception range, and online stores with strong styling photography.",
        "fabric_insight": "Net base (soft, not stiff) for the skirt; heavy satin for crop top. Cancan lining essential. Sequins must be double-locked to prevent shedding.",
        "source_name": "Myntra", "source_search_query": "sequin crop top lehenga party wear",
        "unsplash_query": "sequin lehenga crop top Indian party fashion",
    },
    {
        "id": "t018", "product_type": "Lehenga", "category": "Banarasi",
        "title": "Banarasi Silk Lehenga Choli",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#7B0A34", "#FFD700", "#800020"], "color_names": ["Ruby", "Gold", "Maroon"],
        "base_score": 88, "region": "North India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Banarasi lehengas are the premier bridal trousseau item in North India. Heritage weave + contemporary silhouette = strong aspirational demand.",
        "demand_insight": "Bridal segment ₹15,000–₹1,00,000. Festive variants ₹3,500–₹8,000. October–February is peak season. Sell 2–3 months of stock in wedding season.",
        "who_should_sell": "Bridal wear stores, premium ethnic boutiques, and wedding trousseau retailers in UP, Delhi, Rajasthan, and MP.",
        "fabric_insight": "Pure katan silk or satin silk base. Meenakari (coloured silk weft) commands premium. Organza Banarasi lehenga growing in summer weddings.",
        "source_name": "Myntra", "source_search_query": "banarasi silk lehenga choli bridal",
        "unsplash_query": "banarasi lehenga bridal Indian wedding silk",
    },
    {
        "id": "t019", "product_type": "Lehenga", "category": "Resham",
        "title": "Thread Embroidery Lehenga",
        "work_type": "Resham Embroidery", "fabric_type": "Georgette",
        "colors": ["#2E8B57", "#FFD700", "#FF69B4"], "color_names": ["Sea Green", "Gold", "Pink"],
        "base_score": 76, "region": "All India",
        "festival_tags": ["Wedding", "Festive", "Navratri"],
        "why_trending": "Thread (resham) embroidery lehengas hitting the sweet spot between handwork-level beauty and affordable machine-embroidery pricing.",
        "demand_insight": "₹2,500–₹6,000 is the best-selling tier. Sangeet and Mehndi ceremony wear. Multicolour resham on pastel base is top combination.",
        "who_should_sell": "Mid-market wedding wear stores and online resellers targeting Mehndi/Sangeet occasion dressing.",
        "fabric_insight": "Georgette or raw silk base. Thread count matters for embroidery quality — 150+ threads/cm² is the premium benchmark.",
        "source_name": "Meesho", "source_search_query": "thread embroidery lehenga sangeet",
        "unsplash_query": "embroidery lehenga Indian wedding Mehndi",
    },
    {
        "id": "t020", "product_type": "Lehenga", "category": "Gota Patti",
        "title": "Gota Patti Rajasthani Lehenga",
        "work_type": "Gota Patti", "fabric_type": "Georgette",
        "colors": ["#FF8C00", "#FFD700", "#DC143C"], "color_names": ["Dark Orange", "Gold", "Crimson"],
        "base_score": 78, "region": "North India",
        "festival_tags": ["Wedding", "Teej", "Festive"],
        "why_trending": "Gota patti is having a massive revival driven by Rajasthani bridal aesthetic going national — popularised by celebrity weddings and destination wedding content.",
        "demand_insight": "Rajasthan, Gujarat bridal demand strong. National demand from destination wedding clients growing. ₹3,000–₹12,000 range for lehengas.",
        "who_should_sell": "Rajasthani ethnic stores, wedding destination boutiques, and stores near popular wedding venues in Udaipur, Jaipur, Jodhpur.",
        "fabric_insight": "Georgette and raw silk bases preferred. Gota patti (metallic ribbon cut into shapes) requires stable base fabric. Avoid lightweight chiffon for heavy gota work.",
        "source_name": "Pinterest", "source_search_query": "gota patti lehenga Rajasthan bridal",
        "unsplash_query": "gota patti lehenga Rajasthan traditional Indian",
    },
    {
        "id": "t021", "product_type": "Lehenga", "category": "Velvet Bridal",
        "title": "Velvet Zardozi Bridal Lehenga",
        "work_type": "Zardozi", "fabric_type": "Velvet",
        "colors": ["#4B0082", "#FFD700", "#800020"], "color_names": ["Deep Purple", "Gold", "Maroon"],
        "base_score": 84, "region": "North India",
        "festival_tags": ["Wedding"],
        "why_trending": "Velvet bridal lehengas are surging in winter wedding season. Heavy zardozi on velvet creates a regal look that photos exceptionally well.",
        "demand_insight": "Winter weddings (Nov–Jan) exclusive. ₹20,000–₹2,00,000 premium segment. Royal purple and deep wine are top colours. Lead time 4–8 weeks on order.",
        "who_should_sell": "Luxury bridal boutiques only. Not a volume product — high ticket, low quantity. Perfect for couture-to-order stores.",
        "fabric_insight": "Silk velvet base (not synthetic) is the premium benchmark. Weight 350–450 GSM. Zardozi work requires minimum 3mm pile height for needle clarity.",
        "source_name": "Pinterest", "source_search_query": "velvet zardozi bridal lehenga luxury",
        "unsplash_query": "velvet bridal lehenga zardozi Indian wedding luxury",
    },
    {
        "id": "t022", "product_type": "Lehenga", "category": "Digital Print",
        "title": "Digital Print Flared Lehenga",
        "work_type": "Digital Print", "fabric_type": "Crepe",
        "colors": ["#FF69B4", "#9370DB", "#00CED1"], "color_names": ["Hot Pink", "Purple", "Teal"],
        "base_score": 70, "region": "All India",
        "festival_tags": ["Navratri", "Festive", "Casual Wear"],
        "why_trending": "Digital print lehengas are the affordable entry point to ethnic fashion — bold prints, Instagram-worthy looks at ₹800–₹2,500.",
        "demand_insight": "High velocity segment. Navratri and college fest demand peaks. Floral, geometric, and abstract prints in bold colours move fastest.",
        "who_should_sell": "Budget festive wear retailers, college town stores, online resellers, and youth fashion boutiques.",
        "fabric_insight": "Crepe or satin base gives best print quality and sheen. Avoid matte fabrics for digital prints — colours appear washed out.",
        "source_name": "Meesho", "source_search_query": "digital print lehenga under 1500",
        "unsplash_query": "digital print lehenga colorful India youth fashion",
    },
    {
        "id": "t023", "product_type": "Lehenga", "category": "Kutchi",
        "title": "Kutchi Embroidery Lehenga Choli",
        "work_type": "Kutchi Work", "fabric_type": "Cotton",
        "colors": ["#FF4500", "#FFD700", "#1E90FF"], "color_names": ["Vermilion", "Gold", "Royal Blue"],
        "base_score": 74, "region": "West India",
        "festival_tags": ["Navratri", "Festive", "Wedding"],
        "why_trending": "Kutchi embroidery is having a heritage revival. The intricate geometric patterns are being repositioned as fashion-forward tribal chic.",
        "demand_insight": "Gujarat and Rajasthan home market strong. National boutique demand growing. Museum-grade pieces at premium; mass-market imitations at ₹1,500–₹3,000.",
        "who_should_sell": "Craft retailers, tribal/folk art boutiques, and stores at tourism and craft fairs in Gujarat.",
        "fabric_insight": "Cotton or Khadi base for authentic Kutchi work. Embroidery is done on finished fabric, so fabric weight matters for needle passage.",
        "source_name": "Amazon India", "source_search_query": "kutchi embroidery lehenga Gujarat",
        "unsplash_query": "kutchi embroidery lehenga Gujarat tribal craft",
    },
    {
        "id": "t024", "product_type": "Lehenga", "category": "Zardozi Bridal",
        "title": "Heavy Zari Bridal Lehenga",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#8B0000", "#FFD700", "#FF4500"], "color_names": ["Deep Red", "Gold", "Orange"],
        "base_score": 90, "region": "North India",
        "festival_tags": ["Wedding"],
        "why_trending": "The classic heavy bridal lehenga is experiencing a resurgence as brides balance contemporary aesthetics with traditional expectations.",
        "demand_insight": "₹25,000–₹3,00,000 premium bridal segment. Wedding season Oct–Feb. Red and ruby remain top bridal colours despite pastel trend.",
        "who_should_sell": "Premium bridal boutiques with strong wedding-season inventory. Stores near wedding venues and hotel shopping arcades.",
        "fabric_insight": "Pure silk (crepe de chine or satin silk) base. Zari weight above 200g/metre gives heirloom feel. Pure gold/silver zari versus imitation copper-core zari — buyers increasingly ask to verify.",
        "source_name": "Myntra", "source_search_query": "heavy zari bridal lehenga red gold",
        "unsplash_query": "bridal lehenga red gold heavy Indian wedding",
    },

    # ══════════════════════════════════════════════════════════════
    # SALWAR SUITS (8 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t025", "product_type": "Salwar Suit", "category": "Anarkali",
        "title": "Floor-Length Anarkali Suit",
        "work_type": "Machine Work", "fabric_type": "Chiffon",
        "colors": ["#4B0082", "#9B59B6", "#D7BDE2"], "color_names": ["Indigo", "Purple", "Lavender"],
        "base_score": 79, "region": "North India",
        "festival_tags": ["Eid", "Wedding", "Festive"],
        "why_trending": "Floor-length Anarkalis making a strong comeback — printed dupattas and embellished borders for Eid and sangeet functions are driving the trend.",
        "demand_insight": "Eid orders start 4 weeks early. Purple, turquoise, and mint lead. Pair with printed chiffon dupatta for higher average order value.",
        "who_should_sell": "Suit stores targeting Eid buyers and wedding guests. North India and Muslim majority regions have consistent demand.",
        "fabric_insight": "Chiffon Anarkali gives flowing silhouette. Georgette for stiffness; crepe for structure. Poly-chiffon for budget; pure chiffon for premium.",
        "source_name": "Myntra", "source_search_query": "floor length anarkali suit eid",
        "unsplash_query": "anarkali suit Indian fashion wedding",
    },
    {
        "id": "t026", "product_type": "Salwar Suit", "category": "Phulkari",
        "title": "Phulkari Suit Set",
        "work_type": "Phulkari", "fabric_type": "Cotton",
        "colors": ["#FF6B35", "#FFD700", "#FF1493"], "color_names": ["Orange", "Yellow", "Deep Pink"],
        "base_score": 75, "region": "North India",
        "festival_tags": ["Teej", "Lohri", "Baisakhi", "Festive"],
        "why_trending": "Phulkari is experiencing a Gen-Z revival as a symbol of Punjab textile heritage. Festival season triples demand; social media artisan accounts amplifying.",
        "demand_insight": "Bridal Phulkari sets ₹2,500–₹6,000. Plain suit with Phulkari dupatta ₹900–₹2,000. Punjab and Delhi NCR market strong year-round.",
        "who_should_sell": "Punjabi ethnic wear stores, North India festive retailers, and online stores with strong Phulkari curation.",
        "fabric_insight": "Cotton base (40–60s count) for authentic Phulkari. Khaddar (winter cotton) for heavy Phulkari. Synthetic base for budget machine-Phulkari imitations.",
        "source_name": "Amazon India", "source_search_query": "phulkari suit set punjabi",
        "unsplash_query": "phulkari embroidery Indian traditional Punjab",
    },
    {
        "id": "t027", "product_type": "Salwar Suit", "category": "Tilla",
        "title": "Kashmiri Tilla Embroidery Suit",
        "work_type": "Tilla Work", "fabric_type": "Silk",
        "colors": ["#006400", "#228B22", "#FFD700"], "color_names": ["Dark Green", "Emerald", "Gold"],
        "base_score": 83, "region": "North India",
        "festival_tags": ["Eid", "Wedding", "Festive"],
        "why_trending": "Kashmiri Tilla (gold/silver wire embroidery) is gaining premium positioning nationally, driven by social media showcasing of Kashmir craft heritage.",
        "demand_insight": "Premium tier ₹4,000–₹10,000. Eid and wedding demand concentrated Dec–Mar. J&K home market + Delhi NCR premium boutique buyers.",
        "who_should_sell": "Premium ethnic boutiques, stores with Kashmir craft focus, and luxury multi-brand ethnic fashion stores.",
        "fabric_insight": "Silk base (Jamawar or plain silk) for Tilla work. Tilla wire (metallic) is delicate — washing instructions critical. Dry-clean only market.",
        "source_name": "Pinterest", "source_search_query": "kashmiri tilla embroidery suit",
        "unsplash_query": "kashmiri embroidery suit traditional India",
    },
    {
        "id": "t028", "product_type": "Salwar Suit", "category": "Chikankari",
        "title": "Lucknowi Chikankari Suit Set",
        "work_type": "Chikankari Work", "fabric_type": "Georgette",
        "colors": ["#FFFFFF", "#F0E68C", "#FFB6C1"], "color_names": ["White", "Light Yellow", "Light Pink"],
        "base_score": 86, "region": "North India",
        "festival_tags": ["Eid", "Festive", "Summer", "Casual Wear"],
        "why_trending": "Chikankari is the evergreen comfort-meets-elegance choice. Celebrities and influencers wearing it for casual-elegant occasions is fuelling year-round demand.",
        "demand_insight": "Year-round seller. White and pastels peak in summer. Festive season drives embellished chikankari demand. ₹1,500–₹5,000 mid-market dominates.",
        "who_should_sell": "Ethnic wear stores across North India, Lucknow-focused stores, and online stores targeting working women and college students.",
        "fabric_insight": "Pure georgette chiffon for premium chikankari. Cotton mulmul for summer chikankari. Rayon for affordable segment. Machine chikankari on Rayon at ₹500–₹800.",
        "source_name": "Myntra", "source_search_query": "lucknowi chikankari suit set",
        "unsplash_query": "chikankari Lucknow embroidery suit India",
    },
    {
        "id": "t029", "product_type": "Salwar Suit", "category": "Patiala",
        "title": "Patiala Salwar Printed Set",
        "work_type": "Block Print", "fabric_type": "Cotton",
        "colors": ["#FF4500", "#FFD700", "#1E90FF"], "color_names": ["Vermilion", "Yellow", "Royal Blue"],
        "base_score": 65, "region": "North India",
        "festival_tags": ["Casual Wear", "Festive", "Baisakhi"],
        "why_trending": "Patiala salwar is a comfort-fashion staple experiencing revival in casual and festive markets, especially among younger buyers seeking traditional-but-relaxed looks.",
        "demand_insight": "Volume segment ₹400–₹1,200. Summer demand strong for cotton Patiala. Baisakhi season peaks in April. Online sales significantly expanding reach.",
        "who_should_sell": "Value-for-money ethnic wear retailers, daily-wear and casual ethnic stores, and market sellers targeting Tier-2/3 cities.",
        "fabric_insight": "Cotton cambric (80s count) preferred for Patiala due to volume of fabric. Rayon for budget tier. Block-print and screen-print versions dominate.",
        "source_name": "Meesho", "source_search_query": "patiala salwar set cotton",
        "unsplash_query": "patiala suit Indian traditional Punjab fashion",
    },
    {
        "id": "t030", "product_type": "Salwar Suit", "category": "Palazzo",
        "title": "Palazzo Suit Set Rayon",
        "work_type": "Digital Print", "fabric_type": "Rayon",
        "colors": ["#9370DB", "#FF69B4", "#00CED1"], "color_names": ["Purple", "Pink", "Teal"],
        "base_score": 71, "region": "All India",
        "festival_tags": ["Casual Wear", "Festive", "Summer"],
        "why_trending": "Palazzo suits bridge Western comfort with ethnic aesthetic — popular for office wear, college, and casual festive. Rayon palazzo is the bestselling casual ethnic format.",
        "demand_insight": "₹500–₹1,500 sweet spot. High velocity. Summer and casual occasion demand year-round. Gradient and ombre digital prints trending.",
        "who_should_sell": "Casual and daily-wear ethnic stores, college-area boutiques, and online sellers targeting youth and working women aged 18–30.",
        "fabric_insight": "Rayon (viscose) 60–70 GSM gives flowing palazzo silhouette. Poly-rayon blend for durability. Buyers check for colour fastness — high rejection rate for bleeding colours.",
        "source_name": "Meesho", "source_search_query": "palazzo suit rayon digital print",
        "unsplash_query": "palazzo suit Indian fashion casual",
    },
    {
        "id": "t031", "product_type": "Salwar Suit", "category": "Aari Work",
        "title": "Aari Embroidery Suit",
        "work_type": "Aari Work", "fabric_type": "Silk",
        "colors": ["#8B0000", "#FFD700", "#006400"], "color_names": ["Deep Red", "Gold", "Emerald"],
        "base_score": 73, "region": "South India",
        "festival_tags": ["Wedding", "Eid", "Festive"],
        "why_trending": "Aari embroidery (hook-needle craft) is seeing growing national demand. South India–origin craft gaining premium positioning in North India boutiques.",
        "demand_insight": "Premium segment ₹3,000–₹8,000. South India home market year-round. National demand growing via Instagram showcasing of intricate Aari work.",
        "who_should_sell": "Premium ethnic boutiques, South India–focused stores, and multi-brand stores building premium handwork section.",
        "fabric_insight": "Organza, net, or raw silk base for Aari work. Fine Aari needle requires smooth fabric with minimal texture. Embroidery density determines price.",
        "source_name": "Nykaa Fashion", "source_search_query": "aari embroidery suit South Indian",
        "unsplash_query": "aari embroidery suit Indian traditional craft",
    },
    {
        "id": "t032", "product_type": "Salwar Suit", "category": "Straight Suit",
        "title": "Cotton Straight Suit Screen Print",
        "work_type": "Screen Print", "fabric_type": "Cotton",
        "colors": ["#F5DEB3", "#8B6914", "#4682B4"], "color_names": ["Wheat", "Khaki Gold", "Steel Blue"],
        "base_score": 63, "region": "All India",
        "festival_tags": ["Casual Wear", "Summer"],
        "why_trending": "Cotton straight suits are the staple daily-wear ethnic option. Screen-print variants in geometric and abstract patterns seeing growing office ethnic wear demand.",
        "demand_insight": "Volume segment ₹350–₹900. Year-round but peaks in summer. Office ethnic day demand growing in Tier-1 cities. Consistent repeat purchase category.",
        "who_should_sell": "Daily wear ethnic stores, market retailers, and volume online sellers. Bundle dupatta + fabric for higher order value.",
        "fabric_insight": "Cotton cambric (80–100s count) is standard. Mulmul for premium soft hand. Screen print (water-based) for colour durability vs reactive dyes for vibrancy.",
        "source_name": "Amazon India", "source_search_query": "cotton straight suit casual ethnic",
        "unsplash_query": "cotton suit Indian ethnic casual wear",
    },

    # ══════════════════════════════════════════════════════════════
    # KURTIS (7 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t033", "product_type": "Kurti", "category": "Bandhani",
        "title": "Bandhani Cotton Kurti",
        "work_type": "Bandhani", "fabric_type": "Cotton",
        "colors": ["#DC143C", "#FF8C00", "#1E90FF"], "color_names": ["Crimson", "Dark Orange", "Blue"],
        "base_score": 72, "region": "West India",
        "festival_tags": ["Navratri", "Holi", "Casual Wear"],
        "why_trending": "Bandhani kurti format is making the craft accessible for daily wear — going from festive-only to year-round casual ethnic staple.",
        "demand_insight": "Gujarat demand consistent. Pan-India growing via e-commerce. ₹400–₹1,200 tier. Red, yellow, and royal blue sell fastest. Navratri triples volume.",
        "who_should_sell": "Casual ethnic wear stores across Western India, Navratri festive sellers, and online resellers with Gujarat/Rajasthan market focus.",
        "fabric_insight": "Cotton (60s count) is the standard base for Bandhani. Silk Bandhani for premium. Gajji silk for the authentic Rajkot Bandhani.",
        "source_name": "Meesho", "source_search_query": "bandhani cotton kurti",
        "unsplash_query": "bandhani kurti Indian colorful tie dye",
    },
    {
        "id": "t034", "product_type": "Kurti", "category": "Chikankari",
        "title": "Chikankari Long Kurti Georgette",
        "work_type": "Chikankari Work", "fabric_type": "Georgette",
        "colors": ["#FFFFFF", "#F0E6FA", "#FFB6C1"], "color_names": ["White", "Lavender Mist", "Blush"],
        "base_score": 85, "region": "North India",
        "festival_tags": ["Summer", "Eid", "Casual Wear", "Festive"],
        "why_trending": "Chikankari long kurti is the top office-ethnic hybrid. Celebrities and influencers made it the go-to 'effortlessly ethnic' look.",
        "demand_insight": "₹900–₹2,500 is the core segment. Summer peaks. White and pastels year-round. Festive season embellished versions at ₹2,500–₹5,000.",
        "who_should_sell": "Ethnic wear stores targeting working women and college students. Online kurti stores with strong photography and styling content.",
        "fabric_insight": "Georgette-chiffon blend is the premium fabric. Pure chiffon for flowing silhouette. Viscose rayon for affordable Chikankari. Cotton for summer variants.",
        "source_name": "Myntra", "source_search_query": "chikankari long kurti georgette",
        "unsplash_query": "chikankari kurti Indian fashion elegant",
    },
    {
        "id": "t035", "product_type": "Kurti", "category": "Block Print",
        "title": "Jaipur Block Print A-Line Kurti",
        "work_type": "Block Print", "fabric_type": "Cotton",
        "colors": ["#003366", "#F5DEB3", "#DC143C"], "color_names": ["Navy", "Cream", "Red"],
        "base_score": 77, "region": "North India",
        "festival_tags": ["Casual Wear", "Summer", "Festive"],
        "why_trending": "Jaipur block print kurtis are consistently in the top search results for ethnic casual wear — sustainable, artisanal, and Instagram-friendly.",
        "demand_insight": "₹600–₹2,000 segment. Summer peak demand. Navy-on-white and red-on-beige combinations are the perennial bestsellers.",
        "who_should_sell": "Casual ethnic stores, artisan-focused boutiques, and online sellers with Jaipur craft narrative. Tourism retail in Rajasthan.",
        "fabric_insight": "Cotton (80–100s count) for sharper block print impression. Mulmul for soft luxury. Prints with natural dyes command 30–40% premium over synthetic.",
        "source_name": "Amazon India", "source_search_query": "Jaipur block print kurti cotton",
        "unsplash_query": "block print kurti Jaipur Indian craft",
    },
    {
        "id": "t036", "product_type": "Kurti", "category": "Machine Embroidery",
        "title": "Embroidered Rayon Kurti",
        "work_type": "Machine Embroidery", "fabric_type": "Rayon",
        "colors": ["#9B59B6", "#E8DAEF", "#FFD700"], "color_names": ["Purple", "Lilac", "Gold"],
        "base_score": 68, "region": "All India",
        "festival_tags": ["Festive", "Casual Wear"],
        "why_trending": "Machine embroidery kurtis are the mass-market entry into ethnic fashion — affordable embellishment at ₹500–₹1,500 driving high online volume.",
        "demand_insight": "Very high velocity online. Festive season quadruples demand. Combo sets (kurti + pant + dupatta) outsell standalone kurtis 4:1.",
        "who_should_sell": "Volume online resellers, market sellers, and daily wear ethnic stores. Bundle as 3-piece sets for better perceived value.",
        "fabric_insight": "Viscose rayon (210 GSM) is the dominant base. Poly-cotton for durability. Embroidery density and colour fastness are main quality markers.",
        "source_name": "Meesho", "source_search_query": "embroidered rayon kurti set",
        "unsplash_query": "embroidered kurti Indian fashion casual ethnic",
    },
    {
        "id": "t037", "product_type": "Kurti", "category": "Hand-Painted",
        "title": "Hand-Painted Silk Kurti",
        "work_type": "Handpaint", "fabric_type": "Silk",
        "colors": ["#FF7F50", "#9ACD32", "#6495ED"], "color_names": ["Coral", "Yellow Green", "Cornflower Blue"],
        "base_score": 69, "region": "All India",
        "festival_tags": ["Summer", "Festive"],
        "why_trending": "Hand-painted pieces are positioning as wearable art — growing artisan Instagram segment driving aspirational demand in urban markets.",
        "demand_insight": "Small batch (5–10 pieces). ₹2,000–₹5,000 range. Urban Tier-1 buyers. Boutique and exhibition sales model works best.",
        "who_should_sell": "Boutique stores with artisan focus, craft exhibitions, and online direct-to-artisan platforms. Not suited for mass retail.",
        "fabric_insight": "Silk base (Mysore silk or tussar) absorbs fabric paint best. Cotton silk blend for affordability. Batik wax-resist variants also trending.",
        "source_name": "Pinterest", "source_search_query": "hand painted silk kurti artisan India",
        "unsplash_query": "hand painted silk kurti Indian artisan",
    },
    {
        "id": "t038", "product_type": "Kurti", "category": "Gota Work",
        "title": "Gota Work Anarkali Kurti",
        "work_type": "Gota Patti", "fabric_type": "Georgette",
        "colors": ["#FF8C00", "#FFD700", "#FFFFFF"], "color_names": ["Orange", "Gold", "White"],
        "base_score": 74, "region": "North India",
        "festival_tags": ["Teej", "Festive", "Wedding"],
        "why_trending": "Gota patti kurtis are the accessible entry into Rajasthani bridal aesthetic — popular for Teej, Haldi ceremonies and festive occasions.",
        "demand_insight": "₹1,200–₹3,000 range. Teej, Hartalika, and wedding ceremony demand drives peaks. Orange, yellow, and off-white are top Gota kurti shades.",
        "who_should_sell": "North India festive wear stores, bridal ceremony ethnic retailers, and boutiques with Rajasthani aesthetic focus.",
        "fabric_insight": "Georgette base (60–70 GSM) preferred for Gota work kurtis. Rayon also used for affordability. Gota ribbon quality crucial — brass core vs aluminium affects longevity.",
        "source_name": "Myntra", "source_search_query": "gota work anarkali kurti",
        "unsplash_query": "gota patti kurti Indian traditional Rajasthani",
    },
    {
        "id": "t039", "product_type": "Kurti", "category": "Mirror Work",
        "title": "Mirror Work Cotton Kurti",
        "work_type": "Mirror Work", "fabric_type": "Cotton",
        "colors": ["#1E90FF", "#FFD700", "#DC143C"], "color_names": ["Royal Blue", "Gold", "Red"],
        "base_score": 70, "region": "West India",
        "festival_tags": ["Navratri", "Garba", "Casual Wear"],
        "why_trending": "Mirror work kurtis are capturing daily ethnic wear demand — practical, festive-ready, and photographically distinctive at affordable price points.",
        "demand_insight": "₹600–₹1,800 range. Navratri season peaks 3–4x. Royal blue and red with gold mirror most popular combinations.",
        "who_should_sell": "Festive wear casual ethnic stores in Gujarat, Rajasthan. Online stores with Navratri season planning.",
        "fabric_insight": "Cotton cambric base preferred for mirror work — stability for hand stitching. Rayon base for machine-mirror (glued) versions.",
        "source_name": "Amazon India", "source_search_query": "mirror work cotton kurti Gujarat",
        "unsplash_query": "mirror work kurti Indian fashion Gujarat",
    },

    # ══════════════════════════════════════════════════════════════
    # FABRIC / THAAN (12 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t040", "product_type": "Fabric-Thaan", "category": "Lawn Cotton",
        "title": "Cotton Lawn Fabric — Printed Rolls",
        "work_type": "Digital Print", "fabric_type": "Cotton Lawn",
        "colors": ["#FFFFFF", "#FFB6C1", "#ADD8E6"], "color_names": ["White", "Blush", "Light Blue"],
        "base_score": 80, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear"],
        "why_trending": "Lawn fabric demand surging in garment-manufacturing hubs. Soft, breathable texture ideal for summer suits — garment makers switching from polyester to lawn.",
        "demand_insight": "Surat, Jaipur, and Kolkata wholesale markets seeing 25% volume growth. Floral and abstract digital prints on white lawn base selling fastest.",
        "who_should_sell": "Fabric wholesalers, thaan retailers, and garment manufacturers. Bundle 5–10m rolls for institutional buyers.",
        "fabric_insight": "80s count cotton lawn gives the premium soft hand. 60s count for budget. Pakistani lawn (imported) commands premium; Indian lawn growing in quality.",
        "source_name": "Google Trends", "source_search_query": "cotton lawn fabric thaan wholesale India",
        "unsplash_query": "cotton fabric rolls textile India wholesale",
    },
    {
        "id": "t041", "product_type": "Fabric-Thaan", "category": "Georgette",
        "title": "Digital Print Georgette Fabric",
        "work_type": "Digital Print", "fabric_type": "Georgette",
        "colors": ["#FF69B4", "#9370DB", "#00CED1"], "color_names": ["Hot Pink", "Purple", "Teal"],
        "base_score": 77, "region": "All India",
        "festival_tags": ["Festive", "Summer", "Wedding"],
        "why_trending": "Digital print georgette is the single highest-volume printed fabric segment — rapid design changeovers and no minimum order on digital printing fuelling demand.",
        "demand_insight": "Surat dominates supply. Retailers buy 50–200m/design. Floral and abstract patterns on pastel and bold base colours dominate. Festive season drives 2x volume.",
        "who_should_sell": "Fabric wholesalers, thaan stores, saree and suit manufacturers, and fabric retailers serving local tailors.",
        "fabric_insight": "45–50 GSM georgette (medium weight) best for sarees and suits. 60–70 GSM for lehengas. Korean georgette command 15–20% premium over Chinese variants.",
        "source_name": "Google Trends", "source_search_query": "digital print georgette fabric wholesale",
        "unsplash_query": "georgette fabric textile colorful fashion India",
    },
    {
        "id": "t042", "product_type": "Fabric-Thaan", "category": "Brocade",
        "title": "Banarasi Brocade Fabric — Gold Woven",
        "work_type": "Zari Work", "fabric_type": "Silk Brocade",
        "colors": ["#FFD700", "#8B0000", "#4B0082"], "color_names": ["Gold", "Deep Red", "Purple"],
        "base_score": 85, "region": "North India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Banarasi brocade fabric is a non-negotiable for garment makers in the premium bridal and festive segment. Woven-in zari demand remains the gold standard.",
        "demand_insight": "Varanasi supply dominates. Premium garment makers use 1–5m per outfit. Wedding season order books fill Oct–Jan. ₹400–₹2,000/metre depending on zari percentage.",
        "who_should_sell": "Premium fabric wholesalers, garment manufacturers in bridal segment, and standalone brocade thaan retailers.",
        "fabric_insight": "Katan silk base with pure gold/silver zari for authentic Banarasi brocade. Satin base brocade for mid-market. Viscose brocade for affordable segment.",
        "source_name": "Google Trends", "source_search_query": "banarasi brocade fabric wholesale",
        "unsplash_query": "banarasi brocade fabric gold zari India",
    },
    {
        "id": "t043", "product_type": "Fabric-Thaan", "category": "Chiffon",
        "title": "Pure Chiffon Fabric — Plain & Printed",
        "work_type": "Digital Print", "fabric_type": "Chiffon",
        "colors": ["#E8D5F5", "#FFE4B5", "#E0FFFF"], "color_names": ["Lavender", "Moccasin", "Light Cyan"],
        "base_score": 73, "region": "All India",
        "festival_tags": ["Summer", "Wedding", "Festive"],
        "why_trending": "Chiffon fabric demand driven by Anarkali suit and saree markets. Importers seeing growing preference for Korean chiffon over Chinese due to sheen quality.",
        "demand_insight": "₹80–₹200/metre for poly chiffon; ₹400–₹800 for Korean. Pastel and solid shades for suits; printed for sarees. Summer and festive season peak.",
        "who_should_sell": "Fabric wholesalers supplying to suit and saree manufacturers. Fabric retailers with strong garment manufacturer clientele.",
        "fabric_insight": "Weight 44–50 GSM for standard chiffon; 60 GSM for double chiffon. Korean chiffon identified by uniform weave and resistance to fraying — test by burning edge.",
        "source_name": "Google Trends", "source_search_query": "pure chiffon fabric wholesale India",
        "unsplash_query": "chiffon fabric sheer India textile",
    },
    {
        "id": "t044", "product_type": "Fabric-Thaan", "category": "Rayon",
        "title": "Rayon Printed Fabric — Floral Rolls",
        "work_type": "Screen Print", "fabric_type": "Rayon",
        "colors": ["#FF69B4", "#98FB98", "#87CEEB"], "color_names": ["Hot Pink", "Pale Green", "Sky Blue"],
        "base_score": 74, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear"],
        "why_trending": "Rayon is the highest-volume base fabric for affordable kurtis and suits. Rapid print changeovers make it the most dynamic printed fabric category.",
        "demand_insight": "Surat and Jaipur dominate production. Retailers order 100–500m per design. Floral and abstract prints on mid-tones (teal, coral, mustard) drive volume.",
        "who_should_sell": "Fabric wholesalers, mass-market kurti manufacturers, and fabric retailers in Tier-2/3 markets.",
        "fabric_insight": "Viscose rayon 200–210 GSM is the kurti standard. 100% viscose vs viscose-polyester blend — buyers ask for shrinkage test and colorfastness certificate.",
        "source_name": "Google Trends", "source_search_query": "rayon printed fabric thaan wholesale",
        "unsplash_query": "rayon fabric rolls textile manufacturing India",
    },
    {
        "id": "t045", "product_type": "Fabric-Thaan", "category": "Organza",
        "title": "Organza Fabric — Plain & Embroidered",
        "work_type": "Machine Work", "fabric_type": "Organza",
        "colors": ["#FFF8E7", "#F5CBA7", "#C0C0C0"], "color_names": ["Ivory", "Peach", "Silver"],
        "base_score": 81, "region": "All India",
        "festival_tags": ["Wedding", "Summer", "Festive"],
        "why_trending": "Organza fabric is the #1 trending premium fabric in the bridal segment — demand up 40% as the organza saree and lehenga trend continues.",
        "demand_insight": "Korean organza at ₹250–₹600/metre. Plain for self-use; embroidered for margins. Garment makers buying 10–50m/design for bridal collections.",
        "who_should_sell": "Premium fabric wholesalers, bridal wear manufacturers, and boutique fabric retailers with a premium saree and lehenga segment.",
        "fabric_insight": "Korean organza (Silk Organza substitute) is dominant. Weight 30–40 GSM. Crisp handle better than silk organza for structured drape. Test for pure silk: burn test.",
        "source_name": "Google Trends", "source_search_query": "organza fabric wholesale India bridal",
        "unsplash_query": "organza fabric sheer textile India",
    },
    {
        "id": "t046", "product_type": "Fabric-Thaan", "category": "Viscose",
        "title": "Viscose Blend Crepe Fabric",
        "work_type": "Digital Print", "fabric_type": "Viscose Crepe",
        "colors": ["#800020", "#4B0082", "#006400"], "color_names": ["Burgundy", "Purple", "Forest Green"],
        "base_score": 67, "region": "All India",
        "festival_tags": ["Festive", "Casual Wear"],
        "why_trending": "Viscose crepe growing as the drape-heavy suit fabric preferred by boutique garment makers for structured long kurtis and Anarkalis.",
        "demand_insight": "₹120–₹250/metre. Year-round demand. Jewel tones (burgundy, teal, emerald) peak in festive season. Garment makers prefer 3m/suit piece.",
        "who_should_sell": "Fabric wholesalers and thaan retailers with garment manufacturer customer base. Boutique fabric stores for premium designers.",
        "fabric_insight": "Viscose crepe 200 GSM standard. Poly-viscose blend for durability; pure viscose for better drape. Colour fastness is primary buyer concern.",
        "source_name": "Google Trends", "source_search_query": "viscose crepe fabric wholesale India",
        "unsplash_query": "viscose crepe fabric textile India",
    },
    {
        "id": "t047", "product_type": "Fabric-Thaan", "category": "Net",
        "title": "Net Embroidered Fabric",
        "work_type": "Machine Embroidery", "fabric_type": "Net",
        "colors": ["#C0C0C0", "#FFD700", "#000000"], "color_names": ["Silver", "Gold", "Black"],
        "base_score": 78, "region": "All India",
        "festival_tags": ["Wedding", "Festive"],
        "why_trending": "Net fabric with machine embroidery is the affordable path to heavy-look bridal and festive garments. Garment makers combining net with satin lining for premium output.",
        "demand_insight": "₹200–₹800/metre. Wedding and festive season doubles demand. Sequence net and cutwork net popular for party wear. Black-gold and silver-red combinations lead.",
        "who_should_sell": "Fabric retailers targeting bridal garment makers, party wear manufacturers, and boutique stores with evening wear focus.",
        "fabric_insight": "Soft net (60–70 GSM) for sarees and Anarkalis; stiff net for lehenga skirt volume. Thread-count in net weave determines drape quality.",
        "source_name": "Google Trends", "source_search_query": "net embroidered fabric wholesale bridal",
        "unsplash_query": "net fabric embroidered textile bridal India",
    },
    {
        "id": "t048", "product_type": "Fabric-Thaan", "category": "Linen",
        "title": "Pure Linen Fabric — Solid & Printed",
        "work_type": "Screen Print", "fabric_type": "Linen",
        "colors": ["#F5DEB3", "#8FBC8F", "#4682B4"], "color_names": ["Wheat", "Dark Sea Green", "Steel Blue"],
        "base_score": 72, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear"],
        "why_trending": "Linen fabric growing in premium casual ethnic segment. Sustainability narrative + natural texture resonating with urban conscious buyers.",
        "demand_insight": "₹180–₹500/metre. Summer peak (March–June). Natural undyed and block-printed linen commanding 20% premium. Linen-silk blends for premium garments.",
        "who_should_sell": "Premium fabric retailers, artisan boutique fabric stores, and fabric wholesalers supplying to sustainable fashion garment makers.",
        "fabric_insight": "14s count for standard linen; 30s for finer texture. Belgian and Irish linen (imported) at premium; Indian linen from Bihar and Uttar Pradesh growing in quality.",
        "source_name": "Amazon India", "source_search_query": "pure linen fabric textile India",
        "unsplash_query": "linen fabric natural textile India sustainable",
    },
    {
        "id": "t049", "product_type": "Fabric-Thaan", "category": "Velvet",
        "title": "Velvet Fabric — Solid Rolls",
        "work_type": "Handwork", "fabric_type": "Velvet",
        "colors": ["#4B0082", "#8B0000", "#006400"], "color_names": ["Deep Purple", "Deep Red", "Forest Green"],
        "base_score": 76, "region": "North India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Velvet fabric demand peaks in winter wedding and Diwali season. Garment makers using velvet for lehenga skirts, blouses, and festive kurtis.",
        "demand_insight": "₹250–₹800/metre. November–January peak season. Deep jewel tones (purple, wine, emerald, navy) most in demand. Silk velvet at ₹1,200–₹2,500/metre for premium.",
        "who_should_sell": "Fabric wholesalers with winter inventory, premium garment manufacturers, and fabric retailers near wedding market hubs.",
        "fabric_insight": "Polyester velvet (325–350 GSM) for affordability; silk velvet for premium. Pile height 2–3mm is standard; higher pile for luxurious hand feel.",
        "source_name": "Google Trends", "source_search_query": "velvet fabric thaan wholesale India winter",
        "unsplash_query": "velvet fabric rich textile India luxury",
    },
    {
        "id": "t050", "product_type": "Fabric-Thaan", "category": "Digital Print Crepe",
        "title": "Crepe Fabric — Digital Print Rolls",
        "work_type": "Digital Print", "fabric_type": "Crepe",
        "colors": ["#FF6347", "#9370DB", "#20B2AA"], "color_names": ["Tomato Red", "Purple", "Teal"],
        "base_score": 69, "region": "All India",
        "festival_tags": ["Festive", "Summer", "Casual Wear"],
        "why_trending": "Digital print crepe is gaining over georgette in the affordable suit and kurti segment — better drape weight and ink absorption give sharper prints.",
        "demand_insight": "₹90–₹180/metre. Year-round. Floral and abstract digital prints most popular. Garment makers buying 200–500m/design on 45-day payment credit.",
        "who_should_sell": "Fabric wholesalers and thaan retailers supplying to mass-market kurti and suit manufacturers.",
        "fabric_insight": "Poly-crepe 180–200 GSM is the standard. Matte finish preferred over shiny for digital print clarity. Bi-stretch crepe growing for comfort fits.",
        "source_name": "Google Trends", "source_search_query": "digital print crepe fabric wholesale",
        "unsplash_query": "crepe fabric rolls textile India",
    },
    {
        "id": "t051", "product_type": "Fabric-Thaan", "category": "Silk Dupion",
        "title": "Dupion Silk Fabric — Plain & Woven",
        "work_type": "Handwork", "fabric_type": "Dupion Silk",
        "colors": ["#D4AC0D", "#8B0000", "#4B0082"], "color_names": ["Dark Gold", "Deep Red", "Purple"],
        "base_score": 75, "region": "South India",
        "festival_tags": ["Wedding", "Festive", "Pongal"],
        "why_trending": "Dupion silk is seeing a major comeback as a blouse and salwar material in South India — the textured sheen photographs well and positions as premium without silk prices.",
        "demand_insight": "₹180–₹600/metre. Wedding season peak. Garment makers use for blouses, dupattas, and structured lehenga skirts. South India demand dominant.",
        "who_should_sell": "South India fabric retailers, wedding garment manufacturers, and premium fabric wholesalers.",
        "fabric_insight": "Dupion is made from two silk threads twisted together — gives characteristic nubs and sheen. Pure silk vs poly-dupion: weight test and burn test distinguish them.",
        "source_name": "Amazon India", "source_search_query": "dupion silk fabric thaan India",
        "unsplash_query": "dupion silk fabric texture India traditional",
    },

    # ══════════════════════════════════════════════════════════════
    # DUPATTAS (5 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t052", "product_type": "Dupatta", "category": "Phulkari",
        "title": "Phulkari Embroidered Dupatta",
        "work_type": "Phulkari", "fabric_type": "Cotton",
        "colors": ["#FF6B35", "#FFD700", "#FF1493"], "color_names": ["Orange", "Yellow", "Deep Pink"],
        "base_score": 73, "region": "North India",
        "festival_tags": ["Teej", "Lohri", "Baisakhi", "Festive"],
        "why_trending": "Phulkari dupatta is selling as a versatile add-on to plain suits — buyers pairing it with non-ethnic wear for a 'fusion ethnic' look that's trending.",
        "demand_insight": "₹400–₹1,500. Year-round but Baisakhi and Lohri spike. Stock 8 weeks before Baisakhi. Orange-on-red and yellow-on-green combinations lead.",
        "who_should_sell": "North India ethnic stores, gift item retailers, and online stores targeting festive gifting. Bundle with plain suit for higher ticket.",
        "fabric_insight": "Cotton base (60–80s count) for Phulkari embroidery. Khaddar for winter variants. Machine Phulkari on rayon at ₹200–₹500 for budget segment.",
        "source_name": "Amazon India", "source_search_query": "phulkari dupatta Punjab India",
        "unsplash_query": "phulkari dupatta embroidery India",
    },
    {
        "id": "t053", "product_type": "Dupatta", "category": "Bandhani",
        "title": "Bandhani Georgette Dupatta",
        "work_type": "Bandhani", "fabric_type": "Georgette",
        "colors": ["#DC143C", "#FFD700", "#1E90FF"], "color_names": ["Crimson", "Gold", "Royal Blue"],
        "base_score": 68, "region": "West India",
        "festival_tags": ["Navratri", "Garba", "Holi"],
        "why_trending": "Bandhani dupattas are being sold as standalone fashion accessories pairable with Western and ethnic outfits — growing cross-category demand.",
        "demand_insight": "₹200–₹600. Navratri triples demand. Georgette base for drape; silk for premium. Gift item potential strong — bundle 3 dupattas at festive price.",
        "who_should_sell": "Western India festive retailers, gift stores, and online sellers with Navratri seasonal inventory strategy.",
        "fabric_insight": "Georgette bandhani for drape; gajji silk for authentic feel. Dye fastness critical — buyers test by rubbing wet fabric on white cotton.",
        "source_name": "Meesho", "source_search_query": "bandhani georgette dupatta navratri",
        "unsplash_query": "bandhani dupatta colorful India textile",
    },
    {
        "id": "t054", "product_type": "Dupatta", "category": "Mirror Work",
        "title": "Chiffon Mirror Work Dupatta",
        "work_type": "Mirror Work", "fabric_type": "Chiffon",
        "colors": ["#1E90FF", "#FFD700", "#DC143C"], "color_names": ["Royal Blue", "Gold", "Red"],
        "base_score": 72, "region": "West India",
        "festival_tags": ["Navratri", "Garba", "Festive"],
        "why_trending": "Mirror work dupattas are increasingly sold as festive accessories to pair with plain kurtis — growing casual-festive cross-sell opportunity.",
        "demand_insight": "₹300–₹900. Navratri season doubles demand. Blue and red with gold mirror most popular. Often sold as kurti add-on — bundle opportunity.",
        "who_should_sell": "Festive wear stores, kurti retailers (bundle with mirror dupatta), and online sellers with festive accessory focus.",
        "fabric_insight": "Chiffon base gives flowing drape for mirror work dupatta. Georgette for stiffness; cotton for daily wear. Mirror size (5–12mm round) affects price.",
        "source_name": "Amazon India", "source_search_query": "mirror work chiffon dupatta festive",
        "unsplash_query": "mirror work dupatta Indian festive traditional",
    },
    {
        "id": "t055", "product_type": "Dupatta", "category": "Block Print",
        "title": "Block Print Cotton Dupatta",
        "work_type": "Block Print", "fabric_type": "Cotton",
        "colors": ["#003366", "#F5DEB3", "#8B6914"], "color_names": ["Navy", "Cream", "Khaki Gold"],
        "base_score": 65, "region": "North India",
        "festival_tags": ["Casual Wear", "Summer", "Festive"],
        "why_trending": "Block print dupattas growing as gifting items and fashion accessories — artisanal aesthetic at accessible price points resonating with urban buyers.",
        "demand_insight": "₹150–₹500. Summer and festive season. Jaipur and Bagru block prints most recognised. Bundle gift sets (3 dupattas) for ₹500–₹900 at gifting occasions.",
        "who_should_sell": "Craft and artisan stores, gift retailers, and online sellers with strong product photography.",
        "fabric_insight": "Cotton mulmul (50–60s count) for soft hand feel. Khadi cotton for structured look. Natural dye prints command 40% premium over chemical dyes.",
        "source_name": "Amazon India", "source_search_query": "block print cotton dupatta Jaipur",
        "unsplash_query": "block print dupatta Indian craft artisan",
    },
    {
        "id": "t056", "product_type": "Dupatta", "category": "Banarasi",
        "title": "Banarasi Silk Dupatta",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#8B0000", "#FFD700", "#4B0082"], "color_names": ["Deep Red", "Gold", "Purple"],
        "base_score": 76, "region": "All India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Banarasi dupattas selling strongly as premium add-ons to plain suits and lehengas — buyers investing in one heritage piece to elevate an otherwise affordable outfit.",
        "demand_insight": "₹800–₹5,000. Wedding and Diwali season peaks. Heritage weave + scarcity narrative allows premium pricing. Pair with plain lehenga for margin opportunity.",
        "who_should_sell": "Saree and suit stores adding premium dupatta section, bridal accessory retailers, and stores near wedding market hubs.",
        "fabric_insight": "Katan silk with woven-in zari is the benchmark. Georgette Banarasi dupatta for lighter feel. Meenakari (coloured thread) weave commands 25% premium.",
        "source_name": "Myntra", "source_search_query": "banarasi silk dupatta wedding",
        "unsplash_query": "banarasi silk dupatta India traditional wedding",
    },

    # ══════════════════════════════════════════════════════════════
    # UNSTITCHED / SEMI-STITCHED (6 items)
    # ══════════════════════════════════════════════════════════════
    {
        "id": "t057", "product_type": "Unstitched", "category": "Chanderi",
        "title": "Chanderi Unstitched Suit Material",
        "work_type": "Handwork", "fabric_type": "Chanderi",
        "colors": ["#F5F5DC", "#DEB887", "#C4A882"], "color_names": ["Ivory", "Burlywood", "Tan"],
        "base_score": 77, "region": "Central India",
        "festival_tags": ["Wedding", "Festive", "Summer"],
        "why_trending": "Chanderi unstitched material allows boutiques and tailors to offer custom sizing — growing among buyers who want precision fit at mid-market prices.",
        "demand_insight": "₹800–₹2,500 for 2.5m suit set. Boutique buyers prefer unstitched for tailoring margin. MP and Maharashtra dominant markets.",
        "who_should_sell": "Boutique fabric stores, unstitched suit retailers, and stores with in-house tailoring. Heritage branding improves price realisation.",
        "fabric_insight": "Chanderi silk-cotton (60:40) is standard. Pure silk Chanderi for premium at ₹500–₹1,200/metre. Chanderi cotton for affordability.",
        "source_name": "Amazon India", "source_search_query": "chanderi unstitched suit material",
        "unsplash_query": "chanderi fabric suit material India",
    },
    {
        "id": "t058", "product_type": "Unstitched", "category": "Lawn",
        "title": "Lawn Cotton Suit Material Set",
        "work_type": "Screen Print", "fabric_type": "Cotton Lawn",
        "colors": ["#FFFFFF", "#ADD8E6", "#FFB6C1"], "color_names": ["White", "Light Blue", "Blush"],
        "base_score": 73, "region": "All India",
        "festival_tags": ["Summer", "Casual Wear"],
        "why_trending": "Lawn suit material sets are the top summer unstitched purchase — softness and breathability driving strong demand from both retailers and end buyers.",
        "demand_insight": "₹350–₹1,200 for 3m set. Summer (Mar–June) peak. Combo set (top + bottom + dupatta fabric) bestseller format. Pakistani lawn brand name adds 15% premium.",
        "who_should_sell": "Fabric retailers, suit material stores, and tailoring shop-adjacent stores. Summer inventory focus.",
        "fabric_insight": "80s count cotton lawn for premium. 60s for standard. Printed vs embroidered — embroidered lawn commands 60% premium but slower movement.",
        "source_name": "Meesho", "source_search_query": "lawn cotton suit material summer",
        "unsplash_query": "cotton lawn suit material India summer fashion",
    },
    {
        "id": "t059", "product_type": "Semi-stitched", "category": "Brasso Velvet",
        "title": "Brasso Velvet Semi-Stitched Suit",
        "work_type": "Machine Work", "fabric_type": "Brasso Velvet",
        "colors": ["#800020", "#FFD700", "#1C1C1C"], "color_names": ["Wine", "Gold", "Charcoal"],
        "base_score": 78, "region": "North India",
        "festival_tags": ["Diwali", "Wedding", "Festive"],
        "why_trending": "Brasso velvet semi-stitched suits are the top Diwali festive purchase in North India — burnout pattern, rich texture, and shimmer without full-suit price.",
        "demand_insight": "₹1,200–₹3,500. Diwali and winter wedding season exclusive. Semi-stitched format reduces tailoring barrier for end buyer. Wine and black top sellers.",
        "who_should_sell": "Festive wear retailers in North India, Diwali season specialist stores, and online ethnic fashion sellers.",
        "fabric_insight": "Brasso velvet is burnout velvet — viscose-polyester blend where acid dissolves velvet pile in pattern areas. Weight 300–350 GSM. Pile direction affects colour depth.",
        "source_name": "Myntra", "source_search_query": "brasso velvet suit diwali festive",
        "unsplash_query": "velvet suit Indian festive Diwali fashion",
    },
    {
        "id": "t060", "product_type": "Semi-stitched", "category": "Net",
        "title": "Net Semi-Stitched Suit with Embroidery",
        "work_type": "Machine Embroidery", "fabric_type": "Net",
        "colors": ["#C0C0C0", "#FFD700", "#800020"], "color_names": ["Silver", "Gold", "Wine"],
        "base_score": 74, "region": "All India",
        "festival_tags": ["Wedding", "Festive", "New Year"],
        "why_trending": "Net semi-stitched suits are growing as a gifting category for weddings — heavy-look at mid price, and the semi-stitched format makes it universally sizable.",
        "demand_insight": "₹1,500–₹4,000. Wedding and Diwali season peaks. Silver and gold are the dominant colour choices for gifting. Pack in attractive box for wedding gift positioning.",
        "who_should_sell": "Wedding gift retailers, ethnic fashion stores with gifting section, and online sellers with wedding season strategy.",
        "fabric_insight": "Soft net base with machine embroidery overlay. Satin lining fabric included for undergarment. Thread quality in embroidery determines durability.",
        "source_name": "Meesho", "source_search_query": "net semi stitched suit embroidery",
        "unsplash_query": "net embroidered suit Indian wedding fashion",
    },
    {
        "id": "t061", "product_type": "Unstitched", "category": "Batik",
        "title": "Batik Print Unstitched Suit",
        "work_type": "Block Print", "fabric_type": "Cotton",
        "colors": ["#003366", "#F5DEB3", "#DC143C"], "color_names": ["Navy", "Cream", "Red"],
        "base_score": 65, "region": "East India",
        "festival_tags": ["Casual Wear", "Summer"],
        "why_trending": "Batik wax-resist prints are gaining national attention through sustainable fashion media. West Bengal and Odisha crafts finding buyers beyond home markets.",
        "demand_insight": "₹400–₹1,200. Summer peak. Natural indigo Batik at premium. Niche but growing. Direct online selling and craft exhibition model works better than wholesale.",
        "who_should_sell": "Craft and artisan retailers, sustainable fashion stores, and exhibition sellers. Narrative (artisan story, natural dye) critical for premium pricing.",
        "fabric_insight": "Cotton mulmul or handloom cotton for Batik wax resist — smooth surface required for wax penetration. Natural indigo vs chemical dye: UV test distinguishes.",
        "source_name": "Pinterest", "source_search_query": "batik unstitched suit India artisan",
        "unsplash_query": "batik print fabric India artisan craft",
    },
    {
        "id": "t062", "product_type": "Semi-stitched", "category": "Silk Lehenga",
        "title": "Silk Semi-Stitched Lehenga Set",
        "work_type": "Zari Work", "fabric_type": "Silk",
        "colors": ["#7B0A34", "#FFD700", "#FF8C00"], "color_names": ["Ruby", "Gold", "Orange"],
        "base_score": 80, "region": "All India",
        "festival_tags": ["Wedding", "Diwali", "Festive"],
        "why_trending": "Semi-stitched silk lehenga sets are a growing gifting format — pre-cut to size range, allowing the end buyer to tailor to exact fit without paying for a stitched garment.",
        "demand_insight": "₹2,500–₹6,000. Wedding season and Diwali peaks. Attractive box packaging crucial for gifting positioning. Bridal party gifting is the growing use case.",
        "who_should_sell": "Wedding gift retailers, bridal stores with trousseau gifting range, and online ethnic fashion stores with wedding season strategy.",
        "fabric_insight": "Silk dupion or art silk base for semi-stitched lehenga. Includes blouse fabric piece. Cancan (stiff underskirt fabric) determines skirt flare and volume.",
        "source_name": "Myntra", "source_search_query": "silk semi stitched lehenga set wedding",
        "unsplash_query": "silk lehenga India wedding gift traditional",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Scoring helpers
# ─────────────────────────────────────────────────────────────────────────────
def _festival_bonus(festival_tags: list[str], today: date) -> int:
    month = today.month
    next_month = (month % 12) + 1
    for tag in festival_tags:
        months = FESTIVAL_MONTHS.get(tag, [])
        if month in months:
            return 10
        if next_month in months:
            return 5
    return 0


def _compute_score(trend: dict, today: date) -> int:
    return min(100, trend["base_score"] + _festival_bonus(trend["festival_tags"], today))


def _matches_time(festival_tags: list[str], time_filter: str, today: date) -> bool:
    bonus = _festival_bonus(festival_tags, today)
    if time_filter == "all":
        return True
    if time_filter == "this_week":
        return bonus >= 10
    if time_filter == "this_month":
        return bonus >= 5
    if time_filter == "festival_season":
        return bonus > 0
    return True


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────
def get_trends(
    product_type: Optional[str] = None,
    work_type:    Optional[str] = None,
    fabric_type:  Optional[str] = None,
    region:       Optional[str] = None,
    time_filter:  str = "all",
    is_fabric:    bool = False,
    limit:        int = 50,
    offset:       int = 0,
    with_images:  bool = True,
) -> tuple[list[dict], int]:
    """
    Returns (trend_list, total_count).
    Fetches Unsplash images if configured.
    """
    today = date.today()
    results: list[dict] = []

    for t in TRENDS_DATASET:
        if is_fabric and t["product_type"] != "Fabric-Thaan":
            continue
        if product_type and product_type.lower() not in t["product_type"].lower():
            continue
        if work_type and work_type.lower() not in t["work_type"].lower():
            continue
        if fabric_type and fabric_type.lower() not in t["fabric_type"].lower():
            continue
        if region and region not in ("All India",) and "All India" not in t.get("region", ""):
            if region.lower() not in t.get("region", "").lower():
                continue
        if not _matches_time(t["festival_tags"], time_filter, today):
            continue

        score = _compute_score(t, today)
        entry = {
            **{k: v for k, v in t.items() if k != "unsplash_query"},
            "trend_score": score,
            "image_url": "",
            "source_url": build_source_url(t["source_name"], t["source_search_query"]),
        }

        if with_images:
            entry["image_url"] = fetch_image_url(t["unsplash_query"])

        results.append(entry)

    results.sort(key=lambda x: x["trend_score"], reverse=True)
    total = len(results)
    return results[offset: offset + limit], total


def get_trend_by_id(trend_id: str, with_image: bool = True) -> Optional[dict]:
    today = date.today()
    for t in TRENDS_DATASET:
        if t["id"] == trend_id:
            entry = {
                **{k: v for k, v in t.items() if k != "unsplash_query"},
                "trend_score": _compute_score(t, today),
                "image_url": fetch_image_url(t["unsplash_query"]) if with_image else "",
                "source_url": build_source_url(t["source_name"], t["source_search_query"]),
            }
            return entry
    return None


def get_catalog_matches(trend: dict, designs: list[dict]) -> list[dict]:
    """Match trend against user's design catalog by text similarity."""
    trend_cat  = (trend.get("product_type") or trend.get("category") or "").lower()
    trend_work = (trend.get("work_type") or "").lower()
    trend_fabric = (trend.get("fabric_type") or "").lower()
    trend_colors = [c.lower() for c in (trend.get("color_names") or [])]

    matches = []
    for d in designs:
        score = 0
        d_cat   = (d.get("category") or "").lower()
        d_work  = (d.get("work_type") or "").lower()
        d_fabric= (d.get("fabric") or "").lower()
        d_color = (d.get("color") or "").lower()

        if trend_cat  and any(w in d_cat  for w in trend_cat.split()):  score += 35
        if trend_work and any(w in d_work for w in trend_work.split()): score += 30
        if trend_fabric and any(w in d_fabric for w in trend_fabric.split()): score += 20
        if any(tc in d_color for tc in trend_colors): score += 15

        if score > 0:
            matches.append({**d, "match_score": score})

    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches[:10]
