

# Ultra-Minimalist Redesign for Reed Digital Group

A complete site redesign with creative, out-of-the-box features that maintain extreme minimalism while showcasing what you can build for clients.

---

## Core Design Principles

- **Pure white background** throughout the entire site
- **No CTA buttons in hero** - let the work speak for itself; customers will find Contact naturally
- **Monospace typing animation** using JetBrains Mono font for that authentic keyboard feel
- **No stats** - they can seem inauthentic
- **Tailored for 3 audiences**: small business, mid-size business, and government

---

## Out-of-the-Box Ideas

### 1. Interactive Code Typing Hero
Instead of just animating words, show a full code snippet being typed in real-time:
```text
const yourBusiness = {
  website: "professional",
  experience: "seamless",
  results: "exceptional"
};
```
This immediately demonstrates technical capability without being flashy.

### 2. Client Logo Carousel with Category Filters
A horizontal scrolling marquee with three filter tabs: "Small Business" | "Enterprise" | "Government"
- Clicking each filter smoothly transitions to logos from that category
- Shows you serve diverse clients without cluttering the page

### 3. Live Project Preview Window
A minimalist browser mockup that cycles through screenshots of your actual projects
- Clean Safari-style window frame
- Auto-transitions every 5 seconds
- No buttons, no descriptions - just pure visual

### 4. Invisible Grid Navigation
Subtle keyboard navigation hint at bottom of hero
- Shows: "Press [1] Services  [2] Work  [3] Contact"
- Adds a developer-focused Easter egg feel
- Optional - visitors can still scroll normally

### 5. Single-Line Process
Instead of a 5-step grid, show process as one elegant horizontal line:
```text
Discover ─────── Design ─────── Develop ─────── Deploy
```

### 6. Ambient Cursor Trail
Very subtle: the cursor leaves a faint, fading trail as it moves
- Barely noticeable but adds polish
- Disappears on mobile

### 7. Contact as Just Text
No buttons, no forms in view. Just:
```text
Ready when you are.
hello@reeddigitalgroup.com
```
Pure minimalism - the confident approach.

---

## Section-by-Section Plan

### Header
- Your actual logo image (from reeddigitalgroup.com) on the left
- Simple text navigation links on the right
- No background until scroll, then subtle white with shadow
- Remove "Capability Statement" from main nav - move to footer

### Hero Section
- Large monospace typing animation in center
- Types: `We build websites.` then deletes and types `We build applications.` etc.
- **JetBrains Mono** font for the animated text
- Single tagline below: "Digital solutions for businesses that demand quality."
- **No buttons** - just the scroll indicator
- Blinking cursor after typed text

### Client Carousel (New)
- Horizontal infinite scroll of grayscale client/partner logos
- Very subtle, no labels
- Shows established credibility without words

### Services Section
- Clean 2-column layout
- Left: Service name
- Right: One-sentence description
- Simple hover underline effect
- Remove icons entirely

### Work Section
- Keep the minimal list format
- Project name, category, year
- Hover reveals description inline
- Arrow on far right

### Process Section
- Single horizontal line with 4 dots: Discover → Design → Develop → Deploy
- Descriptions appear on hover/tap
- Extremely minimal

### Testimonials Section
- Keep the carousel
- Larger quote typography
- Remove navigation arrows - use auto-advance or dot indicators only

### Contact Section
- **White background** (not dark inverted)
- Simple headline: "Let's talk."
- Email address as a clean link
- Phone number below
- Location at bottom
- No buttons - clicking email opens mail client

### Footer
- Logo on left
- Links in center
- Capability Statement link here
- Copyright on right

---

## Technical Changes

### Files to Modify:

1. **index.html** - Add JetBrains Mono font from Google Fonts

2. **src/index.css**
   - Add `.font-mono` for JetBrains Mono
   - Update typing cursor animation
   - Remove any dark section styles
   - Add subtle hover effects

3. **tailwind.config.ts**
   - Add `mono: ["JetBrains Mono", "monospace"]` to fontFamily

4. **src/components/Header.tsx**
   - Add actual logo image
   - Left-align logo, right-align nav
   - Simplify mobile menu

5. **src/components/HeroSection.tsx**
   - Full typing animation with delete/retype
   - Monospace font for animated portion
   - Remove all buttons
   - Keep only scroll indicator

6. **src/components/ClientCarousel.tsx** (New)
   - Infinite horizontal scroll
   - Placeholder logos (or real ones if you have them)
   - CSS animation, no JS library needed

7. **src/components/ServicesSection.tsx**
   - 2-column text-only layout
   - Remove icons
   - Add hover underline

8. **src/components/WorkSection.tsx**
   - Keep current minimal list format
   - Minor refinements

9. **src/components/ProcessSection.tsx**
   - Horizontal single-line format
   - 4 steps with dots
   - Hover reveals descriptions

10. **src/components/AboutSection.tsx**
    - Remove stats grid entirely
    - Keep text content
    - Add certifications line

11. **src/components/TestimonialsSection.tsx**
    - Remove arrow buttons
    - Add auto-advance (every 6 seconds)
    - Keep dot indicators

12. **src/components/ContactSection.tsx**
    - White background
    - Remove buttons
    - Just text: headline, email, phone, location

13. **src/components/Footer.tsx**
    - Minor layout adjustments

14. **src/pages/Index.tsx**
    - Add ClientCarousel component

---

## Typography

| Element | Font | Details |
|---------|------|---------|
| Logo | Your actual logo image | From reeddigitalgroup.com |
| Headings | Inter | Weight 600, clean sans-serif |
| Body | Inter | Weight 400 |
| **Typing animation** | **JetBrains Mono** | Monospace for keyboard effect |
| Navigation | Inter | Weight 500, uppercase, tracked |

---

## Color Palette

| Element | Color |
|---------|-------|
| Background | `#FFFFFF` (pure white) |
| Primary text | `#0F0F0F` (near black) |
| Secondary text | `#6B7280` (gray) |
| Borders | `#E5E7EB` (light gray) |
| Hover accent | `#0F0F0F` (underlines) |

---

## What Makes This Different

1. **The code-typing hero** shows technical skill instantly
2. **No pushy CTAs** - confident minimalism that says "we don't need to sell hard"
3. **Client carousel** proves credibility without stats
4. **Single-line process** is elegantly simple
5. **Contact as just text** - refreshingly honest and direct
6. **Monospace typing** - authentic developer/keyboard aesthetic
7. **Your actual logo** - consistent with your existing brand

