# TODO: Convert Project to TypeScript

## Completed Steps
- [x] Install TypeScript via `npm install --save-dev typescript`
- [x] Create `tsconfig.json` with React and Vite-compatible configuration
- [x] Create `tsconfig.node.json` for Vite config resolution
- [x] Rename `vite.config.js` to `vite.config.ts` and add types if necessary
- [x] Rename and convert `src/main.jsx` to `src/main.tsx` with TypeScript types
- [x] Rename and convert `src/App.jsx` to `src/App.tsx` with TypeScript types
- [x] Rename and convert `src/hooks/use-dark-mode.js` to `src/hooks/use-dark-mode.ts` with TypeScript types
- [x] Rename and convert `src/components/Navbar.jsx` to `src/components/Navbar.tsx` with TypeScript types
- [x] Rename and convert `src/components/Carousel.jsx` to `src/components/Carousel.tsx` with TypeScript types
- [x] Rename all other `src/components/*.jsx` to `.tsx` (basic rename, types not added yet)

## Pending Steps
- [x] Add TypeScript types to Footer.tsx
- [x] Add TypeScript types to remaining components: HistorySection.tsx, CampusSection.tsx, Dropdown.tsx, Logo.tsx, NavLinks.tsx
- [] Update `eslint.config.js` to support TypeScript files (`.ts`, `.tsx`)
- [] Update `package.json` scripts if needed (e.g., add TypeScript checks)
- [] Test the project: Run `npm run dev` and verify no compilation errors
- [] Run `npm run lint` to ensure no linting issues
- [] Build the project: `npm run build` to check for TypeScript errors

## Notes
- All conversions will add basic types (e.g., React.FC for components, proper prop interfaces).
- Ensure imports are updated if any path changes occur due to renames.
- After all renames, Vite should automatically handle TS compilation.
