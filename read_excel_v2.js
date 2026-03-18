const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Klasördeki tüm .xlsx dosyalarını tara ve "KAMPANYA" veya "MALIYET" içerenleri oku
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.xlsx'));

console.log('--- Bulunan Excel Dosyaları ---');
files.forEach((f, i) => console.log(`${i + 1}: ${f}`));

const targetFile = files.find(f => f.includes('KAMPANYASI') && f.includes('ARALIK'));

if (!targetFile) {
    console.log('❌ Aranan Excel dosyası bulunamadı. Listeden seçip elle yazmalısınız.');
    process.exit(1);
}

console.log(`\n📂 Okunan Dosya: ${targetFile}\n`);

try {
    const workbook = XLSX.readFile(targetFile);

    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n📄 Sayfa: ${sheetName}`);
        console.log('-'.repeat(30));

        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        // Başlıkları ve İlgili Satırı Bul
        data.forEach((row, idx) => {
            const rowStr = row.join(' ');
            if (rowStr.includes('Expert') && rowStr.includes('Karbonlu') && rowStr.includes('5')) {
                console.log(`\n✅ Satır ${idx + 1}:`, JSON.stringify(row));

                // Başlık satırını da göster (genelde ilk 3 satırdan biridir)
                console.log('📌 Başlık Satırı (Muhtemel):', JSON.stringify(data[idx > 2 ? idx - 1 : 0]));
            }
        });
    });
} catch (err) {
    console.error('❌ Okuma hatası:', err.message);
}
