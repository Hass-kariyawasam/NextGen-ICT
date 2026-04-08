# Berry Vue Admin Template - Visual Architecture

## Component Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           App (Root Context)                               │
│                   ├─ AuthContext (User + Auth)                             │
│                   ├─ CartContext (Cart + Enrollments)                      │
│                   └─ ThemeContext (Dark/Light mode)                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                          DashboardLMS (Main Layout)                        │
│                              (src/pages/)                                   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ TopBar                                                              │   │
│  │ ├─ MenuButton (mobile)                                           │   │
│  │ ├─ PageTitle (dynamic)                                           │   │
│  │ ├─ ExamCountdownWidget (Firestore listener)                     │   │
│  │ ├─ CartBadge (Context state)                                    │   │
│  │ └─ UserMenu (Avatar + dropdown)                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ Sidebar                                                             │   │
│  │ ├─ SidebarHeader (Logo + Avatar)                                 │   │
│  │ ├─ NavigationList                                                │   │
│  │ │  ├─ NavItem[Dashboard]  (active highlight)                    │   │
│  │ │  ├─ NavItem[Courses]                                          │   │
│  │ │  ├─ NavItem[My Courses]                                       │   │
│  │ │  ├─ NavItem[Resources]                                        │   │
│  │ │  ├─ NavItem[Online]                                           │   │
│  │ │  ├─ NavItem[Practical]                                        │   │
│  │ │  ├─ NavItem[Cart]                                             │   │
│  │ │  └─ NavItem[Settings]                                         │   │
│  │ ├─ Spacer                                                        │   │
│  │ └─ LogoutButton                                                  │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ Main Content (Routes)                                               │   │
│  │                                                                     │   │
│  │  <Route index → DashboardHome                                     │   │
│  │  ├─ WelcomeCard                                                  │   │
│  │  ├─ Dashboard Grid (4 cols → responsive)                        │   │
│  │  │  ├─ ExamCountdownWidget  (animated countdown)               │   │
│  │  │  ├─ NoticesWidget        (scrollable list)                  │   │
│  │  │  ├─ ScheduleWidget       (events)                           │   │
│  │  │  └─ QuickStatsCard       (metrics)                          │   │
│  │  └─ My Courses Grid                                             │   │
│  │     └─ CourseCard[] (mapped, each with hover)                  │   │
│  │                                                                 │   │
│  │  <Route /courses → CoursesPage                                 │   │
│  │  ├─ Filters (category, price, rating)                          │   │
│  │  ├─ SortOptions                                                │   │
│  │  └─ CourseCard[] Grid                                          │   │
│  │                                                                 │   │
│  │  <Route /my-courses → MyCoursesPage                            │   │
│  │  └─ Enrolled CourseCard[] Grid                                 │   │
│  │                                                                 │   │
│  │  <Route /course/:id → CourseViewerPage                         │   │
│  │  ├─ VideoPlayer                                                │   │
│  │  ├─ LessonsList (sidebar)                                      │   │
│  │  ├─ LessonNotes                                                │   │
│  │  └─ CourseMaterials                                            │   │
│  │                                                                 │   │
│  │  <Route /cart → CartPage                                       │   │
│  │  ├─ CartItems[]                                                │   │
│  │  ├─ PricingBreakdown                                           │   │
│  │  └─ CheckoutButton                                             │   │
│  │                                                                 │   │
│  │  <Route /settings → SettingsPage                               │   │
│  │  ├─ ProfileForm                                                │   │
│  │  ├─ PreferencesForm                                            │   │
│  │  └─ SecuritySettings                                           │   │
│  │                                                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ BottomNavigation (Mobile Only)                                      │   │
│  │  [Home] [Courses] [My] [Cart] [Profile]                           │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ FloatingCart (Fixed Action Button)                                  │   │
│  │  [🛒 3 items]                                                      │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌─────────────────┐
│    Firestore    │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │ onSnapshot listeners        │
    │ (Real-time updates)         │
    └────┬────────────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │  State Management (Context API)       │
    │  ├─ AuthContext                      │
    │  │  └─ user, userData, Auth methods │
    │  └─ CartContext                      │
    │     └─ cart, enrollments, methods  │
    └────┬──────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │  Component State (useState/useMemo)   │
    │  ├─ currentPage                       │
    │  ├─ activeRoute                       │
    │  ├─ mobileMenuOpen                    │
    │  └─ filters/sorting                   │
    └────┬──────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │  UI Rendering (JSX)                   │
    │  ├─ TopBar (subscribes to Auth)      │
    │  ├─ Sidebar (uses routing)           │
    │  ├─ Main Content (maps data)         │
    │  └─ Bottom Nav (syncs with route)    │
    └──────────────────────────────────────┘
