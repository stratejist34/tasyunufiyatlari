TaşYünü Fiyatları – Pre-Launch Audit
10 ekrandaki akışı bütün olarak gezdim. Genel mimari sağlam ve B2B inşaat sektörü için bilinçli kurulmuş — 4 adım, lojistik mantığı, paket karşılaştırma, PDF teklif. Ama canlıya çıkmadan önce 3 tane gerçek "blocker", 8-10 tane ciddi tutarlılık problemi ve bir dizi conversion kaybı var. Aşağıda doğrudan, önceliklendirilmiş şekilde:

🔴 BLOCKER – Canlıya çıkmadan ÖNCE çöz
1. Fiyat geçerlilik süresinde 4 kat tutarsızlık

Web (Adım 5 paket kartı): "Bu teklif 2 Mayıs 2026 tarihine kadar geçerlidir" → 4 gün
PDF (Image 10): "Sektörel dalgalanmalar nedeniyle bu teklif 24 Saat (1 İş Günü) geçerlidir" → 1 gün

Müşteri PDF indirdikten sonra 2 Mayıs sandığı teklif ile gelir, sen "süresi geçti, 24 saatti" diye reddetmek zorunda kalırsın. Hem güven kaybı, hem ÖZERGRUP'a kötü duruş. İkisi de aynı kuralı söylemeli — büyük olasılıkla 24 saat/1 iş günü doğru olan, web mesajını ona çek.
2. KDV dahil/hariç çelişkisi

Adım 1-4 footerinde: "Fiyatlar KDV hariç, nakliye dahildir."
Adım 5 paket kartında büyük rakam (771.088 ₺) KDV dahil (matematik tutuyor: 642.573 + 128.515 = 771.088)
Yani 4 ekran boyunca "KDV hariç görüyorsun" diyorsun, sonra paketlerde sessizce KDV dahil rakamı büyük puntoyla gösteriyorsun.

Bu B2B'de güven sorunu yaratır. Yapı şirketi muhasebesi büyük rakamla bütçe tutar, sonra "ya bu KDV dahildi" der. Çözüm: Adım 1-4 disclaimerini "Hesaplama KDV + nakliye dahil yapılır. Paket sayfasında KDV hariç tutar da gösterilir." şeklinde düzelt. Veya paket kartında KDV hariç rakamı büyük göster, KDV dahili altına yaz — çünkü B2B müşterinin asıl baktığı KDV hariç tutardır (KDV indirebilir).
3. PDF dosya adı bozuk başlangıç
Image 9'da indirilen dosya adı:
-Insaat-Yapi-Ltd-Sti_Istanbul-Gedelli_1200m2_5cm-Dalmacyali-SW035-Tasyunu_TEKLIFI.pdf
Başında tire (-) var, firma adı kesilmiş. "Ferses İnşaat Yapı Ltd Şti." → muhtemelen slugify fonksiyonu Türkçe karakter (İ) gördüğünde kelimeyi atıp kalanını alıyor. "Ferses" kayıp.
Aynı klasördeki eski dosyalar Ferses-Insaat-Yapi-Ltd-Sti... ile başlıyor — yani bug yeni. Muhtemelen son commit'te slugify mantığı bozuldu.
Müşteriye e-mailde gönderilen PDF dosyasının adı -Insaat-Yapi... ile başlıyorsa profesyonel görünmez. Hızlı düzelt: önce Türkçe karakter map → ASCII (İ→I, Ş→S, vs.) sonra slug.
4. "Kamyon Dolusu" hesabı fiziksel olarak imkansız bir durumu seçili gösteriyor
Image 4: 1.202,4 m² sipariş, Kamyon kapasitesi 806 m². Sen 396 m² kapasitenin üzerindesin ama hâlâ "Kamyon Dolusu %14" seçili gözüküyor.
Mantık şu olmalı:

Eğer m² ≤ 806 → Kamyon Dolusu önerilir
Eğer 806 < m² < 1498 → "Kamyon kapasitesi aşıldı, TIR'a tamamlamanı öneririz" + TIR Dolusu otomatik seçili olmalı
Eğer m² ≥ 1498 → TIR Dolusu

Şu an default seçim "Kamyon Dolusu" ama fiziksel olarak iki kamyon mu gönderiyorsunuz? Yoksa bu sadece bir indirim tier'ı mı? Eğer indirim tier'ıysa "Kamyon Dolusu" yerine "Standart İndirim %14" gibi adlandır — yoksa müşteri "tek kamyonla mı geliyor sahaya?" diye soracak ve şoför 2 kamyonla geldiğinde sorun çıkar. İsimlendirme realiteyi yansıtmalı.

