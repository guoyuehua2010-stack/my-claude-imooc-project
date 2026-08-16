---
name: Sakura Ledger
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#514346'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#847376'
  outline-variant: '#d6c2c4'
  surface-tint: '#874d5b'
  primary: '#874d5b'
  on-primary: '#ffffff'
  primary-container: '#ffb5c5'
  on-primary-container: '#7b4351'
  inverse-primary: '#fcb2c2'
  secondary: '#744f90'
  on-secondary: '#ffffff'
  secondary-container: '#deb3fd'
  on-secondary-container: '#654181'
  tertiary: '#2c6956'
  on-tertiary: '#ffffff'
  tertiary-container: '#98d6bf'
  on-tertiary-container: '#205e4d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#fcb2c2'
  on-primary-fixed: '#370c19'
  on-primary-fixed-variant: '#6c3644'
  secondary-fixed: '#f2daff'
  secondary-fixed-dim: '#e1b6ff'
  on-secondary-fixed: '#2c0648'
  on-secondary-fixed-variant: '#5a3777'
  tertiary-fixed: '#b1efd8'
  tertiary-fixed-dim: '#96d3bd'
  on-tertiary-fixed: '#002118'
  on-tertiary-fixed-variant: '#0d503f'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  background-cream: '#FFF9FA'
  expense-coral: '#FF8A8A'
  income-mint: '#A8E6CF'
  text-secondary: '#9B9B9B'
  category-dining: '#FFB5BA'
  category-transport: '#B5DAFF'
  category-shopping: '#FFE5B5'
  category-housing: '#C5E8D5'
  category-edu: '#FFF5B5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  display-price:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

The visual identity of this design system is centered on a "Soft-Kawaii" aesthetic—blending modern minimalism with a warm, playful, and approachable personality. It is designed to transform the often-stressful task of financial management into a soothing, delightful ritual.

The style leverages **Modern Minimalism** with a **Tactile** twist: 
- **High Whitespace:** Ample breathing room to reduce cognitive load and emphasize clarity.
- **Soft Shadows:** Elements appear to float gently above a "cream-base" canvas, creating a sense of physical layering without harsh edges.
- **Friendly Geometry:** Every corner is significantly rounded to evoke feelings of safety and comfort.
- **Expressive Iconography:** Utilizing colorful emojis to add a layer of emotional resonance and quick visual scanning.

The target audience includes students, young professionals, and micro-merchants who value aesthetics as much as utility. The emotional response should be one of "calm control"—organized yet gentle.

## Colors

The palette is built on a "Sakura & Cream" foundation. 
- **Primary (Sakura Pink):** Used for main actions, active states, and brand-heavy components like the "+" add button.
- **Secondary (Lavender Purple):** Used for accents, secondary information, and distinguishing specific categories.
- **Semantic Colors:** Expenses are represented by **Coral Pink** (a warmer, urgent version of the brand pink), while Income uses **Mint Green** to signify growth and success.
- **Background:** Instead of pure white, we use **Cream White** (#FFF9FA) to soften the screen's glare and reinforce the "warm" brand attribute.
- **Typography:** We avoid pure black, using **Warm Grey** (#5D5D5D) for primary text to maintain a soft contrast ratio that is easy on the eyes.

## Typography

The typography strategy prioritizes **roundedness** and **legibility**. 
- **Headlines:** We use **Plus Jakarta Sans** for its modern, geometric, yet soft apertures. It provides a clean, welcoming look for titles and large currency displays.
- **Body & Labels:** **Be Vietnam Pro** is selected for its approachable and contemporary feel. Its slightly wider character set ensures readability even at smaller sizes in dense transaction lists.
- **Scale:** A specialized `display-price` style is defined for the "Today's Balance" and "Monthly Summary" to make financial figures feel bold and impactful without being aggressive.

## Layout & Spacing

The design system utilizes a **Fluid Grid** model optimized for mobile-first consumption (320px - 428px).

- **Grid System:** A 4-column layout for mobile and 12-column for desktop.
- **Spacing Rhythm:** Based on a 4px baseline, with 16px (md) being the standard padding for cards and containers.
- **Margins:** Page-level horizontal margins are set to 20px to provide a comfortable "frame" for the card-based content.
- **Adaptation:** On mobile, components stack vertically. On tablet/desktop, the layout shifts to a multi-column dashboard where the "Today Overview" resides in a left or top sidebar while the "Transaction List" expands to the main area.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layering** rather than heavy lines.

- **Surface Levels:** 
  - **Level 0 (Base):** Cream White background.
  - **Level 1 (Cards):** Pure White surfaces with a very soft, diffused shadow (Blur: 15px, Spread: -2px, Color: rgba(255, 181, 197, 0.15) — a pink-tinted shadow to maintain warmth).
  - **Level 2 (Modals/Floating Buttons):** Higher elevation with a slightly deeper shadow to indicate interactivity and urgency.
- **Outlines:** Use low-contrast 1px borders in a lighter shade of the primary color (#FFDDE4) for input fields to define shape without breaking the soft aesthetic.

## Shapes

The shape language is "Full-Rounded." 
- **Standard Cards:** Use a 16px (`rounded-xl`) radius to create a bubbly, friendly container feel.
- **Buttons:** Use a 12px (`rounded-lg`) radius or fully pill-shaped (100px) for the main Call-To-Action (CTA).
- **Selection Chips:** Always pill-shaped to differentiate them from functional buttons.
- **Form Inputs:** 12px radius to match the button language.

## Components

- **Buttons:** Main buttons use a solid Sakura Pink background with white text and a subtle bottom-heavy shadow to look "pressable." Secondary buttons use a transparent background with a Sakura Pink border.
- **Cards:** The primary layout unit. Each card must have 16px internal padding and 16px rounded corners. Use cards to group "Today's Overview," "Budget Progress," and "Recent Transactions."
- **Category Chips:** Small pill-shaped containers. They should include the emoji icon followed by the category name. Use the category's specific soft color as the background at 20% opacity with a darker version for the text.
- **Input Fields:** Large, 12px rounded boxes with 16px padding. Placeholder text should be in `text-secondary`. On focus, the border transitions to Sakura Pink.
- **Transaction List:** Use a "Clean List" style where each row is separated by a 1px `background-cream` divider. Icons (emojis) should be placed in a 40px circular container with their category's background color.
- **Progress Bars:** For budget tracking, use thick (8px) bars with rounded ends. The "filled" portion should be Sakura Pink (or Coral if over budget), and the track should be a very light version of the background cream.
- **Floating Action Button (FAB):** A large, circular Sakura Pink button with a white "+" icon, positioned in the bottom right for "Quick Record" access.