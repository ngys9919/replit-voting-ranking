# SEO Meta Tag Analyzer - Design Guidelines

## Design Approach
**System:** Material Design with developer tool aesthetics (inspired by Chrome DevTools, Linear)
**Rationale:** Utility-focused application requiring clear information hierarchy, status indication, and technical precision. Users are SEO professionals/developers who value efficiency and clarity over decorative elements.

## Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** Font weight 600-700, sized hierarchically (text-2xl for page title, text-lg for section headers, text-base for card titles)
- **Body Text:** Font weight 400, text-sm for metadata and descriptions
- **Code/Tags:** Mono font (font-mono) for displaying actual meta tag content

## Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Container: max-w-7xl mx-auto with px-4 md:px-8
- Section spacing: py-8 to py-12
- Card padding: p-6
- Component gaps: gap-4 to gap-6

## Core Layout Structure

### Header Section
- Fixed top bar with app title/logo on left
- Clean, minimal header (h-16) with subtle border bottom
- No hero image needed - this is a tool, not marketing

### URL Input Area
- Prominent centered input section below header
- Large input field (h-14) with button inline or adjacent
- Supporting text: "Enter any URL to analyze SEO meta tags" (text-sm)
- Input width: max-w-2xl centered

### Results Dashboard (2-Column Desktop Layout)
**Left Column (60% width):**
- Meta Tags List with validation status
- Each tag as expandable card showing: tag name, current value, character count, validation status
- Group tags logically: Essential (title, description), OpenGraph, Twitter, Technical (canonical, robots)

**Right Column (40% width, sticky):**
- Google Search Preview card
- Facebook Preview card  
- Twitter Preview card
- Stacked vertically with gap-6

### Mobile Layout
- Single column stack: Input → Preview Cards → Meta Tags List
- Preview cards collapse to full width

## Component Library

### Input Component
- Large search-style input with rounded corners (rounded-lg)
- Placeholder text: "https://example.com"
- Action button: "Analyze SEO" (primary CTA styling)
- Loading state indicator when fetching

### Meta Tag Cards
- White cards with border, rounded-lg, shadow-sm
- Header: Tag name (font-semibold) + status indicator (badge)
- Content area: Actual tag value in subtle container with mono font
- Footer: Character count + validation feedback text
- Status badge: Small pill showing "Missing", "Present", "Optimal" (positioned top-right)

### Preview Cards (Critical Visual Fidelity)
**Google Search Preview:**
- Exact dimensions mimicking Google result snippet
- Blue underlined title link (text-xl)
- Green URL breadcrumb (text-sm)
- Gray description text (text-sm, max 2 lines)
- Subtle border and light background treatment

**Facebook Preview:**
- Card layout: Large image placeholder area (16:9 ratio, bg-gray-200 if no image)
- Title (font-semibold, text-lg)
- Description (text-sm, truncated)
- Domain name in subtle text
- Matches Facebook's card aesthetic

**Twitter Preview:**
- Summary card with large image layout
- Compact title and description
- Site attribution
- Follows Twitter card design patterns

### Validation Feedback Section
- Best practices panel below each tag
- Icon + text recommendations (e.g., "Title should be 50-60 characters")
- Use icons from Heroicons CDN for status indicators

## Information Architecture

**Tag Organization:**
1. **Essential SEO** (always visible first)
   - Title tag
   - Meta description
   
2. **Open Graph Tags**
   - og:title, og:description, og:image, og:url, og:type

3. **Twitter Card Tags**
   - twitter:card, twitter:title, twitter:description, twitter:image

4. **Technical SEO**
   - Canonical URL
   - Robots meta tag
   - Viewport

## Interaction Patterns
- Expandable/collapsible tag cards for detailed view
- Copy-to-clipboard buttons for tag values (small icon button)
- Real-time character counters that update as you view
- Smooth scroll to anchor when clicking validation issues

## Empty & Loading States
- **Before Analysis:** Show example preview cards with placeholder content
- **Loading:** Skeleton screens for preview cards, spinner in input button
- **No Results:** Clear messaging with suggestions to try another URL
- **Error State:** Friendly error message if URL fetch fails

## Responsive Behavior
- Desktop (lg): 2-column layout with sticky previews
- Tablet (md): 2-column with scrolling previews
- Mobile: Full stack, preview cards at top for immediate feedback

## Icons
**Library:** Heroicons (via CDN)
- CheckCircle: Optimal status
- ExclamationTriangle: Warning/improvement needed
- XCircle: Missing/error
- Clipboard: Copy functionality
- ArrowPath: Refresh/analyze again

## Key Visual Principles
- **Scannable hierarchy:** Users should instantly see validation status
- **Professional restraint:** Clean, focused design without decoration
- **Information density:** Pack useful data without overwhelming
- **Instant feedback:** Visual status indicators require no reading
- **Trust through accuracy:** Preview cards must look authentic to their platforms

This is a tool, not a landing page - prioritize clarity, speed, and precision over visual flair.