🟠 CİDDİ – Tutarsızlık ve UX hataları
Adım 1 – Malzeme
5. "Bölgeye Göre İskonto" üst barda turuncu, ama tıklanmıyor. Promosyon bilgisi gibi görünen bir element ama hiçbir aksiyon almıyor. Ya tıklanabilir tooltip yap ("Bölgeye Göre İskonto → İstanbul %18, Ankara %14..."), ya pasif metin renginde (gri/beyaz) yap. Şu an "interaktif sandım, değildi" hayal kırıklığı yaratıyor.
6. Marka logoları (Dalmaçyalı / Expert / Optimix) küçük ve pikselli görünüyor. B2B müşteri brand güvenle hareket eder. Bu logoların SVG versiyonunu al, en az 96×96px alanda göster, uppercase brand adı yerine logo + isim altta dene. Şu hâli "ucuz e-ticaret sitesi" hissi veriyor — TaşYünü Fiyatları'nın premium konumlandırmasıyla çelişiyor.
7. EPS seçeneği var ama akışta nereye gidiyor? EPS seçilirse Dalmaçyalı/Expert/Optimix yerine başka markalar mı çıkacak? Akış test edilmeli — ya da MVP'de EPS'yi gri/disable yap, "Yakında" badge'i koy. Yarım çalışan özellik canlıda en büyük güven kaybı.

Adım 2 – Kalınlık
8. Yeşil "Popüler" badge ile yeşil ✓ tamamlandı işareti aynı renk. Görsel olarak "10cm tamamlandı mı?" sorusu doğuyor. Popüler için farklı bir aksan rengi kullan (ör: warm brass / amber). Yeşil sadece "completed step" için ayrılsın.
9. "Dış cephe mantolama için genellikle 8-10 cm önerilir" diyorsun ama default 5cm seçili. Tutarsız. Eğer 10cm popüler ve önerilen ise default 10cm olmalı. Şu an kullanıcı "ucuza geleyim" diye 5cm'i geçiyor, sonra mühendis "TS 825 minimumu tutmuyor" diye geri dönüyor. Ek fikir: İklim bölgesine göre öneri çıkar (İstanbul = 3. bölge, min 6cm; Erzurum = 5. bölge, min 10cm). Bu hem değer katar hem yetkinlik gösterir.
10. Kalınlık seçimine fiyat etkisi preview'i yok. "5cm seçtim, 10cm seçsem ne olur?" sorusunun cevabı yok. Her chip'in altında küçük gri yazıyla "yaklaşık +%X" göstersen müşteri kalınlık kararını bilinçli verir, sonra paket sayfasında "biraz daha kalınına çıkayım" demez.

Adım 3 – Konum
11. Sayfanın yarısı boş. Sadece bir dropdown ve devasa boş alan. Bu boş alan trust signal alanı olabilir:

"İstanbul → Tuzla deposundan teslimat (en yakın)"
"Bu il için %18 bölge iskontosu uygulanacak"
Türkiye haritası mini render — kullanıcı görsel teyit
"Son 30 günde 47 firma İstanbul'a teklif aldı"

Şu hâli müşteriye "form bitti mi?" hissi veriyor.
12. İlçe burada toplanmıyor ama PDF formunda zorunlu (Image 6). Madem ilçe gerekli, neden Adım 3'te al? Hem akışı tutarlı hale getirir, hem ilçeye göre nakliye fine-tune yapabilir (Şile uzak, Beyoğlu yakın).

Adım 4 – Metraj
13. Yukarıda da bahsettiğim Kamyon hesabının yanlış default'u — Blocker #4. Ek olarak: "Kamyon" çubuğu görsel olarak overflow gösteriyor (1202/806). Bu UX'te "kapasiteyi aştın" sinyali olmalı, ama orange selected çipi tam tersi diyor. Düzelt.
14. "TIR'a 295.2 m² kaldı" mesajı altın değerinde ama yeterince kaldıraçlı değil. Bunu güçlendir:

Bu ekstra m² için toplam fark TL cinsinden göster: "Sadece +295 m² ekleyin → toplam X TL daha az ödersiniz"
"TIR'a Tamamla" hızlı butonu koy: tıklayınca m² 1498'e atlar
Hesabı transparan yap: "1498 m² × 548 ₺ = 821k vs 1202 m² × 641 ₺ = 771k. Fark: ekstra m² ama m² başına 93 ₺ az." Net iş zekası mesajı.