```

---

## Responsive Breakpoint Visual

```
Mobile (xs) - < 600px
┌─────────────────────────┐
│ TopBar (compact)        │
├─────────────────────────┤
│                         │
│  [Full Width Content]   │
│  Single Column Grid     │
│                         │
├─────────────────────────┤
│ BottomNav (5 items)     │
└─────────────────────────┘


Tablet (sm) - 600-959px
┌─────────────────────────┐
│ TopBar                  │
├─────────────────────────┤
│                         │
│  [Full Width Content]   │
│  2 Column Grid          │
│                         │
└─────────────────────────┘


Desktop (md) - 960-1279px
┌────────────┬────────────────────────────┐
│ TopBar (fixed)                          │
├────────────┬────────────────────────────┤
│ Sidebar    │  Main Content              │
│ (96px)     │  3 Column Grid             │
│ (visible)  │  Max-width: 1600px         │
│            │                            │
└────────────┴────────────────────────────┘


Large Desktop (lg) - ≥ 1280px
┌────────────┬────────────────────────────┐
│ TopBar (fixed)                          │
├────────────┬────────────────────────────┤
│ Sidebar    │  Main Content              │
│ (96px)     │  4 Column Grid             │
│ (visible)  │  Max-width: 1600px         │
│            │  Centered, spacious        │
│            │                            │
└────────────┴────────────────────────────┘
```

---

## Color Palette System

```
PRIMARY BRAND (Deep Blue)
┌─────────────────────┐
│ --lms-primary-dark  │  #003385  ← Darkest (hover states)
│ #0052cc     ●▌     │ ← Main (buttons, active nav, badges)
│ --lms-primary-light │  #0066ff  ← Lightest (gradients)
└─────────────────────┘

ACCENT (Orange/Amber)
┌─────────────────────┐
│ --lms-accent        │ #ff8c00   ► Secondary highlights
│ --lms-accent-light  │ #ffaa33   ► Light variant
└─────────────────────┘

FUNCTIONAL (Status Colors)
┌─────────────────────┐
│ ✓ Success           │ #10b981   (Approved courses)
│ ⚠ Warning           │ #f59e0b   (Pending enrollment)
│ ✗ Error             │ #ef4444   (Failed payment)
└─────────────────────┘

NEUTRALS (Grayscale)
┌──────────────────────────┐
│ Surface (Cards/Panels)   │ #ffffff
│ Background               │ #f8f9fa
│ Border (Subtle)          │ #e5e7eb
│ Border (Hover)           │ #d1d5db
│ Text Primary             │ #1f2937
│ Text Secondary           │ #4b5563
│ Muted/Disabled           │ #6b7280
└──────────────────────────┘
```

---

## Layer Structure (Z-Index)

```
┌─ z-1300+ : Modals, Dialogs
│
├─ z-1200+ : Popovers, Menus
│
├─ z-1100  ◄─ TopBar (AppBar default)
│     │     └─ Exam Countdown Badge
│     │     └─ Cart Badge
│     │     └─ User Dropdown
│     │
├─ z-1000  ◄─ Sidebar Drawer (mobile)
│
├─ z-900   ◄─ Floating Cart Button
│
├─ z-100   ◄─ Bottom Navigation
│
└─ z-0    ◄─ Main Content Area
     │     └─ Cards/Panels
     │     └─ Courses Grid
     │     └─ Page Content
