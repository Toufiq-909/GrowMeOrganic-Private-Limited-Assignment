# Artworks Table — PrimeReact

A paginated data table built with React + PrimeReact that fetches artwork data from the Art Institute of Chicago public API. Includes a custom bulk row selection feature that works across multiple pages without prefetching.

---

## Features

- Paginated table showing 12 rows per page
- Data fetched from the [Art Institute of Chicago API](https://api.artic.edu/api/v1/artworks)
- Checkbox row selection (single and multi)
- **Custom bulk row selection** — select N rows across pages without any prefetching
- Manual deselection tracking — uncheck individual rows after a bulk select
- Accurate "Selected X rows" counter that works across all pages

---

## Tech Stack

- React 18 (with TypeScript)
- PrimeReact (DataTable, Column, Button, OverlayPanel, InputText)
- PrimeIcons
- Zod (runtime API response validation)
- Tailwind CSS (utility classes)

---

## Installation

```bash
npm install
npm install primereact primeicons zod
```

---

## Running the App

```bash
npm run dev
```

---

## How Bulk Row Selection Works

This is the most important part of the app. When a user types a number (e.g. 20) in the overlay panel and clicks **Select**:

1. `targetCount` is set to 20 — no API call is made
2. On every page load, each row's **global index** is calculated:
   ```
   globalIndex = (page - 1) * 12 + localIndex
   ```
3. If `globalIndex < targetCount` → that row is checked automatically
4. If the user manually unchecks a row, its ID is added to `manualDeselected` (a Set)
5. The total selected count is calculated logically — not by counting rows in memory:
   ```
   total = targetCount - manualDeselected.size
   ```

This means **no other page's rows are ever fetched or stored in memory**, preventing performance issues and out-of-memory errors.

---

## Project Structure

```
project/
├── src/
│   └── client/
│       └── src/
│           └── App.jsx
├── README.md
└── .gitignore

```

---



---



- The default PrimeReact select-all checkbox in the column header is hidden via CSS and `showSelectAll={false}` to avoid conflict with the custom chevron header
- Zod is used to validate and parse the API response at runtime, catching any unexpected shape changes from the API