15. m² input validation görünmüyor. Ne minimum ne maksimum sınır. 5 m² girersen ne olur? 50.000 m²? Edge case'ler mutlaka handle edilmeli — değilse müşteri "10000 m² beni 5 milyon TL'ye nasıl getirdin" diye fotoğraflayıp paylaşır.
16. Para emoji (💰) FİYATLARI GÖSTER butonunda ucuz duruyor. B2B müşteri profesyonel ortamda karar veriyor. Emoji yerine ya çıplak text ya da sade ikon (chart/document). Aynı yorum 🚛 🚚 emojileri için de geçerli — sektörde kullanılan görsel diliyle uyumsuz. Inline SVG ile sade kamyon/tır ikonu kullan.

Adım 5 – Paket Karşılaştırma
17. Üç paket arasındaki 257.747 ₺ farkın gerekçesi yetersiz açıklanmış. Kullanıcı görüyor:



Kalite: 916.920 ₺ — Dalmaçyalı SW035 + Dalmaçyalı toz


Dengeli: 771.088 ₺ — Dalmaçyalı SW035 + Optimix toz
Ekonomik: 659.173 ₺ — Dalmaçyalı SW035 + TEKNO toz

Levha aynı. Sadece kimyasal grup değişiyor. Tecrübeli usta dışında kimsenin kafasında "Optimix → Dalmaçyalı geçince neden 145k daha pahalı oluyor" sorusu cevapsız kalır. Her pakete 1-2 satır mikro açıklama ekle:

Premium: "Tek tedarikçili sistem garantisi, fabrika sertifikalı"
Dengeli: "Levhada Dalmaçyalı kalitesi, sahada test edilmiş kimyasallar"
Ekonomik: "Bütçe optimizasyonu, kontrollü fire performansı"

18. m² başı fiyat gösteriliyor ama karşılaştırma tablosu eksik. "Premium 762,58 ₺/m² vs Dengeli 641,29 ₺/m² → m² başına 121 ₺ fark" gibi delta'yı vermek anchor effect'i güçlendirir. Şu an üç sayı ayrı ayrı, beyin doğrudan kıyaslamıyor.
19. "En Popüler" Dengeli paket görsel olarak öne çıkmıyor. Aynı genişlik, aynı yükseklik, sadece chip farklı. Decoy/anchor effect için Dengeli kartı:

Hafif daha geniş (4-6%)
İnce brass border veya glow
"Önerilen" rozeti küçük altın detay
Hafif yukarı kayık (translateY -8px)

Şu an klasik "üç eşit kart" — kullanıcı en ucuza kayar (Ekonomik). Sen ortada satışı maksimize etmek istiyorsun.
20. Garanti farklılaşması yok. Hepsi "2 Yıl Garanti". Bu yanlış — Premium müşteri "ben fazladan 257k veriyorum, ne fazladan alıyorum?" der. Premium 5 yıl, Dengeli 2 yıl, Ekonomik 1 yıl gibi gerçek farklılaştırma kur. Veya garanti dışı katkı ekle (montaj danışmanlığı, sahada teknik destek).
21. Sevkiyat süresi belirsiz. "⚡ Standart Sevkiyat" çipi var ama ne demek? 3 gün? 7 gün? 14 gün? Net süre yaz: "Sipariş onayından sonra 5 iş günü içinde teslimat." Belirsizlik B2B'de en büyük conversion kıran şey.
22. Paket listesindeki "+3 ürün daha göster" tıklayınca kart yüksekliği değişiyor → diğer 2 kartla hizalama bozuluyor. Her zaman 8 ürün de açık göster, ya da expanded state'te diğer iki kartı da senkron expand et. Şu an UX kırılma noktası.
23. "1200 m² için Paket Seçenekleri" — kullanıcı 1200 girdi ama sipariş 1202.4. Başlık rakamı sipariş gerçeğiyle eşleşmiyor. "1.202,4 m² için Paket Seçenekleri" yaz veya "(334 paket × 3,6 m²)" küçük yazıyla altta tekrarla.

