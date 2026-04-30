from playwright.sync_api import sync_playwright
import os

OUT_DIR = r"c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\_temp\design-demos"
BASE = "http://localhost:3000"

PAGES = [("/hakkimizda", "hakkimizda"), ("/depomuz", "depomuz"), ("/iletisim", "iletisim")]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Desktop 1440x900
    ctx_d = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page_d = ctx_d.new_page()
    page_d.set_default_timeout(180000)
    for url, slug in PAGES:
        print(f"--> desktop {url}", flush=True)
        page_d.goto(BASE + url, wait_until="load", timeout=180000)
        page_d.wait_for_timeout(2500)
        page_d.screenshot(path=os.path.join(OUT_DIR, f"{slug}-final.png"), full_page=True)
        print(f"  saved {slug}-final.png", flush=True)
    ctx_d.close()

    # Mobile 375x812 (iPhone-ish)
    ctx_m = browser.new_context(viewport={"width": 375, "height": 812}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page_m = ctx_m.new_page()
    page_m.set_default_timeout(180000)
    for url, slug in PAGES:
        print(f"--> mobile {url}", flush=True)
        page_m.goto(BASE + url, wait_until="load", timeout=180000)
        page_m.wait_for_timeout(2500)
        page_m.screenshot(path=os.path.join(OUT_DIR, f"{slug}-mobile.png"), full_page=True)
        print(f"  saved {slug}-mobile.png", flush=True)
    ctx_m.close()

    browser.close()
print("DONE", flush=True)
