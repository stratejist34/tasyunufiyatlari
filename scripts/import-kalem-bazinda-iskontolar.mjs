/**
 * KALEM BAZINDA AMBALAJ TIR KAMPANYASI (xlsx) -> Supabase shipping_zones güncelle
 *
 * Güncellediği alanlar:
 * - shipping_zones.eps_toz_region_discount  (Bölge 1/2/3 -> 9/7/5)
 * - shipping_zones.optimix_toz_discount     (Optimix Bölge İskontosu tablosundan 16/14/12/10/8)
 *
 * Kullanım:
 *   node scripts/import-kalem-bazinda-iskontolar.mjs
 *
 * Not:
 * - Bu script "taşyünü hariç bölge iskontosu" ve "Optimix bölge iskontosu" tablosunu xlsx içinden okumayı dener.
 * - Tablo başlıkları farklıysa, script sonunda hangi header'ı bulamadığını log'lar.
 */

import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://latlzskzemmdnotzpscc.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdGx6c2t6ZW1tZG5vdHpwc2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjY5MjUsImV4cCI6MjA4MDkwMjkyNX0.r9N8JGfi_IxMX31eeSnkQusK2aZlZudfQYlvPLQysFw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// script: tasyunu-front/scripts/.. -> tasyunu-front/
const PROJECT_ROOT = path.resolve(__dirname, "..");
const WORKBOOK_HINT = "KALEM BAZINDA AMBALAJ";

function findWorkbookPath() {
  const files = fs.readdirSync(PROJECT_ROOT).filter((f) => f.toLowerCase().endsWith(".xlsx"));
  const hit = files.find((f) => normalize(f).includes(normalize(WORKBOOK_HINT)));
  return hit ? path.join(PROJECT_ROOT, hit) : null;
}

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i")
    .replace(/\s+/g, " ")
    .trim();
}

function sheetToMatrix(workbook, sheetName) {
  const ws = workbook.Sheets[sheetName];
  if (!ws) return null;
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
}

function findHeaderRow(matrix, requiredHeaders) {
  const req = requiredHeaders.map(normalize);
  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r].map(normalize);
    const ok = req.every((h) => row.some((cell) => cell.includes(h)));
    if (ok) return r;
  }
  return -1;
}

function parseNumberTR(val) {
  if (val == null) return null;
  const s = String(val).replace("%", "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseOptimixRegionDiscount(workbook) {
  // Beklenen tablo: "OPTİMİX BÖLGE İSKONTOSU" bloğu içinde kolonlar:
  // "İL PLAKA KOD" | "İL" | "% İSKONTO" | "BÖLGE"
  for (const sheetName of workbook.SheetNames) {
    const matrix = sheetToMatrix(workbook, sheetName);
    if (!matrix) continue;

    let headerRow = -1;
    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r].map(normalize);
      if (row.some((c) => c.includes("il plaka")) && row.some((c) => c.includes("iskonto"))) {
        headerRow = r;
        break;
      }
    }
    if (headerRow === -1) continue;

    const header = matrix[headerRow].map(normalize);
    const cityCodeIdx = header.findIndex((c) => c.includes("plaka"));
    if (cityCodeIdx === -1) continue;

    // Aynı satırda "iskonto" birden fazla kez geçiyor (örn: "KDV DAHİL İSKONTOLU FİYATI" + "% İSKONTO").
    // Bize lazım olan: şehir tablosundaki "% İSKONTO" => plaka kolonunun SAĞINDA olmalı.
    const iskontoIdxCandidates = header
      .map((c, idx) => ({ c, idx }))
      .filter(({ c }) => c.includes("iskonto"))
      .map(({ idx }) => idx);
    const discountIdx = iskontoIdxCandidates.find((idx) => idx > cityCodeIdx) ?? -1;
    if (discountIdx === -1) continue;

    const rows = [];
    for (let r = headerRow + 1; r < matrix.length; r++) {
      const row = matrix[r];
      const cityCode = parseInt(String(row[cityCodeIdx]).trim(), 10);
      const discount = parseNumberTR(row[discountIdx]);
      if (!Number.isFinite(cityCode) || discount == null) continue;
      rows.push({ city_code: cityCode, optimix_toz_discount: discount });
    }

    if (rows.length >= 40) return { sheetName, rows };
  }

  return null;
}