PDF Form Modal (Image 6-8)
24. "Açık Adres" zorunlu (*) işaretli. PDF indirmek için tam adres istemek yüksek friction. Düşürebileceğin abandonment %15-25 arası olabilir. Sadece Firma + İlgili Kişi + Telefon + İl/İlçe zorunlu olsun. Adres opsiyonel — eğer doldurursa PDF'de görünür, doldurmazsa "Adres müşteri tarafından sözlü iletilecektir" notu çıkar.
25. KVKK onay kutusu yok. Telefon + isim + e-posta topluyorsun, KVKK m.5 gereği açık rıza şart. Canlıya çıkmadan önce mutlaka:

"Kişisel verilerimin teklif oluşturma amacıyla işlenmesini kabul ediyorum" checkbox
KVKK aydınlatma metni linki (yeni sekmede açılan)
Bu olmadan Veri Koruma Kurulu cezası riski real

26. Form çift kolonlu yapılmış (İlçe | İl) ama mobile'da nasıl davranıyor görmedim. Mobil test edilmeli — büyük ihtimal müşterilerin %60-70'i mobilden gelecek (sahada şantiye şefi).
27. "Hazırlanıyor..." butonunda spinner yok. Sadece text değişimi. Tıkladıktan sonra 2-3 saniye boş ekran → user "tıklamadım mı?" tekrar tıklar → çift PDF generate riski. Inline spinner ekle (sade SVG, butona göre renk).
28. Telefon format validasyonu yok. "0533 654 8166" / "+905336548166" / "5336548166" hepsi farklı format. Submit anında client-side normalize et.

PDF Çıktısı (Image 10)
29. "Dalmaçyalı SW035 SW035 Taşyünü" — duplicate "SW035". Bug. Template'te muhtemelen {model.name} {model.code} çift kez bağlı. Test et, düzelt.
30. PDF'de banka bilgileri açık duruyor. Kuveyttürk + Vakıfbank IBAN ile beraber. Bu PDF müşteri WhatsApp gruplarına forward edilirse, IBAN'ınız internette gezer. B2B teklif PDF'inde IBAN gerekmez — sipariş onayından sonra ayrı belgeye çıkar. Şu hâliyle hem güvenlik riski hem profesyonel olmayan görüntü.
31. Footer logoları (Full Bayi, TEKNO, Bestkim, Dalmaçyalı, Onat, DALSAN, Favori) — bu teklifte sadece Dalmaçyalı + Optimix var. Diğer logolar bayilik/marka portföyü mü? Eğer öyleyse footer üstüne küçük başlık koy: "Yetkili Bayilik Portföyü" — yoksa kullanıcı "ben Optimix sipariş ettim, niye TEKNO logosu var?" diye sorar.
32. "Sipariş onayı ile birlikte ödeme talep edilir" muğlak. Peşin mi? Vadeli mi? %50 kapora? Net ödeme koşulu yaz: "Sipariş onayında %50 kapora, kalan %50 sevkiyat öncesi" (veya gerçek koşul ne ise). Belirsiz ödeme = kapanmayan satış.
33. Quote/Teklif numarası yok. Sadece tarih+saat. Müşteri 3 gün sonra arar "geçen aldığım teklif" der, sen 80 farklı teklif arasında nasıl bulacaksın? Unique quote number ekle: TY-2026-04-29-8529510 formatında. Filename'de zaten var (TY8529510_teklif.pdf) — belgeye de yansıt.
34. "İmza ve Kaşe (opsiyonel)" — B2B onaylı sipariş için opsiyonel olmaması gerek. Bu PDF "teklif" mi, "sipariş onay belgesi" mi? Net ayır:

