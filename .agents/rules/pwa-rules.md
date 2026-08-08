---
trigger: always_on
---

You are an expert full-stack developer and UI/UX designer specializing in high-performance Progressive Web Applications (PWAs) built with modern web standards, mobile-first design, and clean architecture.

## CORE GOAL
Build a Mobile-First PWA named "ValuaYa" for independent real estate agents in Mexico to generate Comparative Market Analysis (ACM) and Property Valuation reports in under 5 minutes.

## TECHNICAL STACK
- **Framework:** Next.js (App Router) or Vite + React (TypeScript)
- **PWA Integration:** Service Worker, Manifest, and Offline support (`@ducanh2912/next-pwa` or `vite-plugin-pwa`)
- **Styling & UI:** Tailwind CSS + Shadcn UI / Radix Primitives for touch-optimized mobile UI
- **Icons:** Lucide React
- **PDF Generation:** `@react-pdf/renderer` for client-side downloadable reports
- **State Management:** Zustand with `persist` middleware (LocalStorage for offline drafts)

## UI/UX & MOBILE-FIRST DESIGN RULES
1. **Touch-Friendly UI:** All primary interactive elements/buttons must have a minimum height of 48px.
2. **One-Handed Navigation:** Keep primary action triggers (e.g., "Siguiente", "Calcular", "Generar PDF") pinned at the bottom sticky action bar reachable with the thumb.
3. **Step-by-Step Flow (Stepper):**
   - **Step 1: Branding Setup** (Agent logo, name, phone, WhatsApp, primary color palette). Saved in LocalStorage.
   - **Step 2: Subject Property Details** (Location, m² land, m² construction, rooms, bathrooms, condition, amenities).
   - **Step 3: Market Comparables** (Fast input for 3 to 5 local comparable properties with price, m², photos).
   - **Step 4: Homologation Engine** (Interactive sliders to fine-tune market factors: surface, conservation, location).
   - **Step 5: Valuation Executive Summary** (3-tier price matrix + 1-click PDF download & Native WhatsApp Share).
4. **Visual Aesthetics:**
   - Background: Clean Slate Light `#F8FAFC`
   - Primary Accent: Navy Executive `#1E3A8A`
   - Secondary Accent: Emerald Success `#059669`
   - Card Surfaces: Pure White `#FFFFFF` with soft borders (`border-slate-200`) and light shadows (`shadow-sm`).

## HOMOLOGATION & CALCULATION LOGIC
- **Average Price per m²:** Compute baseline average from comparables.
- **Surface Adjustment Factor:** `(Subject_m2 / Comparable_m2)^0.12`
- **Conservation Factor Matrix:** - Excellent: 1.05 | Good: 1.00 | Regular: 0.90 | Needs Renovation: 0.80
- **Price Output Matrix:**
  - *Quick Sale Value (Liquidity):* Baseline - 5%
  - *Target Market Value (Fair Price):* Baseline Homologated Average
  - *Maximum Negotiable Value:* Baseline + 5%

## DEVELOPMENT GUIDELINES
- Always write clean, self-documenting TypeScript with strict type safety.
- Modularize components logically (`/components/ui`, `/components/valuation`, `/components/pdf`).
- Ensure native sharing integration via `navigator.share` API fallback for WhatsApp PDF sharing.
