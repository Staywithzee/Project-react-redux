# ShopReact — Mini E-Commerce Store

A full-featured single-page e-commerce application built with React 18, Redux Toolkit, and RTK Query.

## Team Members

- [FILL IN]

## Live URL

[FILL IN after deploy]

## Features

- Browse products with live search and category filter tabs
- Product detail page with full information
- Shopping cart with quantity stepper and real-time totals
- Checkout form with validation (name, email, address, 16-digit card)
- Admin panel: view, add, edit, and delete products (full CRUD)
- Loading skeletons with shimmer animation for all async states
- Error message component shown on API failure
- Cart item count badge in the navbar, persists across navigation
- Responsive CSS Grid layout (auto-fill/auto-fit)

## Tech Stack

- **React 18** — Functional components only
- **Redux Toolkit** — `cartSlice`, `uiSlice`, `createSelector`
- **RTK Query** — `createApi` for all async product endpoints
- **React Router v6** — Client-side routing with `<Link>` and `useNavigate`
- **CSS Modules** — Scoped styles per component, no global stylesheet
- **Vite** — Fast development server and build tool
- **Vercel** — Deployment target

## Local Setup

```bash
git clone <repo>
npm install
cp .env.example .env   # then fill in your mockapi URL
npm run dev
```

## Environment Variables

Create a `.env` file (never commit it):

```
VITE_API_URL=https://your-mockapi-url.mockapi.io/api/v1
```

## API

**MockAPI.io** — endpoint `/products`, base URL stored in `VITE_API_URL`.

Product schema:

```json
{
  "id": "string (auto)",
  "name": "string",
  "price": "number",
  "category": "string",
  "description": "string",
  "imageUrl": "string",
  "stock": "number"
}
```

## Routes

| Path | Page |
|------|------|
| `/` | Product list with search & filter |
| `/products/:id` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form |
| `/admin` | Product management table |
| `/admin/products/new` | Add product form |
| `/admin/products/:id/edit` | Edit product form |
| `*` | 404 Not Found |
