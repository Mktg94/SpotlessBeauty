# Spotless Beauty Lab — Setup & Deployment Guide

## 🚀 Local Development

```bash
npm run dev   # runs at http://localhost:3000
```

---

## 🗄️ Step 1 — Fix MongoDB Atlas IP Whitelist

The app **cannot connect to MongoDB** unless your IP is whitelisted.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster **Spotless-Beauty-Lab**
3. Go to **Network Access** → **Add IP Address**
4. For local dev: add your current IP
5. For Vercel production: click **Allow Access from Anywhere** (`0.0.0.0/0`)

---

## 🌱 Step 2 — Seed the Database (First Time Only)

After the IP is whitelisted, seed your database with sample data and the admin account.

**Locally (in browser console or Postman):**
```js
fetch('/api/seed', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) })
  .then(r => r.json()).then(console.log)
```

**On Vercel (production):**
```bash
curl -X POST https://spotless-beauty.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"secret":"spotless-seed-2026-secret"}'
```

---

## 🔐 Admin Login

After seeding:
- **URL**: `/auth/login`
- **Email**: `admin@spotlessbeautylab.com`
- **Password**: `Admin@123`

Then go to `/admin` to manage products and orders.

---

## ☁️ Vercel Deployment

### Required Environment Variables (add in Vercel dashboard → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | `ThInW8n6RKyghyBP30W++fGd7fnH7MVZmE3mHZZVxVk=` |
| `NEXTAUTH_URL` | `https://spotless-beauty.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | `draoyxmtm` |
| `CLOUDINARY_API_KEY` | `597879246453598` |
| `CLOUDINARY_API_SECRET` | `Ut2Y9OjfcHAl_SIVwNOhKY-6N0E` |
| `ADMIN_EMAIL` | `admin@spotlessbeautylab.com` |
| `ADMIN_PASSWORD` | `Admin@123` |
| `SEED_SECRET` | `spotless-seed-2026-secret` |

> ⚠️ **NEXTAUTH_URL must be set to your Vercel domain in Vercel's dashboard** — not from `.env` (which is local only).

---

## 📦 What's Built

| Feature | Status |
|---|---|
| Homepage (Hero, Categories, Products, Testimonials) | ✅ |
| Product Listing with Filters (category, price, skin type, sort) | ✅ |
| Product Detail (images, tabs: description/ingredients/usage, Buy Now) | ✅ |
| Reviews & Ratings system | ✅ |
| Cart with quantity controls & order summary | ✅ |
| Checkout (Ethiopian address + COD + Telebirr placeholder) | ✅ |
| Order Confirmation & Status Tracker | ✅ |
| User Account / Order History | ✅ |
| WhatsApp "Order Now" floating button | ✅ |
| Auth (Login, Register) | ✅ |
| Admin Dashboard (stats, products CRUD, orders management) | ✅ |
| Image upload via Cloudinary | ✅ |
| SEO metadata on all pages | ✅ |
| Full luxury light theme (cream/blush/rose/gold) | ✅ |
| Build passes: 21/21 pages, Exit code 0 | ✅ |
