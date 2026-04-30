from playwright.sync_api import sync_playwright
import os

OUT_DIR = r"c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\_temp\design-demos"
BASE = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.set_default_timeout(60000)

    page.goto(BASE + "/", wait_until="load", timeout=180000)
    page.wait_for_timeout(3500)

    # Step 1 → 2
    page.get_by_role("button", name="Kalınlık Seçimine Geç").first.click()
    page.wait_for_timeout(800)

    # Step 2 → 3
    page.get_by_role("button", name="Konum Seçimine Geç").first.click()
    page.wait_for_timeout(800)

    # Step 3 (city default Istanbul) → 4
    page.get_by_role("button", name="Metraj Gir").first.click()
    page.wait_for_timeout(800)

    # Step 4: enter metraj 800
    inp = page.locator('input[type="number"]').first
    inp.fill("800")
    page.wait_for_timeout(1500)

    # Click "3 Teklifi Karşılaştır"
    page.get_by_role("button", name="3 Teklifi Karşılaştır").first.click()
    page.wait_for_timeout(4000)  # let results render + animate

    # Scroll to results
    page.evaluate("window.scrollBy(0, 700)")
    page.wait_for_timeout(800)
    page.screenshot(path=os.path.join(OUT_DIR, "wizard-result-cards.png"), full_page=False)
    print("  saved wizard-result-cards.png", flush=True)

    page.screenshot(path=os.path.join(OUT_DIR, "wizard-result-full.png"), full_page=True)
    print("  saved wizard-result-full.png", flush=True)

    browser.close()
print("DONE", flush=True)
