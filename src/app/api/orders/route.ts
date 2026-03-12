import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import nodemailer from 'nodemailer'
import type { CartItem } from '@/types'

interface OrderPayload {
  customer_firstname: string
  customer_lastname: string
  customer_phone: string
  customer_address: string
  items: CartItem[]
  total: number
}

function buildEmailHtml(data: OrderPayload): string {
  const itemsRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.product.emoji} ${item.product.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity} ${item.product.unit}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${(item.product.price * item.quantity).toFixed(2).replace('.', ',')} €</td>
        </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouvelle commande Food Kwetu</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#1B5C30;padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">FOOD <span style="color:#F0B429;">KWETU</span></h1>
      <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Nouvelle commande reçue</p>
    </div>

    <!-- Alert banner -->
    <div style="background:#FEF3C7;border-bottom:2px solid #F0B429;padding:14px 32px;">
      <p style="margin:0;color:#92400E;font-size:14px;font-weight:600;">
        🛒 Nouvelle commande — ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>

    <!-- Customer info -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;">
      <h2 style="margin:0 0 16px;font-size:15px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Client</h2>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 0;color:#6B7280;width:120px;">Nom</td>
          <td style="padding:4px 0;font-weight:600;color:#111827;">${data.customer_firstname} ${data.customer_lastname}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6B7280;">Téléphone</td>
          <td style="padding:4px 0;font-weight:600;color:#1B5C30;">${data.customer_phone}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6B7280;">Adresse</td>
          <td style="padding:4px 0;color:#111827;">${data.customer_address}</td>
        </tr>
      </table>
    </div>

    <!-- Order items -->
    <div style="padding:24px 32px;border-bottom:1px solid #f0f0f0;">
      <h2 style="margin:0 0 16px;font-size:15px;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Commande (${data.items.length} produit${data.items.length > 1 ? 's' : ''})</h2>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6B7280;font-weight:600;">Produit</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6B7280;font-weight:600;">Qté</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6B7280;font-weight:600;">Prix</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding:20px 32px;background:#f0faf4;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:15px;font-weight:600;color:#1B5C30;">TOTAL COMMANDE</span>
        <span style="font-size:22px;font-weight:700;color:#1B5C30;">${data.total.toFixed(2).replace('.', ',')} €</span>
      </div>
    </div>

    <!-- Action reminder -->
    <div style="padding:20px 32px;text-align:center;background:#fffbeb;">
      <p style="margin:0;font-size:13px;color:#92400E;">
        ⚡ Contactez le client dès que possible au <strong>${data.customer_phone}</strong> pour confirmer et organiser le paiement.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;text-align:center;background:#f9fafb;">
      <p style="margin:0;font-size:11px;color:#9CA3AF;">Food Kwetu — Île-de-France · foodk_wetu</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: Request) {
  try {
    const body: OrderPayload = await req.json()

    // Validate required fields
    if (
      !body.customer_firstname ||
      !body.customer_lastname ||
      !body.customer_phone ||
      !body.customer_address ||
      !body.items?.length
    ) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // 1. Save order to Supabase
    const supabase = createServiceClient()
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_firstname: body.customer_firstname,
        customer_lastname: body.customer_lastname,
        customer_phone: body.customer_phone,
        customer_address: body.customer_address,
        items: body.items,
        total: body.total,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    // 2. Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"Food Kwetu" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🛒 Nouvelle commande — ${body.customer_firstname} ${body.customer_lastname} — ${body.total.toFixed(2)}€`,
        html: buildEmailHtml(body),
      })
    } catch (emailErr) {
      // Email failure should NOT block the order — just log it
      console.error('Email error:', emailErr)
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}