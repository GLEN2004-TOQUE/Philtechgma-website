# TODO: Implement About Page Navigation with React Router

## Steps to Complete:

1. [x] **Install react-router-dom**: Run `npm install react-router-dom` to add the routing library.
2. [x] **Update src/main.tsx**: Import BrowserRouter and wrap the App component in it.
3. [x] **Refactor src/App.tsx**:
   - Import { Routes, Route } from 'react-router-dom'.
   - Import About from './components/about'.
   - Create a Home component that wraps the current static content (Navbar, Carousel, etc.).
   - Replace the static return with <Routes>: Route path="/" element={<Home />}, Route path="/about" element={<About />}.
4. [x] **Update src/components/home.tsx**:
   - Import { Link } from 'react-router-dom'.
   - In NavLinks, replace <a href={link.href}> with <Link to={link.href}>.
   - Fix the About link's href from "/src/components/about.tsx" to "/about".
   - Ensure other links use proper route paths (e.g., keep as placeholders like "/faculties").
5. [x] **Verify src/components/about.tsx**: Read the file to ensure it's a valid component; add basic structure if needed.
6. **Test the implementation**: Run `npm run dev`, navigate to localhost:5173, click "About" in navbar to confirm it routes to the About page without reload.
7. **Run type-check**: Execute `npm run type-check` to ensure no TypeScript errors.
8. **Mark complete**: Update this TODO with [x] for all steps and use attempt_completion.

Progress: Step 1 completed.
