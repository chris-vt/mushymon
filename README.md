# Mushymon

Mushymon is a Next.js web application built with React, Tailwind CSS, and Drizzle ORM. It integrates a local SQLite database and uses Leaflet for mapping features.

## Prerequisites

- Node.js (v20+)
- npm

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Dev Branch Only) Ensure the database fixture is in place:
   - The development database is located at `fixtures/dev.db`.

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Architecture & Tech Stack

- **Framework**: Next.js 16
- **Database**: SQLite (via `better-sqlite3`)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet / React-Leaflet

## Branching Strategy

- `main`: Stable release branch.
- `dev`: Development branch. All new features and DB fixtures merge here first.

## Packaging

This project is configured to be packaged as a Nix derivation for deployment via NixOS containers. (See `flake.nix`).
