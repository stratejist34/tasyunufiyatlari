import { parseExcelBuffer } from './lib/importExcelParser';
import type { RawImportRow } from './lib/importTypes';
import * as fs from 'fs';
import * as path from 'path';

const files = [
    'KALEM BAZINDA AMBALAJ TIR KAMPANYASI MALİYETLERİ ARALIK 2025.xlsx',
    '2026 ŞUBAT EPS TOZ KALEM BAZLI & PAKET SİSTEM MALİYET ANALİZİ.xlsx',
];

for (const fname of files) {
    const buf = fs.readFileSync(path.join(__dirname, fname));
    const r   = parseExcelBuffer(buf as Buffer, fname);
    console.log(`\n=== ${fname.slice(0,40)} ===`);
    console.log('Satır sayısı:', r.rows.length, '| Uyarılar:', r.parseWarnings.length > 0 ? r.parseWarnings : 'yok');
    console.log('İlk 5 satır:');
    r.rows.slice(0, 5).forEach((row: RawImportRow, i: number) => {
        console.log(`  [${i}] "${row.rawProductName.slice(0,40)}" | fiyat=${row.rawPrice} | kdv=${row.rawKdvHint} | isk1=${row.rawIsk1} | isk2=${row.rawIsk2} | pkgM2=${row.rawPackageM2}`);
    });
    const acc = r.rows.find((row: RawImportRow) =>
        !row.rawProductName.toLowerCase().includes('levha') &&
        !row.rawProductName.toLowerCase().includes(' cm ') &&
        !row.rawProductName.match(/\d+\s*cm/i));
    if (acc) {
        console.log(`  [İLK AKSESUAR] "${acc.rawProductName.slice(0,40)}" | fiyat=${acc.rawPrice} | kdv=${acc.rawKdvHint} | pkgM2=${acc.rawPackageM2}`);
    }
}
