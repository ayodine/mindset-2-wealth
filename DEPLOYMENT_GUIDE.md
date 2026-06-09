# Typeform Clone: Developer & Deployment Guide

This document serves as the guide for how this project is structured, how it communicates with the database, and how to deploy it.

## Tech Stack
- **Frontend**: React (Vite SPA)
- **Styling**: Vanilla CSS (`App.css` and `index.css`)
- **Database**: Supabase PostgreSQL

---

## The Database (Supabase)

### Row Level Security (RLS)
The most critical part of this application's database security is the Supabase RLS configuration. Since this is a client-side only React app, we expose the **Publishable `anon` Key** to the client.

To prevent unauthorized access, the `form_submissions` table has RLS enabled with write-only policies:
1. The public `anon` role is granted ONLY `INSERT` permissions on the table.
2. The RLS policy explicitly allows the `anon` role to `INSERT` new rows, but blocks all reading or editing of entries to prevent database scraping.
3. The React code submits data using `.insert()` without `.select()`, ensuring standard database interactions operate securely on public clients.

The Postgres SQL table schema setup script is saved in `supabase/create_table.sql`.

---

## How to Make Changes and Deploy

You can deploy the built application to any static web hosting provider (such as Firebase Hosting, Vercel, Cloudflare Pages, or AWS S3/CloudFront).

**Step-by-step update process:**
1. Make code changes locally (e.g., editing `src/questions.js` or `src/App.jsx`).
2. Test changes locally:
   ```bash
   npm run dev
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
   This generates the static assets in the `dist/` directory.
4. Deploy the contents of the `dist/` directory to your static hosting provider.
   *(Ensure your hosting configuration serves `index.html` for all routes to support Single Page Application client-side routing fallback)*

---

## Environment Variables

### Local Development (`.env`)
To run the app locally, you must have an `.env` file in the root directory containing:
```
VITE_SUPABASE_URL=https://[YOUR_ID].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### Production Setup
Do not commit your `.env` file to version control. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production environment variables in your hosting provider's dashboard configuration.

---

## Notable Features
- **Calendly Integration**: On the final success screen (rendered in `src/App.jsx` when `submitted === true`), there is a "Book Your Strategy Call" button. It is currently configured with a placeholder URL `https://calendly.com/YOUR_CALENDLY_HERE`. If your Calendly link changes in the future, search for that URL in `App.jsx` and replace it.
- **Dynamic Custom Country Dropdown**: The first question uses a specialized autocomplete dropdown. If a user types a country that is not in the predefined list, the code dynamically generates an option `Use "[Input]"`.
- **Wealth Roadmap Questionnaire form Branding**: A permanent branding header containing the logo (`public/M2W-favicon.svg`) and brand title lives in the top-left corner of the app, ensuring context is never lost during the multi-step form.
- **CSS Design System Architecture**: The entire application's styling uses a robust CSS Custom Properties (Variables) architecture stored in `src/index.css`.
  - **Themes**: All colors are mapped to semantic tokens like `--theme-bg` or `--theme-accent`. By default, it runs in **Dark Mode**. To switch the entire application to **Light Mode**, add `data-theme="light"` to the `<html lang="en">` tag inside `index.html`.
