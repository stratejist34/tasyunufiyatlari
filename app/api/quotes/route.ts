import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { apiQuoteSchema } from '@/lib/schemas/quote.schema'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function mapQuotePayload(payload: ReturnType<typeof apiQuoteSchema.parse>) {
  return {
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    customer_company: payload.customerCompany || null,
    customer_address: payload.customerAddress || null,
    material_type: payload.materialType,
    brand_id: payload.brandId,
    brand_name: payload.brandName,
    model_id: payload.modelId ?? null,
    model_name: payload.modelName || null,
    thickness_cm: payload.thicknessCm,
    area_m2: payload.areaM2,
    city_code: payload.cityCode,
    city_name: payload.cityName,
    district_code: payload.districtCode || null,
    district_name: payload.districtName || null,
    package_name: payload.packageName,
    package_description: payload.packageDescription || null,
    plate_brand_name: payload.plateBrandName,
    accessory_brand_name: payload.accessoryBrandName,
    total_price: payload.totalPrice,
    price_per_m2: payload.pricePerM2,
    shipping_cost: payload.shippingCost,
    discount_percentage: payload.discountPercentage,
    price_without_vat: payload.priceWithoutVat,
    vat_amount: payload.vatAmount,
    package_count: payload.packageCount,
    package_size_m2: payload.packageSizeM2,
    items_per_package: payload.itemsPerPackage,
    vehicle_type: payload.vehicleType || null,
    lorry_capacity_packages: payload.lorryCapacityPackages ?? null,
    truck_capacity_packages: payload.truckCapacityPackages ?? null,
    lorry_fill_percentage: payload.lorryFillPercentage ?? null,
    truck_fill_percentage: payload.truckFillPercentage ?? null,
    package_items: payload.packageItems,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = apiQuoteSchema.parse(body)
    const supabase = createServerSupabaseClient()

    const insertPayload = mapQuotePayload(payload)

    const { data, error } = await supabase
      .from('quotes')
      .insert(insertPayload)
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Quote insert failed:', error)
      return NextResponse.json(
        { ok: false, error: 'Teklif kaydı oluşturulamadı.' },
        { status: 500 }
      )
    }

    const analyticsPayload = {
      event_type: 'quote_submitted',
      quote_id: data.id,
      material_type: payload.materialType,
      brand_id: payload.brandId,
      brand_name: payload.brandName,
      model_name: payload.modelName || null,
      thickness_cm: payload.thicknessCm,
      area_m2: payload.areaM2,
      city_code: payload.cityCode,
      city_name: payload.cityName,
      package_name: payload.packageName,
      total_price: payload.totalPrice,
      metadata: {
        plateBrandName: payload.plateBrandName,
        accessoryBrandName: payload.accessoryBrandName,
        vehicleType: payload.vehicleType || null,
      },
    }

    const { error: analyticsError } = await supabase
      .from('quote_funnel_events')
      .insert(analyticsPayload)

    if (analyticsError) {
      console.warn('Quote analytics insert skipped:', analyticsError.message)
    }

    return NextResponse.json({
      ok: true,
      quoteId: data.id,
      createdAt: data.created_at,
    })
  } catch (error) {
    console.error('Quote API error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Teklif verisi doğrulanamadı.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { ok: false, error: 'Teklif kaydı sırasında beklenmeyen hata oluştu.' },
      { status: 500 }
    )
  }
}
