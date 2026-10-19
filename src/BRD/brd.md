# Build a Premium Mobile Chrome-Style Homepage

Act as a senior frontend engineer and UI/UX designer. Build a polished, production-quality, mobile-first browser homepage using my existing React + Vite project.

I have already installed these libraries:
- `motion` — animations
- `lucide-react` — icons
- `zustand` — state management and persistence
- `@tanstack/react-query` and `axios` — data fetching
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag and drop
- `sonner` — toast notifications
- `react-icons` — additional icons

Do not reinstall packages unnecessarily. Inspect the existing project structure before making changes. Use the installed libraries and keep the project working.

## 1. Design Direction

Create a premium, modern, mobile-first Chrome-inspired start page with a beautiful liquid-glass aesthetic.

The design should feel like a combination of:
- Modern mobile browser start pages
- Apple's liquid-glass visual language
- Minimalist dashboard design
- Subtle ambient lighting and fluid animations

Use a dark theme by default, with an optional light theme.

Visual requirements:
- Translucent glass surfaces
- Background blur using `backdrop-filter`
- Thin, subtle glass borders
- Soft highlights and realistic depth
- Ambient gradient lighting
- Smooth rounded corners
- Beautiful typography and generous spacing
- Consistent design across mobile and desktop

Avoid excessive gradients, bright neon colors, clutter, oversized cards, and unnecessary animations.

## 2. Homepage Layout

Design the page in this order:

### A. Top Header
- A minimal greeting or date display.
- A settings button.
- A theme toggle.
- An optional clock displaying the current time.
- Keep the header compact on mobile.

### B. Search Bar
Create a large, elegant, rounded search bar with a liquid-glass effect.

Features:
- Search input with a search icon.
- Google search by default.
- Pressing Enter submits the query to Google.
- A clear button when text is entered.
- Optional dropdown to select Google, Bing, or DuckDuckGo.
- A microphone icon may be included as a visual control, but do not implement fake voice recognition.
- Make it easy to use with one hand on mobile.
- Open external search results in the current tab.

### C. Bookmark Grid

This is the most important section of the homepage.

Create beautiful glassmorphism bookmark cards for websites such as:
- YouTube
- Google
- Gmail
- GitHub
- Reddit
- Instagram
- ChatGPT
- X
- Wikipedia
- Spotify

Treat these as initial demo bookmarks that users can edit or remove.

Each card should include:
- Website favicon or logo.
- Website title.
- Optional subtle background accent.
- Rounded translucent glass surface.
- Smooth hover animation on desktop.
- Subtle scale and press animation on mobile.
- Accessible focus states.
- A contextual menu for edit, delete, and duplicate actions.

Use website favicons where possible. Implement a graceful fallback icon if a favicon fails to load. Do not use emojis as the primary icons for bookmarks.

Responsive layout:
- Mobile: 4 columns on wider phones and 3 columns on narrower phones when space requires it.
- Tablet: 5–6 columns where appropriate.
- Desktop: a wider grid with a sensible maximum content width.

Keep cards compact, evenly spaced, and visually balanced.

### D. Add Bookmark Button

Include an obvious but tasteful Add Bookmark card or button.

When clicked, open a modal or bottom sheet with:
- Website name.
- Website URL.
- Optional favicon URL.
- Optional custom accent color.
- Save and Cancel buttons.

Requirements:
- Validate URLs.
- Accept URLs with or without `https://`.
- Show useful validation errors.
- Prevent duplicate bookmarks when practical.
- Generate a stable unique ID for each bookmark.
- Close the modal after a successful save.
- Show a Sonner toast notification.

### E. Edit and Delete Bookmarks

Users must be able to:
- Add bookmarks.
- Edit existing bookmarks.
- Delete bookmarks.
- Duplicate bookmarks.
- Reorder bookmarks using drag and drop.
- Open a bookmark by clicking its card.
- Restore the initial demo bookmarks when desired.

