from playwright.sync_api import sync_playwright
import sys
import os

OUT_DIR = r"c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\_temp\design-demos"
BASE = "http://localhost:3000"

def shoot(page, url, fname, wait_ms=2500):
    print(f"--> {url}", flush=True)
    page.goto(url, wait_until="load", timeout=180000)
    page.wait_for_timeout(wait_ms)
    path = os.path.join(OUT_DIR, fname)
    page.screenshot(path=path, full_page=True)
    print(f"    saved {fname}", flush=True)
    return page.url

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.set_default_timeout(120000)

    # 1) Home
    shoot(page, BASE + "/", "site-migration-v1-home.png", wait_ms=1500)

    # 2) Urunler hub (regression)
    shoot(page, BASE + "/urunler", "site-migration-v1-urunler.png", wait_ms=1500)

    # 3) First category — discover from /urunler page
    page.goto(BASE + "/urunler", wait_until="load", timeout=180000)
    page.wait_for_timeout(1000)
    cat_link = page.locator('a[href^="/urunler/"]').first
    cat_href = cat_link.get_attribute("href")
    print(f"first category href = {cat_href}", flush=True)
    shoot(page, BASE + cat_href, "site-migration-v1-kategori.png", wait_ms=1500)

    # 4) Brand page — try dalmacyali, fall back to first brand link found anywhere
    brand_url = BASE + "/marka/dalmacyali"
    try:
        page.goto(brand_url, wait_until="load", timeout=180000)
        page.wait_for_timeout(1500)
        page.screenshot(path=os.path.join(OUT_DIR, "site-migration-v1-marka.png"), full_page=True)
        print("    saved site-migration-v1-marka.png (dalmacyali)", flush=True)
    except Exception as e:
        print(f"dalmacyali failed: {e}", flush=True)
        # fallback: search urunler page for /marka/* link
        page.goto(BASE + "/urunler", wait_until="load", timeout=180000)
        marka_link = page.locator('a[href^="/marka/"]').first
        if marka_link.count() > 0:
            href = marka_link.get_attribute("href")
            print(f"fallback brand href = {href}", flush=True)
            shoot(page, BASE + href, "site-migration-v1-marka.png", wait_ms=1500)
        else:
            print("no brand link found anywhere", flush=True)

    browser.close()
print("DONE", flush=True)