function parseEpsTozRegionDiscount(workbook) {
  // Bu tablo bazen "BÖLGE EKSTRA İSKONTOSU (TAŞYÜNÜ HARİÇ)" olarak geliyor ve şehirler metin listesi halinde olabiliyor.
  // Eğer xlsx içinde şehir plakası/il + yüzde şeklinde yapılandırılmış bir tablo varsa onu okuruz.
  // Aksi durumda null döneriz (kullanıcıdan daha yapılandırılmış sayfa isteriz).
  for (const sheetName of workbook.SheetNames) {
    const matrix = sheetToMatrix(workbook, sheetName);
    if (!matrix) continue;

    // Yapılandırılmış tablo olasılığı: kolonlar "İL PLAKA", "%", "BÖLGE"
    const headerRow = findHeaderRow(matrix, ["il", "%", "bolge"]);
    if (headerRow === -1) continue;
    const header = matrix[headerRow].map(normalize);
    const cityCodeIdx = header.findIndex((c) => c.includes("plaka"));
    const discountIdx = header.findIndex((c) => c.includes("iskonto") || c === "%");
    if (cityCodeIdx === -1 || discountIdx === -1) continue;

    const rows = [];
    for (let r = headerRow + 1; r < matrix.length; r++) {
      const row = matrix[r];
      const cityCode = parseInt(String(row[cityCodeIdx]).trim(), 10);
      const discount = parseNumberTR(row[discountIdx]);
      if (!Number.isFinite(cityCode) || discount == null) continue;
      rows.push({ city_code: cityCode, eps_toz_region_discount: discount });
    }

    // Eğer 81 ilin çoğu geldiyse bunu kabul edelim
    if (rows.length >= 40) {
      return { sheetName, rows };
    }
  }

  return null;
}

async function upsertShippingZoneFields(rows, fieldName) {
  let ok = 0;
  let fail = 0;

  for (const r of rows) {
    const cityCode = r.city_code;
    const patch = { [fieldName]: r[fieldName] };
    const { error } = await supabase.from("shipping_zones").update(patch).eq("city_code", cityCode);
    if (error) {
      fail++;
      console.error("❌ update failed", cityCode, patch, error.message);
    } else {
      ok++;
    }
  }

  return { ok, fail };
}

async function main() {
  const workbookPath = findWorkbookPath();
  if (!workbookPath) {
    console.error("❌ xlsx bulunamadı. Aranan ipucu:", WORKBOOK_HINT);
    process.exit(1);
  }

  console.log("📄 Workbook:", workbookPath);
  const workbook = XLSX.readFile(workbookPath, { cellDates: false });
  console.log("📑 Sheets:", workbook.SheetNames.join(", "));

  const optimix = parseOptimixRegionDiscount(workbook);
  if (!optimix) {
    console.warn("⚠️ Optimix bölge iskontosu tablosu bulunamadı (header araması başarısız).");
  } else {
    console.log(`✅ Optimix tablosu bulundu: sheet="${optimix.sheetName}", satır=${optimix.rows.length}`);
    const res = await upsertShippingZoneFields(optimix.rows, "optimix_toz_discount");
    console.log("✅ shipping_zones.optimix_toz_discount güncelleme:", res);
  }

  const epsToz = parseEpsTozRegionDiscount(workbook);
  if (!epsToz) {
    console.warn(
      "⚠️ EPS/Toz bölge iskontosu tablosu bulunamadı. Eğer bu dosyada şehirler metin listesi şeklindeyse, onu ayrı bir sayfa olarak yapılandırılmış (plaka/yüzde) hale getirmemiz gerekecek."
    );
  } else {
    console.log(`✅ EPS/Toz bölge iskontosu tablosu bulundu: sheet="${epsToz.sheetName}", satır=${epsToz.rows.length}`);
    const res = await upsertShippingZoneFields(epsToz.rows, "eps_toz_region_discount");
    console.log("✅ shipping_zones.eps_toz_region_discount güncelleme:", res);
  }

  // Hızlı kontrol: İstanbul
  const { data } = await supabase.from("shipping_zones").select("*").eq("city_code", 34).single();
  console.log("🔎 Kontrol (İstanbul 34):", data);
}

main().catch((e) => {
  console.error("❌ HATA:", e);
  process.exit(1);
});