```

---

## Component Relationship Map

```
Context Providers
    ↓
DashboardLMS (Layout Container)
    │
    ├─► TopBar
    │   ├─► ExamCountdownWidget
    │   │   └─ (Firestore listener)
    │   ├─► CartBadge
    │   │   └─ (CartContext)
    │   └─► UserMenu
    │       └─ (AuthContext)
    │
    ├─► Sidebar
    │   ├─► NavItem[]
    │   │   └─ (Router location)
    │   └─► LogoutButton
    │       └─ (AuthContext)
    │
    ├─► Main Content (Routes)
    │   ├─► DashboardHome
    │   │   ├─► WelcomeCard
    │   │   ├─► ExamCountdownWidget
    │   │   ├─► NoticesWidget
    │   │   ├─► ScheduleWidget
    │   │   └─► CourseCard[] Grid
    │   │       └─ (CartContext)
    │   │
    │   ├─► CoursesPage
    │   │   └─► CourseCard[] Grid
    │   │       ├─ (Firestore query)
    │   │       └─ (CartContext)
    │   │
    │   ├─► CourseViewerPage
    │   │   ├─► VideoPlayer
    │   │   ├─► LessonsList
    │   │   └─► NotesPanel
    │   │
    │   └─► CartPage
    │       ├─► CartItem[]
    │       ├─► PricingBreakdown
    │       └─ (CartContext)
    │
    ├─► BottomNav (Mobile)
    │   └─ (Router navigation)
    │
    └─► FloatingCart
        └─ (CartContext)
```

---

## Styling Cascade

```
global.css (Base)
    ↓
index.css (Resets)
    ↓
lms.css (Theme Variables + Component Classes)
    │
    ├─ :root { --lms-* variables }
    ├─ .lms-panel (base panels)
    ├─ .lms-card-modern (cards)
    ├─ .lms-course-title (typography)
    └─ .lms-scroll-list (utilities)
    ↓
App.css (Page-specific styles)
    ↓
Component sx prop (Inline MUI styles)
    │
    ├─ Breakpoint arrays: { xs, sm, md, lg }
    ├─ Color variables: var(--lms-*)
    ├─ Theme overrides
    └─ Dynamic styles (on hover, active, etc.)
    ↓
Framer Motion (Animation)
    └─ whileHover, animate, transition
```

---

## Performance Optimization Flow

```
Bundle Size Reduction
├─ Code Splitting (React.lazy on routes)
├─ CSS Variables (reusable theme)
└─ Tree-shaking (unused code removal)

Runtime Performance
├─ useMemo() (computed values)
├─ useCallback() (prevent re-renders)
├─ Firestore listeners (not polling)
└─ Lazy loading (images, components)

Mobile Optimization
├─ Responsive images
├─ Bottom nav on mobile only
├─ Drawer instead of always-visible sidebar
└─ Reduced animation complexity on mobile
```

---

## Authentication & Authorization Flow

```
User Visits /dashboard-lms
    ↓
AuthContext check: Is user logged in?
    │
    ├─ NO → Redirect to /signin
    │
    └─ YES → Load user data from Firestore
              ├─ userData collection
              ├─ user profile
              └─ enrollments list
              ↓
        Render DashboardLMS
        ├─ Show user name in TopBar
        ├─ Show avatar in Sidebar
        ├─ Load personalized content
        └─ Show "My Courses" based on enrollments
```

---

## Data Fetching Strategy

```
Real-Time Data (onSnapshot)
├─ Settings (Exam date)
│  └─ Updates immediately on Firebase admin change
├─ Courses (Listed items)
│  └─ Real-time filter updates
└─ Enrollments (User courses)
   └─ Updates when enrollment status changes

