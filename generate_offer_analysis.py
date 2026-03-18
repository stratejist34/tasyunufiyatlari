import re
import json
import os
from collections import Counter

def parse_offers(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return []

    # Dosyayı bloklara ayır
    raw_blocks = content.split('================================================================================')
    
    offers = []
    
    # Türkiye İl Listesi (Regex ile yakalamak için)
    cities = [
        "Adana", "Adıyaman", "Afyon", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", 
        "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", 
        "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", 
        "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", 
        "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", 
        "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", 
        "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", 
        "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak", "İzmit", "Adapazarı", "Gebze", "Çorlu", "Lüleburgaz", "Bodrum", "Fethiye", "Marmaris"
    ]
    
    for block in raw_blocks:
        if 'DOSYA:' not in block:
            continue
            
        lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
        if not lines:
            continue
            
        header = lines[0].replace('DOSYA:', '').strip()
        
        # --- Veri Çıkarımı ---
        
        # 1. Metraj (m2)
        m2 = 0
        m2_match = re.search(r'(\d+([.,]\d+)?)\s*m2', header, re.IGNORECASE)
        if m2_match:
            m2_str = m2_match.group(1).replace('.', '').replace(',', '.') # Binlik ayracı nokta ise kaldır, ondalık virgül ise nokta yap
            # Basit düzeltme: eğer nokta varsa ve 3 haneden azsa ondalıktır, değilse binliktir gibi karmaşık durumlar olabilir
            # Ancak buradaki format genelde 1.000 veya 1000 şeklinde.
            # Güvenli dönüşüm:
            try:
                if ',' in m2_match.group(1):
                     m2 = float(m2_match.group(1).replace('.', '').replace(',', '.'))
                else:
                     # Sadece nokta varsa ve 3 basamaktan fazlaysa binliktir (örn 1.500), değilse ondalık olabilir ama m2 genelde tam sayı
                     raw_num = m2_match.group(1)
                     if '.' in raw_num and len(raw_num.split('.')[1]) == 3:
                         m2 = float(raw_num.replace('.', ''))
                     else:
                         m2 = float(raw_num)
            except:
                m2 = 0

        # 2. Şehir
        detected_city = "Belirsiz"
        for city in cities:
            if city.lower() in header.lower():
                detected_city = city
                # Bazı özel düzeltmeler
                if detected_city == "İzmit" or detected_city == "Gebze": detected_city = "Kocaeli"
                if detected_city == "Adapazarı": detected_city = "Sakarya"
                if detected_city == "Çorlu": detected_city = "Tekirdağ"
                if detected_city == "Bodrum" or detected_city == "Fethiye": detected_city = "Muğla"
                if detected_city == "Afyon": detected_city = "Afyonkarahisar"
                break
        
        # 3. Marka / Sistem (Header ve içerikten tahmin)
        system_type = "Diğer"
        header_lower = header.lower()
        if "dalmaçyalı" in header_lower:
            system_type = "Dalmaçyalı"
        elif "fawori" in header_lower:
            system_type = "Fawori"
        elif "tekno" in header_lower:
            system_type = "Tekno"
        elif "expert" in header_lower:
            system_type = "Fawori Expert"
        elif "optimix" in header_lower:
            system_type = "Fawori Optimix"
            
        # 4. Levha Türü (EPS vs Taşyünü)
        plate_type = "Belirsiz"
        if "taşyünü" in header_lower or "tasyunu" in header_lower or "sw" in header_lower:
            plate_type = "Taşyünü"
        elif "eps" in header_lower or "karbonlu" in header_lower or "carbon" in header_lower:
            plate_type = "EPS"
            
        # İçerik analizi (Header'da yoksa içerikten bul)
        items = []
        for line in lines[1:]:
            # Sadece numaralı satırları al (ürünler)
            if re.match(r'^\d+\.', line):
                items.append(line)
                line_lower = line.lower()
                
                # Levha türünü içerikten teyit et
                if plate_type == "Belirsiz":
                    if "taşyünü" in line_lower: plate_type = "Taşyünü"
                    elif "eps" in line_lower or "levha" in line_lower: plate_type = "EPS"
                
                # Markayı içerikten teyit et
                if system_type == "Diğer":
                    if "dalmaçyalı" in line_lower: system_type = "Dalmaçyalı"
                    elif "fawori" in line_lower: system_type = "Fawori"
                    elif "tekno" in line_lower: system_type = "Tekno"

        offers.append({
            "header": header,
            "city": detected_city,
            "m2": m2,
            "system": system_type,
            "plate_type": plate_type,
            "items_count": len(items)
        })

    return offers

def generate_html_report(offers):
    # --- İstatistikler ---
    total_offers = len(offers)
    total_m2 = sum(o['m2'] for o in offers)
    
    # Şehir Dağılımı
    city_counts = Counter(o['city'] for o in offers)
    # Belirsizleri sona at veya filtrele
    
    # Marka Dağılımı
    brand_counts = Counter(o['system'] for o in offers)
    
    # Levha Türü Dağılımı
    plate_counts = Counter(o['plate_type'] for o in offers)
    
    # Metraj Aralıkları
    m2_ranges = {
        "0-250 m2": 0,
        "250-500 m2": 0,
        "500-1000 m2": 0,
        "1000+ m2": 0
    }
    for o in offers:
        if o['m2'] <= 250: m2_ranges["0-250 m2"] += 1
        elif o['m2'] <= 500: m2_ranges["250-500 m2"] += 1
        elif o['m2'] <= 1000: m2_ranges["500-1000 m2"] += 1
        else: m2_ranges["1000+ m2"] += 1

    html_content = f"""
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teklif Analiz Raporu</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }}
        .container {{ max-width: 1200px; margin: 0 auto; }}
        .header {{ background-color: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .card {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }}
        h1, h2 {{ margin-top: 0; }}
        .stat-box {{ text-align: center; padding: 10px; background: #ecf0f1; border-radius: 5px; }}
        .stat-number {{ font-size: 2em; font-weight: bold; color: #2980b9; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
        th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
        th {{ background-color: #f8f9fa; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Teklif Analiz Raporu</h1>
            <p>Toplam {total_offers} adet teklif dosyası analiz edildi.</p>
        </div>

        <div class="grid">
            <div class="card">
                <div class="stat-box">
                    <div class="stat-number">{total_offers}</div>
                    <div>Toplam Teklif</div>
                </div>
            </div>
            <div class="card">
                <div class="stat-box">
                    <div class="stat-number">{total_m2:,.0f} m²</div>
                    <div>Toplam Metraj</div>
                </div>
            </div>
            <div class="card">
                <div class="stat-box">
                    <div class="stat-number">{len(city_counts)}</div>
                    <div>Farklı Şehir</div>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Marka / Sistem Dağılımı</h2>
                <canvas id="brandChart"></canvas>
            </div>
            <div class="card">
                <h2>Levha Türü Tercihi</h2>
                <canvas id="plateChart"></canvas>
            </div>
        </div>

        <div class="card">
            <h2>Şehir Bazlı Dağılım (İlk 15)</h2>
            <canvas id="cityChart"></canvas>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Metraj Aralıkları</h2>
                <canvas id="rangeChart"></canvas>
            </div>
            <div class="card">
                <h2>Detaylı Şehir Listesi</h2>
                <div style="max-height: 300px; overflow-y: auto;">
                    <table>
                        <thead><tr><th>Şehir</th><th>Teklif Sayısı</th></tr></thead>
                        <tbody>
                            {''.join(f'<tr><td>{k}</td><td>{v}</td></tr>' for k, v in city_counts.most_common())}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>Analiz Sonuçları ve Yorumlar</h2>
            <ul>
                <li><strong>Bölgesel Yoğunluk:</strong> Tekliflerin büyük çoğunluğu <strong>{city_counts.most_common(1)[0][0]}</strong> ve çevresinden gelmektedir.</li>
                <li><strong>Ürün Tercihi:</strong> Müşterilerin %{round(plate_counts.get('Taşyünü', 0)/total_offers*100)}'si Taşyünü sistemleri tercih ederken, %{round(plate_counts.get('EPS', 0)/total_offers*100)}'si EPS/Karbonlu sistemleri tercih etmiştir.</li>
                <li><strong>Marka Hakimiyeti:</strong> <strong>{brand_counts.most_common(1)[0][0]}</strong> markası tekliflerde en sık rastlanan sistemdir.</li>
                <li><strong>Proje Büyüklükleri:</strong> Tekliflerin çoğu {max(m2_ranges, key=m2_ranges.get)} aralığındadır, bu da projenin daha çok konut/apartman ölçeğinde yoğunlaştığını gösterir.</li>
            </ul>
        </div>
    </div>

    <script>
        // Marka Grafiği
        new Chart(document.getElementById('brandChart'), {{
            type: 'doughnut',
            data: {{
                labels: {json.dumps(list(brand_counts.keys()))},
                datasets: [{{
                    data: {json.dumps(list(brand_counts.values()))},
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#95a5a6']
                }}]
            }}
        }});

        // Levha Grafiği
        new Chart(document.getElementById('plateChart'), {{
            type: 'pie',
            data: {{
                labels: {json.dumps(list(plate_counts.keys()))},
                datasets: [{{
                    data: {json.dumps(list(plate_counts.values()))},
                    backgroundColor: ['#e67e22', '#34495e', '#bdc3c7']
                }}]
            }}
        }});

        // Şehir Grafiği
        const cityData = {json.dumps(city_counts.most_common(15))};
        new Chart(document.getElementById('cityChart'), {{
            type: 'bar',
            data: {{
                labels: cityData.map(x => x[0]),
                datasets: [{{
                    label: 'Teklif Sayısı',
                    data: cityData.map(x => x[1]),
                    backgroundColor: '#1abc9c'
                }}]
            }},
            options: {{
                scales: {{ y: {{ beginAtZero: true }} }}
            }}
        }});

        // Metraj Grafiği
        new Chart(document.getElementById('rangeChart'), {{
            type: 'bar',
            data: {{
                labels: {json.dumps(list(m2_ranges.keys()))},
                datasets: [{{
                    label: 'Proje Sayısı',
                    data: {json.dumps(list(m2_ranges.values()))},
                    backgroundColor: '#8e44ad'
                }}]
            }}
        }});
    </script>
</body>
</html>
    """
    
    with open('teklif_analiz_raporu_v2.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Rapor oluşturuldu: teklif_analiz_raporu_v2.html")

if __name__ == "__main__":
    offers = parse_offers('teklif_analiz_sonuc.txt')
    generate_html_report(offers)