Use `@dnd-kit` for drag-and-drop sorting.

Drag-and-drop must work on touch devices as well as desktop. Use suitable touch activation constraints so ordinary taps still open bookmarks.

Provide an accessible alternative for reordering if drag-and-drop is difficult to use.

### F. Folders and Categories

Allow users to create bookmark folders, rename folders, delete folders, and assign bookmarks to folders.

Provide an elegant horizontal category selector or compact folder navigation.

Include an All Bookmarks view and an option to view individual folders.

Deleting a folder should not silently delete its bookmarks. Move those bookmarks to the default collection or ask the user how to handle them.

### G. News Feed Section

Create an optional, vertically scrolling news feed below the bookmark section.

Important: Do not pretend this is Chrome's actual personalized Google Discover feed. It should be a separate, clearly implemented news section using a legitimate available source.

Requirements:
- News cards with headlines, source names, images when available, and publication dates.
- Categories such as Technology, World, Business, Science, and Sports.
- Loading skeletons.
- Error and empty states.
- Refresh control.
- Dismiss article action.
- Open the original article when clicked.
- Toggle the entire news section on or off.
- Persist selected categories and dismissed article IDs locally.
- Use React Query for fetching, caching, and refetching.
- Keep API keys out of frontend source code. If a source requires a protected key or a CORS proxy, document the required backend configuration rather than exposing credentials.

If no news API is configured, show a useful empty state explaining how to configure one. Do not fabricate real headlines or publication dates.

### H. Background Customization

Create a settings panel that allows users to customize:
- Dark and light themes.
- Background gradient presets.
- A custom wallpaper image URL.
- Glass opacity.
- Glass blur intensity.
- Card corner radius.
- Accent color.
- Animation intensity.
- Bookmark grid density.
- Search engine.
- News feed visibility.

Apply settings immediately and save them persistently.

Use CSS custom properties for theme and glass settings. Ensure text and icons remain readable at different opacity settings.

### I. Additional Features

Implement:
- A live digital clock with date.
- A recently visited section only if actual visit data can be collected by this website; do not fabricate browser history.
- A compact quick-actions menu.
- A reset-to-default option with a confirmation dialog.
- A helpful empty state when all bookmarks are deleted.
- Toast notifications for important actions.
- Keyboard accessibility.
- Reduced-motion support.
- Responsive modal and bottom-sheet behavior.

## 3. Liquid Glass Implementation

Build a reusable CSS-based glass system.

Use:
- `backdrop-filter: blur(...)`
- `-webkit-backdrop-filter`
- Translucent backgrounds
- Subtle border highlights
- Inset shadows
- Soft ambient background gradients
- CSS custom properties

Create reusable classes or components for:
- Glass panels
- Glass buttons
- Glass bookmark cards
- Glass search input
- Glass modals
- Glass settings panels

Do not add another UI or animation library just for glass effects.

Provide a fallback background for browsers that do not support `backdrop-filter`.

Make the effect look attractive over both gradients and custom wallpapers.

## 4. Animations

Use Motion for React from the `motion` package.

Implement:
- Smooth initial page entrance.
- Staggered bookmark card appearance.
- Spring-based card interactions.
- Subtle hover and tap feedback.
- Animated modal and bottom-sheet transitions.
- Layout transitions when bookmarks are reordered or removed.
- Smooth category switching.
- Subtle background movement, if appropriate.

Animations should feel premium and responsive, not distracting.

Respect `prefers-reduced-motion` and avoid continuous heavy animations that drain mobile battery.

Do not animate every element constantly.

## 5. State Management and Local Storage

Use Zustand with its `persist` middleware.

Persist:
- Bookmarks.
- Folders.
- Bookmark ordering.
- Theme.
- Background configuration.
- Glass appearance settings.
- Search engine preference.
- News feed preferences.
- Dismissed news article IDs.

