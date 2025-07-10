# Project Taurus: UI Design Goals

This document summarizes the key UI design principles and goals for Project Taurus, aiming for an immersive, intuitive, and aesthetically cohesive user experience.

## 1. Core Metaphor: The "Author's Desk"

The entire application is designed around the metaphor of an "Author's Desk," where the user is actively crafting a story. This guides the placement and interaction of all UI elements.

## 2. Aesthetic & Theme: "Ink & Parchment"

A distinct visual theme is applied throughout:
-   **Color Palette:** Dark, warm sepia tones for backgrounds, off-white/creamy text, and rich crimson accents (e.g., for user actions, highlights).
-   **Typography:** Clear, readable fonts that complement the theme.
-   **Overall Feel:** Modern, clean, and elegant, reminiscent of old manuscripts and study environments.

## 3. Central Narrative Display: The "Narrative Tapestry"

The primary focus of the application is the story itself, visualized as a dynamic tapestry:
-   **Layout:** Single-column, vertical flow, centered on the screen.
-   **Narrative Beats:**
    -   **AI Narration:** Displayed as rectangular blocks, representing the flowing fabric of the story.
    -   **User Actions:** Displayed as distinct, pill-shaped "Action Nodes," representing key decisions or interventions.
-   **Connectors:** Vertical "threads" visually connect each narrative beat, creating a continuous timeline.
-   **Scrolling:** Smooth vertical scrolling for natural reading.

## 4. Workspace Panels: Codex & Inspector

Two primary side panels provide contextual tools and information, acting as extensions of the "Author's Desk":
-   **Interaction:** Panels slide in/out from the screen edges (left/right) with fluid animations (powered by Framer Motion).
-   **Central Narrative Resizing:** The `NarrativeTapestry` dynamically resizes its width to accommodate open panels, maintaining focus on the story.
-   **Independent Control:** Both panels can be opened and closed independently.

### 4.1. Left Panel: The "Codex" (World Browser)

This panel serves as the user's comprehensive "World Bible," for browsing all diegetic elements:
-   **Content:** A unified, browsable **TreeView graph** (`WorldDataTree`) displaying:
    -   Characters
    -   Locations
    -   Items
    -   Lore
-   **Functionality:** Includes a search bar and type filters for efficient navigation.
-   **Visuals:** Features continuous and dynamic graph lines connecting categories and entities. Entity ID pills are rendered on top of cards for clear visibility.
-   **No Internal Tabs:** The content is unified within a single view.

### 4.2. Right Panel: The "Inspector" (Tools & Actions)

This panel is the user's "Toolkit and Magnifying Glass," dedicated to non-diegetic elements and actions:
-   **Content:** A tabbed interface for various tools:
    -   **"Inspector" Tab:** Displays the `EntityDetailView` for the currently selected entity (from the Codex), allowing for detailed viewing and future editing.
    -   **"Tools" Tab:** Combines `AssistantNotes` (meta-narrative guidance, observations) and `AIContext` (for managing specific context provided to the AI model).
    -   **"Settings" Tab:** For application-wide configurations.
-   **Dynamic Activation:** Selecting an entity in the Codex automatically opens the Right Panel to the "Inspector" tab.
-   **Tab Styling:** Tabs are designed to take up the entire horizontal space, adapting to content without overflow. Scrollbars within the panel match the "Ink & Parchment" theme.

## 5. Panel Toggles: The "Drawer Buttons"

The previous toolbar has been replaced by subtle "drawer buttons" located on the left and right edges of the screen:
-   **Function:** Clicking a button toggles the visibility of the corresponding side panel.
-   **Visuals:** Uses thematic chevron icons that point outward when the panel is closed and inward when it is open.

## 6. General UI Principles

-   **Cohesion:** All elements work together to reinforce the central metaphor and theme.
-   **Modernity:** Utilizes contemporary UI patterns and smooth animations.
-   **Natural Interaction:** Prioritizes ergonomic and intuitive controls (e.g., vertical scrolling, clear button feedback).
-   **Clarity & Distinction:** Shapes, colors, and layout are used to clearly differentiate between element types (e.g., user vs. AI narrative, diegetic vs. non-diegetic tools).
-   **Minimal Clutter:** Information is presented on demand, keeping the primary narrative view clean and immersive.
-   **Visual Separation:** Subtle variations in background shades, defined borders, and increased padding/margins create better visual distinction and breathing room between UI elements.