Fiyat Teklifi PDF → imza opsiyonel, "müşteri görüş" amaçlı
Sipariş Onay PDF (WhatsApp'tan onaydan sonra otomatik) → imza zorunlu


🟡 Tasarım & Görsel Hierarchy
35. Tüm flow boyunca turuncu CTA + turuncu chip + turuncu vurgu kelime + turuncu progress dot + turuncu "Bölgeye Göre İskonto" + turuncu "Lojistik Dahil" + turuncu paket başlıkları. Turuncu her yerde = hiçbir yerde değil. Hierarchy yıkılıyor. Net kural koy:

Brass/Orange sadece primary CTA + active state
Vurgu kelimeleri için lighter accent (ör. amber tint)
Info chip'leri muted ton (antrasit + ince border)
Sadece "İleri →" ve "FİYATLARI GÖSTER" butonları full saturated turuncu olsun

36. Sol panel "Mantolama Maliyetini Lojistik Dahil Hesaplayın" + "Paketlere Dahil" listesi 4 adımda da aynı kalıyor. Bu alan dinamik olabilirdi:

Adım 2'de: "Neden 8-10 cm öneriyoruz?" mini eğitim kartı
Adım 3'te: Türkiye depo haritası
Adım 4'te: m² hesap yardımcısı (cephe yüksekliği × genişlik vs.)
Adım 5'te zaten paketler var, sol panel kaybolabilir

Şu hâli "duvar kağıdı" — bilgi yoğunluğu sıfır, conversion'a katkısı sıfır.
37. Per-m² fiyat lokalizasyon bug: Web'de "548.21 ₺/m²", "641.29 ₺/m²", "762.58 ₺/m²" → nokta decimal separator kullanmış. Türkçe formatta virgül olmalı: "548,21 ₺/m²". Aynı sayfada "549.311 ₺" → bu binlik ayraç. Yani sistem iki farklı bağlamda noktayı iki farklı amaçla kullanıyor. PDF'de doğru ("641,29 ₺/m²"). Web'i PDF formatına hizala.
Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }) kullan, manuel string formatlamayı bırak.
38. Premium / En Popüler / En Uygun rozetleri farklı pozisyonda ama aynı renk + aynı tip. Bunları görsel olarak ayrıştır:

Premium: ince brass outline + altın benek
En Popüler: dolu turuncu (current)
En Uygun: yeşil tonu (ekonomi vurgusu) veya mavi-soğuk (rasyonel seçim)

