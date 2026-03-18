// Excel okuma ve fiyat analiz scripti
const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'KALEM BAZINDA AMBALAJ TIR KAMPANYASI MALİYETLERİ ARALIK 2025.xlsx');

console.log('Excel dosyası okunuyor:', excelPath);
console.log('='.repeat(80));

try {
    const workbook = XLSX.readFile(excelPath);
    console.log('\n📊 Sayfa İsimleri:', workbook.SheetNames);
    
    // Her sayfayı oku
    workbook.SheetNames.forEach((sheetName, index) => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📄 SAYFA ${index + 1}: ${sheetName}`);
        console.log('='.repeat(80));
        
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        // İlk 20 satırı göster
        console.log('\nİlk 20 satır:');
        data.slice(0, 20).forEach((row, idx) => {
            if (row.some(cell => cell !== '')) {
                console.log(`Satır ${idx + 1}:`, row);
            }
        });
        
        // Expert EPS Karbonlu 5cm ile ilgili satırları bul
        console.log('\n🔍 "Expert EPS Karbonlu" içeren satırlar:');
        data.forEach((row, idx) => {
            const rowText = row.join(' ').toLowerCase();
            if (rowText.includes('expert') && rowText.includes('eps') && rowText.includes('karbonlu')) {
                console.log(`\nSatır ${idx + 1}:`, row);
            }
        });
        
        // İskonto sütunlarını bul
        console.log('\n💰 "İSK" veya "iskonto" içeren satırlar:');
        data.forEach((row, idx) => {
            const rowText = row.join(' ').toLowerCase();
            if (rowText.includes('isk') || rowText.includes('iskonto')) {
                console.log(`Satır ${idx + 1}:`, row);
            }
        });
    });
    
} catch (error) {
    console.error('❌ Hata:', error.message);
    console.log('\nÇözüm: xlsx paketi kurulu değil, kuralım:');
    console.log('npm install xlsx');
}