Requirements:
- All changes should save automatically.
- Data must survive page reloads and browser restarts.
- Use a versioned persistence strategy and provide migrations if the schema changes.
- Handle malformed or missing persisted data safely.
- Avoid overwriting valid stored user data with demo data on every render.
- Seed demo bookmarks only on the first visit or when explicitly requested.
- Provide a reset option with confirmation.
- Keep state updates predictable and avoid unnecessary rerenders.

Use `localStorage` for ordinary preferences and bookmark metadata. If large wallpaper files are supported, prefer IndexedDB or store image URLs instead.

## 6. Architecture

Use a clean, modular structure similar to:

src/
  components/
    Header.jsx
    SearchBar.jsx
    BookmarkGrid.jsx
    BookmarkCard.jsx
    BookmarkEditor.jsx
    FolderNavigation.jsx
    NewsFeed.jsx
    NewsCard.jsx
    SettingsPanel.jsx
    GlassModal.jsx
    ConfirmDialog.jsx
  store/
    useBookmarkStore.js
    useSettingsStore.js
  hooks/
    useClock.js
    useNews.js
  services/
    newsService.js
  styles/
    globals.css
    glass.css
    animations.css
  utils/
    validateUrl.js
    favicon.js
  App.jsx
  main.jsx

You may adjust this structure if the existing project already has a good architecture.

Use reusable components and keep business logic separate from presentation.

Do not put the entire application into one giant component.

## 7. Technical Requirements

- React functional components and hooks.
- JavaScript is acceptable; follow the existing project language.
- Use Vite as the build tool.
- Use Motion for React for animations.
- Use Zustand with persistence for user data.
- Use React Query for news fetching.
- Use Lucide React for interface icons.
- Use dnd-kit for sortable bookmarks.
- Use Sonner for toast messages.
- Prefer plain CSS or the project's existing styling system.
- Avoid unnecessary dependencies.
- Avoid fake buttons and nonfunctional controls.
- Use semantic HTML and accessible labels.
- Validate user-provided URLs before opening them.
- Add sensible security protections for external links.
- Keep all layouts responsive.
- Do not introduce a backend unless a feature genuinely requires one.
- Do not claim the website can replace Chrome's native mobile New Tab page or access Google's private personalized Discover feed.

## 8. Performance

Optimize for mid-range Android phones.

- Keep animations GPU-friendly.
- Avoid unnecessary rerenders.
- Use lazy loading for news images.
- Prevent layout shifts.
- Keep the initial page lightweight.
- Avoid excessive backdrop-filter layers.
- Use sensible image fallbacks.
- Ensure smooth scrolling and touch interactions.
- Keep dependencies and CSS manageable.

## 9. Implementation Workflow

Follow this workflow:

1. Inspect the existing project files and dependencies.
2. Understand the current entry point and styling setup.
3. Implement the homepage and reusable glass components.
4. Implement the Zustand stores and persistent settings.
5. Implement bookmark creation, editing, deletion, duplication, folders, and sorting.
6. Implement search submission.
7. Implement background and theme customization.
8. Implement the optional news feed with honest loading, error, and unconfigured states.
9. Add animations and responsive behavior.
10. Run the available lint, type-check, and build commands.
11. Fix errors and test the major interactions.
12. Provide a concise summary of the files changed and any configuration needed.

Do not stop after producing a plan or mockup. Actually implement the application in the existing project.

Do not replace working project files unnecessarily. Do not leave major features as TODOs or placeholder buttons.

## 10. Final Quality Standard

The final result should look like a premium mobile browser start page rather than a generic admin dashboard.

Prioritize, in order:
1. Beautiful liquid-glass bookmark cards.
2. Excellent mobile layout and touch interactions.
3. Fully functional bookmark management.
4. Reliable local persistence.
5. Smooth but restrained animations.
6. Useful customization settings.
7. An optional news feed that uses a real, configurable source.

Make sensible design decisions without asking me to approve every detail. Start by inspecting the project, then implement the complete experience.