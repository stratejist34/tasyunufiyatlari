
import { supabase } from './lib/supabase';

async function verifyEPSData() {
    console.log("Checking Material Types...");
    const { data: materials, error: matError } = await supabase.from("material_types").select("*");
    if (matError) {
        console.error("Error fetching materials:", matError);
        return;
    }
    console.log("Materials:", materials);

    const eps = materials?.find(m => m.slug === 'eps');
    if (!eps) {
        console.error("EPS material type not found!");
        return;
    }
    console.log("EPS Material ID:", eps.id);

    console.log("\nChecking EPS Plates...");
    const { data: plates, error: plateError } = await supabase
        .from("plates")
        .select("*")
        .eq("material_type_id", eps.id)
        .eq("is_active", true);

    if (plateError) {
        console.error("Error fetching plates:", plateError);
        return;
    }
    console.log(`Found ${plates?.length} EPS plates.`);

    if (plates && plates.length > 0) {
        plates.forEach(p => {
            console.log(`\nPlate: ${p.name} (ID: ${p.id}, BrandID: ${p.brand_id}, ShortName: ${p.short_name})`);
            console.log(`Base Price: ${p.base_price}`);
            console.log(`Options: ${JSON.stringify(p.thickness_options)}`);
        });

        const plateIds = plates.map(p => p.id);
        console.log("\nChecking Plate Prices for these plates...");
        const { data: prices, error: priceError } = await supabase
            .from("plate_prices")
            .select("*")
            .in("plate_id", plateIds);

        if (priceError) {
            console.error("Error fetching prices:", priceError);
        } else {
            console.log(`Found ${prices?.length} price entries.`);
            prices?.forEach(price => {
                console.log(`- PlateID: ${price.plate_id}, Thickness: ${price.thickness}, BasePrice: ${price.base_price}, Discount2: ${price.discount_2}`);
            });
        }
    } else {
        console.warn("No EPS plates found active in the database.");
    }
}

verifyEPSData();
