# Design Guidelines: Multi-Tool Web Application

## Design Approach

**Selected Framework**: Material Design 3
**Justification**: This utility-focused, information-dense application with multiple tools requires clear visual hierarchy, strong feedback systems, and consistent component patterns. Material Design 3 excels at organizing complex functionality while maintaining clarity and usability across different contexts.

**Key Design Principles**:
- Clarity over decoration - every element serves a functional purpose
- Instant recognition - users should immediately understand what each tool does
- Consistent patterns - similar interactions work the same way across all tools
- Efficient workflows - minimize steps between user intent and action

## Typography

**Font Family**: Inter (via Google Fonts CDN)
- Primary: Inter for all UI text
- Monospace: 'Roboto Mono' for code/data viewers, calculator displays

**Type Scale**:
- Tool titles: text-2xl (24px), font-semibold
- Section headers: text-lg (18px), font-medium
- Body text: text-base (16px), font-normal
- Helper text/labels: text-sm (14px), font-normal
- Button text: text-sm (14px), font-medium
- Data displays: text-sm (14px), font-mono

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, and 8** consistently
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Margins between major sections: mb-6 or mb-8
- Tight spacing (icon-label pairs): gap-2
- Card padding: p-6

**Grid Structure**:
- Home menu: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Tool layouts: max-w-6xl mx-auto px-4
- Two-column layouts (editor tools): grid-cols-1 lg:grid-cols-2 gap-6

## Component Library

### Home Menu/Dashboard
- **App header**: Fixed top bar with app title (text-2xl font-bold) and tagline
- **Tool cards**: Elevated cards (shadow-md) in responsive grid, each containing:
  - Large icon (h-12 w-12) centered at top
  - Tool name (text-lg font-semibold)
  - Brief description (text-sm text-muted)
  - Hover state: subtle elevation increase (shadow-lg)

### Navigation Patterns
- **Back button**: Top-left with arrow icon + "Back to Menu" text
- **Breadcrumbs**: For multi-step workflows (File Converter, Data Viewer)

### Core Components

**File Upload Zones**:
- Dashed border rectangle (min-h-48)
- Upload icon (h-16 w-16) centered
- "Drop files here or click to browse" text
- Accepted file types listed below
- Active drop state: border highlight

**Data Tables** (for JSON/CSV/YAML/XML viewer):
- Sticky header row (bg-surface, shadow-sm)
- Alternating row backgrounds for readability
- Sortable column headers with arrow indicators
- Horizontal scroll for wide datasets
- Row hover states
- Search/filter input above table

**Calculator Interface**:
- Display area: Large text field (text-3xl font-mono) with right-aligned text
- Button grid: 4 columns for standard buttons, consistent sizing (h-14)
- Graph area: Full-width canvas below calculator (min-h-96)
- Function input field with example placeholder

**Audio Tools** (Recorder & Editor):
- Waveform visualization: Full-width canvas (h-32)
- Transport controls: Play/pause, stop, record buttons in horizontal row
- Timeline ruler with time markers
- Volume slider with numerical display

**Photo Editor**:
- Main canvas: Center stage with aspect ratio preservation
- Tool sidebar: Left-aligned vertical toolbar with icons
- Adjustment panel: Right sidebar with sliders for brightness/contrast/saturation
- Crop overlay with draggable handles

**Previewer Tools** (Markdown/HTML):
- Split view: Editor on left (monospace font), preview on right
- Live update as user types
- Syntax highlighting in editor pane
- Toggle for full-screen preview mode

**Forms & Inputs**:
- Text inputs: border, rounded-md, px-4 py-2, focus ring
- Dropdowns: Native select styling with custom arrow icon
- Sliders: Full-width with value label
- File inputs: Custom styled with visible filename display

**Buttons**:
- Primary actions: Rounded-md px-6 py-2.5 font-medium
- Secondary actions: Outlined variant
- Icon buttons: Square (h-10 w-10) with centered icon
- Destructive actions: Use visual distinction

## Icons

**Icon Library**: Heroicons (via CDN)
- Tool cards: outline icons at 48px
- UI controls: outline icons at 20-24px
- Buttons: solid icons at 16-20px

## Images

This application requires minimal imagery:

**App Logo**: Simple icon mark for the top header (h-8 w-8), representing multi-functionality (e.g., Swiss army knife concept or tool grid symbol)

**Empty States**: Illustrative icons or simple graphics for:
- Empty file upload zones
- "No data loaded" states in viewers
- Wikipedia search initial state

**No hero image needed** - this is a utility application where users want immediate access to tools, not marketing content.

## Responsive Behavior

**Mobile (< 768px)**:
- Tool grid: 2 columns
- Side-by-side editors: Stack vertically
- Tables: Horizontal scroll with sticky first column
- Calculator: Larger touch targets (h-16 buttons)

**Tablet (768-1024px)**:
- Tool grid: 3 columns
- Comfortable spacing increases

**Desktop (> 1024px)**:
- Tool grid: 4 columns
- Split-view editors show side-by-side
- Maximum content width: max-w-6xl