39. Background construction site fotoğrafı statik, hiçbir şeye katkı vermiyor. Ya çıkar (clean dark), ya subtle paralaks ekle (scroll'da çok hafif hareket), ya branded vector pattern (taşyünü doku, antrasit texture) yap. Şu hâli "demolish edilecek bir bina" hissi veriyor — ürün konumlandırmaya zıt.

🟢 Conversion Fırsatları (Eklenmemiş ama olmalı)
40. Hiçbir trust signal yok:

Kaç projede kullanıldı?
Müşteri yorumu/referans?
ÖZERGRUP'un tamamladığı projelerden 4-6 fotoğraf
"TS 825'e uygun, TSE belgeli" benzeri rozetler

Bu bir construction B2B sitesi, müşteri 600.000-900.000 TL kararı veriyor. Trust olmadan abandon eder.
41. m² hesap yardımcısı yok. Adım 4'te "Hesaplayamıyorsanız bize fotoğraf gönderin, hesaplayalım" gibi WhatsApp shortcut + basit "cephe yüksekliği × genişliği toplamı" mini calculator. Bilmeyen müşteri direkt kaçar.
42. EPS vs Taşyünü karşılaştırma yok. Adım 1'de iki seçenek var ama "Hangisini seçmeliyim?" sorusu boş. Mini tooltip: "Taşyünü → yangın dayanımı, ses yalıtımı | EPS → daha ekonomik, hızlı uygulama". Decision support olmadan müşteri "ben taşyünü duydum" diye seçer, sonra "EPS daha ucuzmuş" deyip rakibe gider.
43. WhatsApp CTA'ya pre-fill mesaj eklenmiş mi belli değil. Tıklayınca müşteri ne yazacak? "Merhaba teklif almak istiyorum" mu? Yoksa otomatik "Teklif No: TY-2026-04-29-8529510, Dengeli Paket, 1200 m², İstanbul/Gedelli" mi geliyor? Pre-fill kritik — yoksa müşteri WhatsApp'a düşer, ne yazacağını düşünür, çıkar.
44. Sticky "WhatsApp ile sor" floating button yok. Müşteri Adım 2-3-4'te takılırsa nereye gidecek? Şu an çıkış noktası yok. Sağ alt köşede sade WhatsApp FAB ekle, "Hesaplama yardım istemek istiyorum" pre-fill ile.
45. Kayıp para uyarısı: TIR yaklaşırken "295 m² ekleyin %4 daha az ödersiniz" iyi. Ama m² başı fiyat değiştiği için toplam tasarruf TL hesabını da göster: "Bu adımı atlasanız 47.000 ₺ daha fazla ödersiniz." Spesifik rakamlar belirsiz yüzdelerden 3x daha güçlü.

🔧 Teknik Borç İşaretleri (şimdi çalışıyor, ileride patlayacak)
46. Slugify fonksiyonu Türkçe karakter handling bozuk (Blocker #3'ün kaynağı). Düzeltirken slugify library kullan (örn. @sindresorhus/slugify + Turkish character map), kendi regex'inle çözmeye çalışma.
47. Number format string concat ile yapılıyor gibi. Intl.NumberFormat standart kullanılmalı — yoksa Almanca/İngilizce müşteri için ayrıca uyarlama gerektiğinde her sayfayı tek tek elden geçirmek zorunda kalırsın.
48. Form state yönetimi belli değil — 4 adım arasında geri-ileri durumu nasıl tutuluyor? localStorage mu? URL state mi? Server-side mi? Eğer client-only ise sayfa yenilemede ne oluyor? Müşteri "Adım 4'teyim, F5'e bastım" → her şey sıfırlandı mı? Bu büyük bir abandonment riski.
49. PDF generation library'si nedir? Eğer puppeteer ile HTML→PDF render ediliyorsa Vercel function timeout (10sn / 60sn) sınırına yaklaşırsın yoğun trafikte. pdf-lib veya @react-pdf/renderer SSR daha güvenli. PDF jeneratör testte 8-10 paralel istekle yüklendi mi?

📋 Önceliklendirme Tablosu
ÖncelikMaddeTahmini Süre🔴 P0Fiyat geçerlilik tutarsızlığı (24sa vs 4 gün)15 dk🔴 P0KDV dahil/hariç disclaimer çelişkisi30 dk🔴 P0PDF dosya adı slugify bug (Türkçe karakter)1 saat🔴 P0Kamyon/TIR otomatik tier seçim mantığı2 saat🔴 P0KVKK onay kutusu + aydınlatma metni2 saat🔴 P0"SW035 SW035" duplicate fix PDF5 dk🔴 P0PDF'den banka IBAN'larını kaldır15 dk🟠 P1Per-m² fiyat virgül/nokta lokalizasyon30 dk🟠 P1Default thickness 5cm → 8cm/10cm5 dk🟠 P1"Açık Adres" required → optional5 dk🟠 P1İlçe Adım 3'e taşı30 dk🟠 P1Loading spinner PDF generate butonuna20 dk🟠 P1TIR'a tamamla quick-action butonu + TL tasarruf gösterimi1 saat🟠 P1Sevkiyat süresi paket kartında (X iş günü)15 dk🟠 P1Garanti farklılaşması (1/2/5 yıl)30 dk🟠 P1Quote number unique ID1 saat🟡 P2Brand logoları SVG + büyütme1-2 saat🟡 P2Sol panel dinamik içerik (her adımda farklı)4-6 saat🟡 P2Dengeli paket visual emphasis (decoy effect)1 saat🟡 P2m² hesap yardımcısı widget2 saat🟡 P2EPS vs Taşyünü karşılaştırma tooltip1 saat🟡 P2Sticky WhatsApp FAB30 dk🟡 P2Trust signals (referans, proje, sertifika)3-4 saat🟡 P2Background fotoğraf yerine pattern/cleaner BG2 saat🟡 P2Turuncu renk kullanımını disipline et2-3 saat

Son söz
P0'lar olmadan canlıya çıkma — özellikle KDV tutarsızlığı ve fiyat geçerlilik çelişkisi müşteriye "bu firma kendi sistemini bilmiyor" sinyali verir. Diğer her şey iyi çünkü temelde mimari sağlam: 4 adım flow, lojistik tier'ları, paket karşılaştırma, PDF teklif — bu ÖZERGRUP partnerşipi için doğru ürün. Eksik olan rötuş, polish ve müşteri psikolojisi katmanı.
P0+P1 toplamı yaklaşık 1-1.5 günlük iş. Bu yapılınca canlıya rahatça çıkar. P2'ler launch sonrası 2 hafta içinde kapatılabilir.
Bir de pratik tavsiye: P0 düzeltmelerinden sonra kendi sandığın 3 farklı senaryo ile (50 m², 1200 m², 5000 m²) baştan sona test et, mobilde de tekrar et, PDF'leri WhatsApp'tan kendine gönder, dosya adlarına bak. Bu 30 dakikalık disiplinli test, canlıya açıldığında 5 müşterinin kötü deneyim yaşamasını engeller.
İstersen yukarıdakilerden herhangi biri için kod-seviyesi düzeltme önerisi yazabilirim — özellikle Kamyon/TIR tier mantığı veya KVKK formu için somut Next.js component örnekleri faydalı olur. Sen söyle.