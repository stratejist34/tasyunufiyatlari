from playwright.sync_api import sync_playwright
import os

OUT_DIR = r"c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\_temp\design-demos"
BASE = "http://localhost:3000"

def shoot(page, fname, full=True):
    path = os.path.join(OUT_DIR, fname)
    page.screenshot(path=path, full_page=full)
    print(f"  saved {fname}", flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.set_default_timeout(180000)

    pages = [
        ("/", "site-cleanup-home.png"),
        ("/urunler", "site-cleanup-urunler.png"),
        ("/urunler/tasyunu-levha", "site-cleanup-kategori.png"),
        ("/marka/dalmacyali", "site-cleanup-marka.png"),
    ]
    for url, fname in pages:
        print(f"--> {BASE}{url}", flush=True)
        page.goto(BASE + url, wait_until="load", timeout=180000)
        page.wait_for_timeout(2500)
        shoot(page, fname)

    # Wizard — homepage hosts the wizard. Take focused captures of each step.
    print("--> wizard scroll-in capture (step1 visible at top of homepage)", flush=True)
    page.goto(BASE + "/", wait_until="load", timeout=180000)
    page.wait_for_timeout(2500)
    # Step 1 — already visible
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(OUT_DIR, "site-cleanup-wizard-step1.png"), full_page=False)
    print("  saved site-cleanup-wizard-step1.png", flush=True)

    # Try clicking first product card to advance step1 -> step2
    # The wizard accepts product selection — find a clickable product/material option
    try:
        # Look for "Taşyünü" or "EPS" buttons
        candidates = page.locator('button:has-text("Taşyünü"), button:has-text("EPS"), [role="button"]:has-text("Taşyünü")').all()
        print(f"  step1 candidates: {len(candidates)}", flush=True)
        if candidates:
            candidates[0].click()
            page.wait_for_timeout(1500)
            page.screenshot(path=os.path.join(OUT_DIR, "site-cleanup-wizard-step2.png"), full_page=False)
            print("  saved site-cleanup-wizard-step2.png", flush=True)
            # Try advancing — find İleri or Devam button
            adv = page.locator('button:has-text("İleri"), button:has-text("Devam"), button:has-text("Sonraki")').first
            if adv.count() > 0:
                adv.click()
                page.wait_for_timeout(1500)
                page.screenshot(path=os.path.join(OUT_DIR, "site-cleanup-wizard-step3.png"), full_page=False)
                print("  saved site-cleanup-wizard-step3.png", flush=True)
                # Step 4: another İleri
                adv2 = page.locator('button:has-text("İleri"), button:has-text("Devam"), button:has-text("Sonraki"), button:has-text("Hesapla")').first
                if adv2.count() > 0:
                    adv2.click()
                    page.wait_for_timeout(1500)
                    page.screenshot(path=os.path.join(OUT_DIR, "site-cleanup-wizard-step4.png"), full_page=False)
                    print("  saved site-cleanup-wizard-step4.png", flush=True)
    except Exception as e:
        print(f"  wizard step advance error: {e}", flush=True)

    browser.close()
print("DONE", flush=True)
