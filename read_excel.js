const XLSX = require('xlsx');

const workbook = XLSX.readFile('KALEM BAZINDA AMBALAJ TIR KAMPANYASI MALİYETLERİ ARALIK 2025.xlsx');

console.log('📊 Sayfalar:', workbook.SheetNames);
console.log('\n' + '='.repeat(80));

workbook.SheetNames.forEach(sheetName => {
    console.log(`\n📄 ${sheetName}`);
    console.log('='.repeat(80));

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Expert EPS Karbonlu 5cm'i bul
    data.forEach((row, idx) => {
        const text = row.join(' ');
        if (text.includes('Expert') && text.includes('EPS') && text.includes('Karbonlu') && text.includes('5')) {
            console.log(`\n✅ Satır ${idx + 1}:`, row);
        }
    });

    // Başlıkları göster (ilk 5 satır)
    console.log('\n📋 İlk 5 satır (yapı anlaşılsın):');
    data.slice(0, 5).forEach((row, i) => console.log(`${i + 1}:`, row));
});
