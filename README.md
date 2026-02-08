# RCA Stock Management System

Pixel-perfect TypeScript implementation of the Figma design for the RCA Stock Management System.

## 🎨 Design Source

- **Figma Channel**: y516l47c
- **Design System**: Extracted directly from Figma with exact pixel values, colors, typography, and spacing

## ✨ Features

- **Login Page**: Complete authentication interface with email/password fields
- **Dashboard**: Comprehensive stock management dashboard with:
  - Header with search, notifications, and user profile
  - Sidebar navigation
  - Statistics cards (Stock Items, Low Items, Damaged, Monthly Inflow)
  - Recent transactions list
  - Stock overview table with status indicators
  - Interactive charts (Bar chart and Pie chart)

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with CSS Variables for design tokens
- **Fonts**: Bricolage Grotesque & Poppins (from Google Fonts)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🎯 Design Accuracy

This implementation matches the Figma design with:

- ✅ Exact spacing (all px values from Figma)
- ✅ Precise colors (hex codes with opacity values)
- ✅ Typography (font families, sizes, weights, line-heights, letter-spacing)
- ✅ Border radius values
- ✅ Component hierarchy matching Figma layers
- ✅ Interactive states (hover, active, focus)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # Top navigation header
│   ├── Sidebar.tsx      # Left sidebar navigation
│   ├── StatsCards.tsx   # Statistics cards
│   ├── RecentTransactions.tsx
│   ├── StockOverview.tsx
│   └── Charts.tsx       # Bar and Pie charts
├── pages/               # Page components
│   ├── LoginPage.tsx
│   └── Dashboard.tsx
├── styles/              # Global styles
│   ├── variables.css    # Design tokens (colors, typography, spacing)
│   └── global.css       # Global styles and resets
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🎨 Design Tokens

All design specifications are defined in `src/styles/variables.css`:

- **Colors**: Primary, secondary, status colors, chart colors
- **Typography**: Font families, sizes, weights, line-heights
- **Spacing**: Exact pixel values from Figma
- **Border Radius**: All radius values
- **Layout**: Header height, sidebar width

## 🔧 Development

The project uses:
- **TypeScript** for type safety
- **CSS Modules** for component styling
- **CSS Variables** for theming
- **React Hooks** for state management

## 📝 Notes

- All dimensions, colors, and typography match the Figma design exactly
- Interactive states (hover, active, focus) are implemented
- The design is responsive-ready (can be extended for mobile)
- Icons are represented with SVG placeholders (replace with actual icons from Figma)

## 🚀 Next Steps

1. Replace SVG placeholders with actual icons from Figma
2. Add image assets from Figma design
3. Implement routing (React Router) for navigation
4. Add form validation
5. Connect to backend API
6. Add responsive breakpoints for mobile devices

## 📄 License

This project is created for RCA Stock Management System.