Periodic Updates (intervals)
├─ Exam countdown (re-calculate every 60 seconds)
└─ User session validation (every 5 minutes)

On-Demand (queries)
├─ Course details (on page load)
├─ User profile (on settings page)
└─ Payment history (on order history)
```

---

## Mobile Navigation Flow

```
Mobile User Behavior
    ↓
┌─────────────────────────┐
│ User taps menu [☰]      │
│ (TopBar hamburger)      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Sidebar Drawer slides   │
│ in from left (modal)    │
│                         │
│ Select nav item         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Drawer closes auto      │
│ Route changes           │
│ Page content updates    │
└─────────────────────────┘

Alternatively:
┌─────────────────────────┐
│ User taps BottomNav     │
│ (fixed at bottom)       │
│ [Home][Courses][My]...  │
└────────┬────────────────┘
         │ (direct navigation)
         ▼
┌─────────────────────────┐
│ Page updates instantly  │
│ Active tab highlights   │
└─────────────────────────┘
```

---

## Theme Switching Architecture (Ready for Implementation)

```
Current: Light Theme Only

Future: With ThemeContext

┌──────────────────────────┐
│  ThemeContext            │
│  ├─ mode: 'light'/'dark' │
│  ├─ toggleTheme()        │
│  └─ themeVars            │
└────────┬─────────────────┘
         │
    ┌────▼─────────────┐
    │ lms.css          │
    │ .lms-shell       │
    │ [data-theme]     │
    └─────────────────┘
         │
    ┌────▼─────────────┐
    │ CSS Variable     │
    │ Swap on toggle   │
    │                  │
    │ Light:           │
    │ --lms-bg: white  │
    │ --lms-text: dark │
    │                  │
    │ Dark:            │
    │ --lms-bg: #1f    │
    │ --lms-text: white│
    └─────────────────┘
```

---

## Key Numbers & Metrics

```
Desktop Sidebar
  Width: 96px
  Min height: 100vh

Top Bar
  Height: 80px (mobile) / 100px (desktop)
  Z-index: 1100

Content Container
  Max width: 1600px
  Padding: 24-56px (responsive)

Cards & Panels
  Border radius: 12px
  Padding: 16-24px
  Gap between items: 16-48px (responsive)

Typography
  Heading: 1rem-2.5rem (responsive)
  Body: 0.875rem-1rem
  Helper: 0.75rem-0.875rem

Shadows
  Light: 0 2px 8px rgba(0,0,0,0.08)
  Heavy: 0 4px 16px rgba(0,0,0,0.12)

Spacing Unit: 16px (MUI default)
  1 = 16px
  2 = 32px
  3 = 48px
  3.5 = 56px
  4 = 64px
```

---

## Accessibility Features

```
✓ Semantic HTML (header, nav, main, section)
✓ ARIA labels on icons
✓ Keyboard navigation (Tab, Enter, Escape)
✓ High contrast text (WCAG AAA)
✓ Focus indicators (visible on keyboard nav)
✓ Alt text on images
✓ Screen reader support (MUI components)
✓ Color not the only indicator (icons + text)
✓ Skip links (to main content)
✓ Form labels linked to inputs
```

---

## Feature Flags & Extensions Ready

```
Ready to Add:
├─ Dark Mode (ThemeContext setup)
├─ Multi-language (i18n structure)
├─ Role-based access (Auth middleware)
├─ Advanced search (filter enhancement)
├─ User preferences (saved in Firestore)
├─ Push notifications (Firebase Cloud Messaging)
├─ Advanced analytics (Google Analytics integration)
├─ Social sharing (course links)
├─ Wishlist feature (CartContext extension)
└─ Progress tracking (per-lesson metrics)
```

---

This visual architecture serves as your **roadmap** for understanding, maintaining, and extending the Berry Vue-style admin dashboard! 🎨
