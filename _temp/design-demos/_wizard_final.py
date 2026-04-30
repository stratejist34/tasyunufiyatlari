from playwright.sync_api import sync_playwright
import os

OUT_DIR = r"c:\Users\Emrah\Desktop\Tasyunufİyatlari\tasyunu-front\_temp\design-demos"
BASE = "http://localhost:3000"

def shoot(page, fname, locator=None):
    path = os.path.join(OUT_DIR, fname)
    if locator is not None:
        locator.screenshot(path=path)
    else:
        page.screenshot(path=path, full_page=False)
    print(f"  saved {fname}", flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.set_default_timeout(60000)

    page.goto(BASE + "/", wait_until="load", timeout=180000)
    page.wait_for_timeout(3500)  # let wizard hydrate + zone fetch

    # The wizard is in the hero. Locate it by its container.
    # Step 1 — default: Dalmacayalı pre-selected, malzeme tasyunu
    print("--> step1", flush=True)
    shoot(page, "wizard-final-step1.png")

    # Click "Kalınlık Seçimine Geç" → step 2
    btn = page.get_by_role("button", name="Kalınlık Seçimine Geç")
    if btn.count() > 0:
        btn.first.click()
        page.wait_for_timeout(800)
        print("--> step2", flush=True)
        shoot(page, "wizard-final-step2.png")

        btn2 = page.get_by_role("button", name="Konum Seçimine Geç")
        if btn2.count() > 0:
            btn2.first.click()
            page.wait_for_timeout(800)
            print("--> step3", flush=True)
            shoot(page, "wizard-final-step3.png")

            btn3 = page.get_by_role("button", name="Metraj Gir")
            if btn3.count() > 0:
                btn3.first.click()
                page.wait_for_timeout(800)
                # Type a metraj that triggers the "X m² kaldı" nudge (parsiyel near kamyon boundary)
                metraj_input = page.locator('input[type="number"], input[inputmode="numeric"]').first
                if metraj_input.count() > 0:
                    metraj_input.fill("400")
                    page.wait_for_timeout(1500)
                print("--> step4", flush=True)
                shoot(page, "wizard-final-step4.png")
                # Also full page so the compare button + nudge are visible
                page.screenshot(path=os.path.join(OUT_DIR, "wizard-final-step4-full.png"), full_page=True)
                print("  saved wizard-final-step4-full.png", flush=True)
            else:
                print("  step3 'Metraj Gir' button not found", flush=True)
        else:
            print("  step2 'Konum Seçimine Geç' button not found", flush=True)
    else:
        print("  step1 'Kalınlık Seçimine Geç' button not found", flush=True)

    browser.close()
print("DONE", flush=True)
