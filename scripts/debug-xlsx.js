/**
 * XLSX içeriğini hızlıca debug etmek için.
 * Kullanım:
 *   node scripts/debug-xlsx.js "DOSYA_ADI.xlsx"
 */

const XLSX = require("xlsx");

const input = process.argv[2];
if (!input) {
  console.error("Kullanım: node scripts/debug-xlsx.js \"DOSYA.xlsx\" (veya dosya adından bir parça)");
  process.exit(1);
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

let file = input;
if (!require("fs").existsSync(file)) {
  // dosya adı unicode normalize yüzünden tutmayabilir; current dir'de substring ile bul
  const fs = require("fs");
  const tryDirs = [process.cwd(), require("path").resolve(process.cwd(), "..")];
  for (const d of tryDirs) {
    const cand = fs
      .readdirSync(d)
      .filter((f) => f.toLowerCase().endsWith(".xlsx"))
      .find((f) => norm(f).includes(norm(input)));
    if (cand) {
      file = require("path").join(d, cand);
      break;
    }
  }
}

if (!require("fs").existsSync(file)) {
  console.error("Dosya bulunamadı:", input);
  console.error("İpucu: dosya adından benzersiz bir parça verin (örn: \"KALEM BAZINDA\")");
  process.exit(1);
}

const wb = XLSX.readFile(file, { cellDates: false });
console.log("file:", file);
console.log("sheets:", wb.SheetNames);

const keywords = ["plaka", "iskonto", "bölge", "bolge", "optimix", "kamyon", "tır", "tir", "ekstra"];

for (const s of wb.SheetNames) {
  const ws = wb.Sheets[s];
  const m = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });

  console.log("\n==", s, "rows", m.length, "==");
  console.log("first 15 rows (first 12 cols):");
  for (let i = 0; i < Math.min(15, m.length); i++) {
    console.log(String(i + 1).padStart(3), JSON.stringify(m[i].slice(0, 12)));
  }

  let hits = [];
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      const v = String(m[r][c] || "");
      const lv = v.toLowerCase();
      if (keywords.some((k) => lv.includes(k))) {
        hits.push({ r: r + 1, c: c + 1, v: v.slice(0, 80) });
        if (hits.length >= 80) break;
      }
    }
    if (hits.length >= 80) break;
  }

  console.log("sample keyword hits (up to 80):");
  console.log(hits);
}


