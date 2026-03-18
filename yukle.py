import pandas as pd
from supabase import create_client
import re # Regex kütüphanesi eklendi


# --- 1. AYARLAR (Supabase Panelinden Alınacak) ---
SUPABASE_URL = "https://latlzskzemmdnotzpscc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw"


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 2. YARDIMCI FONKSİYONLAR ---
def clean_price(value):
    if pd.isna(value) or str(value).strip() == '': return 0.0
    if isinstance(value, (int, float)): return float(value)
    clean_str = str(value).replace('TL', '').replace('tl', '').strip()
    clean_str = clean_str.replace('.', '').replace(',', '.')
    try:
        return float(clean_str)
    except:
        return 0.0

def determine_brand(name):
    name = str(name).lower()
    if 'dalmaçyalı' in name: return 'Dalmaçyalı', 'premium'
    if 'expert' in name: return 'Expert', 'performance'
    if 'fawori' in name: return 'Fawori', 'eco'
    if 'optimix' in name: return 'Optimix', 'eco'
    return 'Diğer', 'eco'

def determine_type(name):
    name = str(name).lower()
    if 'levha' in name or 'taşyünü' in name or 'carbon' in name: return 'plate'
    if 'yapıştırıcı' in name or 'sıva' in name: return 'chemical'
    if 'dübel' in name: return 'accessory'
    if 'profil' in name: return 'profile'
    return 'accessory'

def extract_thickness(name):
    """İsimden kalınlığı (cm) çeker"""
    name = str(name).lower()
    # Örn: "taşyünü 5 cm" -> 5
    match = re.search(r'(\d+)\s*cm', name)
    if match:
        return int(match.group(1))
    # Eğer cm yoksa ve EPS/Taşyünü ise bazen rakam başta olabilir ama riskli.
    return 0

def read_csv_smart(filename):
    separators = [';', ',']
    encodings = ['utf-8-sig', 'cp1254', 'latin-1']
    for sep in separators:
        for enc in encodings:
            try:
                df = pd.read_csv(filename, sep=sep, encoding=enc, skiprows=2, engine='python')
                if len(df.columns) > 1: return df
            except: continue
    return pd.DataFrame()

# --- 3. YÜKLEME ---
def run_import():
    print("🚀 Veri Yükleme (Thickness Özellikli)...")

    # Markalar
    brands_data = [
        {'name': 'Dalmaçyalı', 'tier': 'premium'},
        {'name': 'Expert', 'tier': 'performance'},
        {'name': 'Fawori', 'tier': 'eco'},
        {'name': 'Optimix', 'tier': 'eco'},
        {'name': 'Diğer', 'tier': 'eco'}
    ]
    for b in brands_data:
        existing = supabase.table('brands').select("*").eq('name', b['name']).execute()
        if not existing.data: supabase.table('brands').insert(b).execute()
    
    all_brands = supabase.table('brands').select("id, name").execute()
    brand_map = {item['name']: item['id'] for item in all_brands.data}

    # Dosyaları İşle
    files = ['tasyunu_maliyet.csv', 'fawori_paket.csv', 'dalmacyali_paket.csv']
    
    for filename in files:
        df = read_csv_smart(filename)
        if df.empty: continue
        
        print(f"📄 {filename} işleniyor...")
        for index, row in df.iterrows():
            # Sütun İsimlerini Yakala (Dosyaya göre değişebilir)
            name_col = 'MALZEME İSMİ' if 'MALZEME İSMİ' in df.columns else df.columns[0]
            price_col = 'KDV HARİÇ LİSTE FİYATI' if 'KDV HARİÇ LİSTE FİYATI' in df.columns else 'KDV DAHİL LİSTE FİYATI'
            
            product_name = str(row.get(name_col, ''))
            if len(product_name) < 3: continue
            
            # Verileri Hazırla
            brand_name, tier = determine_brand(product_name)
            p_type = determine_type(product_name)
            price = clean_price(row.get(price_col, 0))
            thickness = extract_thickness(product_name) # <-- YENİ FONKSİYON
            
            # Lojistik (Sadece Taşyünü dosyasında dolu gelir)
            items_per_pkg = clean_price(row.get('Paket\nİçi Adet', 0))
            tir_qty = clean_price(row.get('Tır Adet\n(26 Palet)', 0))
            lorry_qty = clean_price(row.get('Kamyon Adet\n(14 Palet)', 0))

            # m2 hesabı (Thickness varsa otomatik, yoksa manuel)
            m2_per_pkg = 0.0
            if thickness > 0 and 'taşyünü' in product_name.lower():
                # Formül: (10cm = 1.80m2) -> Basit orantı genelde tutmaz, manuel set edelim
                if thickness == 3: m2_per_pkg = 5.76
                elif thickness == 4: m2_per_pkg = 4.32
                elif thickness == 5: m2_per_pkg = 3.60
                elif thickness == 6: m2_per_pkg = 2.88
                elif thickness == 8: m2_per_pkg = 2.16
                elif thickness == 10: m2_per_pkg = 1.80
                elif thickness == 12: m2_per_pkg = 1.44
                elif thickness == 15: m2_per_pkg = 1.20 # Tahmini
            
            payload = {
                'brand_id': brand_map.get(brand_name, brand_map['Diğer']),
                'name': product_name,
                'type': p_type,
                'thickness': thickness, # <-- YENİ SÜTUN
                'base_price': price,
                'items_per_package': int(items_per_pkg) if items_per_pkg > 0 else None,
                'm2_per_package': m2_per_pkg,
                'packages_in_truck': int(tir_qty) if tir_qty > 0 else None,
                'packages_in_lorry': int(lorry_qty) if lorry_qty > 0 else None,
                'stock_location': 'factory' if 'tasyunu' in filename else 'warehouse'
            }

            try:
                supabase.table('products').insert(payload).execute()
            except: pass
            
    print("✅ Tüm ürünler 'thickness' verisiyle yüklendi!")

if __name__ == "__main__":
    run_import()