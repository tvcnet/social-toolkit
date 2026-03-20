# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v4.7.7] — 2026-03-19
### Added
- **Multimodal (Vision) AI Support**: All four AI providers (Claude, OpenAI, Gemini, Ollama) now officially support sending uploaded images alongside the text prompt, enabling visual context in post generation.
- **IMAGE CONTEXT Prompt Injection**: When photos are uploaded, the prompt engine automatically injects explicit visual analysis instructions to the AI, producing more visually relevant posts.
- **Polishing UX Transparency**: When a generated post exceeds a platform's character limit and requires a second API pass, the loading message now explicitly shows "Polishing text to fit platform limits... 🛠️" instead of random loading phrases.

### Changed
- **Namespaced Global Utilities**: Consolidated loose global functions (`tstStripLinks`, `tstStripMarkdown`, `tstSanitize`) into a modular `TST_Utils` namespace object for cleaner code organization.
- **Declarative Event Listeners**: Replaced imperative `document.addEventListener` keyboard shortcut bindings with idiomatic Alpine.js `@keydown` directives on the `<body>` element, improving maintainability and fixing an invalid `.cmd` modifier (now `.meta`).
- **Escape Key Enhancement**: Escape now cascades through all modals — closing the Settings modal first, then the Help modal — instead of only dismissing the Settings modal.

### Fixed
- **Prompt Length Instruction Bug**: Fixed a critical bug where the AI was never receiving the "CONCISE", "BALANCED", or "DEEP DIVE" content length instruction due to destructuring `length` instead of `contentLength`.
- **Word Count Edge Case**: Fixed `wordCount` calculation where deleting a post or receiving an empty/whitespace-only response would display "1 word" instead of "0 words".

## [v4.7.6] — 2026-03-18
### Fixed
- **UI Bug**: Fixed a DOM nesting issue where the main layout container was missing a closing `</div>`. This releases the footer into the root block context, allowing it to natively span the identical full-width size of the header.

## [v4.7.5] — 2026-03-18
### Changed
- **Perfect Symmetry**: Upgraded the footer to be a true sticky-bottom mirror of the header, matching all typography, spacing, and geometry (vertically reversed).

## [v4.7.4] — 2026-03-18
### Changed
- **Symmetrical UI Framing**: Fully synchronized footer geometry with the header, implementing a full-width `justify-between` bar with `rounded-t-[2rem]` corners, left-aligned branding, and right-aligned versioning.

## [v4.7.3] — 2026-03-18
### Changed
- **Footer Layout Symmetry**: Refactored the footer to be a symmetrical "reverse" of the header, using the `tst-glass-strong` background with `rounded-t-[2rem]` corners for a cohesive top-and-bottom application frame.

## [v4.7.2] — 2026-03-18
### Changed
- **Branding Alignment**: Integrated the toolkit logo into the footer glass pill to match the header design, ensuring a consistent brand presence across the application.

## [v4.7.1] — 2026-03-18
### Changed
- **Footer Refresh**: Improved readability and aesthetic appeal of the application footer by wrapping the watermark in a premium glassmorphism pill and increasing text contrast (70% opacity).

## [v4.7.0] — 2026-03-18
### Changed
- **UX Refinement**: Replaced generic "SocialToolkit Help" titles with descriptive, contextual headers for all API settings tooltips (e.g., "AI Neural Engine Selection", "Global Writing Style Rules").

## [v4.6.9] — 2026-03-18
### Fixed
- **API Settings Links**: Updated the Anthropic API key link to point directly to `/settings/keys` (fixing a 404 error) and optimized the Ollama link to point to the `/download` page for faster setup.

## [v4.6.8] — 2026-03-18
### Added
- Educational tooltips to the API Settings modal, covering AI Providers, Security, Ollama setup, and Custom Instructions.
- New help content keys for comprehensive background guidance.

## [v4.6.7] — 2026-03-17
### Fixed
- **Mobile Overflow**: Implemented `flex-wrap` and `grid-cols-1` for action rows to ensure 375px viewport compatibility.
- **Content Calendar**: Added horizontal scroll container with `min-width` to prevent table clipping on mobile.
- **UX Feedback**: Added red toast alerts for "Post Directly" and "Add to Calendar" when clicked without content.
- **UI Consistency**: Smoothed layout transitions and added sticky headers to scrollable table views.

## [v4.6.6] — 2026-03-17
### Added
- Standardized metadata headers to all primary JS and HTML files.
- New `assets/` directory structure (`assets/css`, `assets/js`, `assets/img`).
### Changed
- Refactored custom CSS glassmorphism utilities into Tailwind `@layer utilities`.
- Synchronized all version strings to `v4.6.6`.
- Updated all HTML asset paths to point to the new `assets/` directory.

## [v4.6.5] — 2026-03-17
### Fixed
- **Persistence Regression**: Fixed a critical bug in `TSTStorage` where structural JSON sanitization was corrupting stored data, preventing Activity Logs and Post History from persisting across refreshes.
- **UX Clarity**: Refined all 17 strategic help titles to be descriptive and contextual (e.g., "Target Audience Selection" instead of "Who Help").

## [v4.6.4] — 2026-03-17
### Added
- **Interactive Strategic Guidance**: Added targeted help triggers for 'Post Directly' and consolidated 'Content Calendar' management (Export/Clear) help into a single comprehensive UI trigger.
- **UX Refinement**: Clarified platform-specific direct posting limitations and local data management behaviors while reducing UI clutter in the calendar section.
- **Visual Polish**: Improved calendar header layout by removing redundant secondary help triggers.

## [v4.6.3] — 2026-03-17
### Added
- **Expanded Help System**: Integrated strategy modals for Photos, Schedule, Calendar, History, and Activity Log.
- **UI Consistency**: Restored decorative section-header line to Platform selection.
- **Header Refinement**: Consolidated version numbering; removed redundant "SocialToolkit" tracking text.
- **Action Grid**: Standardized 2-column layout (Generate/Regenerate and Clear/Search).

## [v4.6.2] — 2026-03-17
### Added
- **Plain Text Optimization**: Prompt engine and cleanup utilities strictly forbid markdown in AI responses.
- **Bug Fix**: Resolved `doGenerate` scope issue in modular controller.

## [v4.6.0] — 2026-03-17
### Added
- **Modular JavaScript Architecture**: Refactored `social-toolkit.js` into targeted modules for better maintainability:
  - `tst-config.js`: Static data and writing guides.
  - `tst-utils.js`: Storage and sanitization utilities.
  - `tst-services.js`: Isolated AI service logic.
  - `tst-content.js`: Prompt engineering and content polishing.
- Improved separation of concerns between UI state and backend logic.

## [v4.5.0] — 2026-03-17
### Added
- **Global Help Modal System**: Replaced anchored tooltips with a centered, high-readability modal.
- Improved readability with full-screen dimmed overlays and consistent typography.
- Enhanced mobile responsiveness for help content.

## [4.4.6] - 2026-03-16
- **UI FIX**: Implemented SOLID dark background for all tooltips to ensure 100% legibility over complex background elements (like the platform button row).
- **UI FIX**: Removed all remaining decorative lines near the Platform section to prevent visual interlock issues.
- **UX**: Unified the Platform and Who section structures for visual consistency.

## [4.4.5] - 2026-03-17
- **UI REFINEMENT**: Removed Platform tooltip to eliminate visual clashing with platform buttons.
- **UX REFINEMENT**: Consolidated platform-related educational content into the "Who" tooltip for a cleaner, more readable experience.

## [4.4.4] - 2026-03-17
- **UI REFINEMENT**: Restructured Platform header to isolate tooltip from decorative flex-line.
- **UX REFINEMENT**: Restored high-opacity glassmorphism for all tooltips.

## [4.4.3] - 2026-03-17
- **UI REFINEMENT**: Restored Platform tooltip as requested.
- **UX REFINEMENT**: Reverted "Who" tooltip to its focused audience-centric content.

## [4.4.2] - 2026-03-17
- **UI REFINEMENT**: Removed Platform tooltip to eliminate visual clashing with platform buttons.
- **UX REFINEMENT**: Consolidated platform-related educational content into the "Who" tooltip for a cleaner, more readable experience.

## [4.4.1] - 2026-03-17
### Fixed
- **UI FIX**: Resolved Platform tooltip transparency issue with solid background fallback.
- **UX FIX**: Improved tooltip readability over high-contrast background elements.
- **SYSTEM**: Forced CSS cache refresh for consistent asset delivery.

## [4.4.0] - 2026-03-17
### Added
- **Educational Tooltip System**: New glassmorphism-themed tooltips across the UI to guide users on platform nuances, the 5 W's, and reach strategies (e.g., why to sometimes exclude URLs).
- **Interactive Triggers**: Hover for desktop and tap-to-toggle for mobile, ensuring accessible guidance on all devices.
- **Micro-animations**: Subtle fade-in/out and scale effects for tooltips to match the "Clear Sky" aesthetic.

## [4.3.1] - 2026-03-17
### Added
- **Programmatic URL Safety Net**: Centralized `_stripLinks` helper that aggressively scrubs link hallucinations (including `example.com` and common shorteners) when "Include URL" is unchecked.
- **Favicon & Identity**: Generated and integrated a project-specific favicon (speech bubble + lightning bolt) across all standard sizes (16x16, 32x32, 180x180).
- **Header Logo Integration**: Positioned the new logo to the left of the title in the glassmorphism header for a more professional finish.

### Fixed
- **AI Behavioral Integrity**: Reorganized System Prompt with "URL Integrity" as Rule #1 to stop link hallucinations.
- **Polish Pass URL Logic**: Fixed a bug where the character-limit "Polishing Pass" was forcing URL preservation regardless of user settings.
- **Punctuation Refinement**: Automatically fixes spacing issues caused by link removal at the end of sentences.

## [4.3.0] - 2026-03-16
### Changed
- **Major Structural Refactoring**: Completed a comprehensive code review and refactoring of the core architecture to improve maintainability and scalability.
- **Centralized Storage Management**: Extracted all `localStorage` logic into a new `StorageManager` object, ensuring consistent sanitization and JSON handling across the app.
- **AIService Decoupling**: Moved all AI API provider logic (Claude, OpenAI, Gemini, Ollama) out of the Alpine.js UI component and into a standalone `AIService` constant.
- **Template Logic Cleanup**: Simplified HTML templates by moving business logic (like platform capabilities and provider labels) into clean JS component methods.
- **UI Resilience**: Refactored the "Generate Post" button to use more robust Alpine.js logic, preventing blank rendering issues during state transitions.
- **Version Normalization**: Unified versioning across header, footer, and internal logs.

## [4.2.3] - 2026-03-16
### Added
- **Visual Platform Support Indicator**: Platforms that support direct posting (X, LinkedIn, Bluesky) now feature a subtle dark green indicator line at the bottom of their selection bubble.

### Fixed
- **URL Placeholder Suppression**: Refined AI instructions to strictly forbid the use of placeholders like `[URL]` or `[link]` when the "Include URL" toggle is disabled.

## [4.2.2] - 2026-03-16
### Added
- **URL Inclusion Toggle**: Added a "What/URL" label and an "Include URL" checkbox. This allows users to paste a URL for the AI to use as context/research, while optionally excluding the literal URL from the final post text (improving organic reach on certain platforms).
- **Default Tone Priority**: Reordered the Tone dropdown to prioritize "Casual & Friendly" as the top and default option.

### Fixed
- **Strict Character Limits**: Implemented a "Two-Pass" generation strategy. The toolkit now automatically detects if a post exceeds platform limits and triggers a secondary "Polish" pass to strictly truncate or rewrite it to fit.

## [4.2.1] - 2026-03-16

## [4.2.0] - 2026-03-15

### Added
- **Major Standards Alignment**: Full adherence to project-agnostic "Vanilla JS & Static App" standards.
- **Enhanced Security**: Integrated a global `sanitize` helper to validate all data read from `localStorage`, preventing potential XSS vectors.
- **Structured Logging**: Standardized application-level logging through a centralized `logAction` method.

### Added
- **Interactive UX Journey**: Introduced specific iconography and color signatures (👤 Who, 📝 What, 📍 Where, 💡 Why, ⏰ When) in the "The 5 W's" section, with real-time "Captured" state feedback.
- **Micro-Animations**: Added `tst-bounce-in` animation for photo thumbnails and consistent hover/active scaling for all action buttons.
- **State-Aware UI**: Upload zone now provides immediate visual confirmation (solid Sky-400 border and shadow) when assets are attached.

### Changed
- **Typography Consensus**: Bumbed all primary action labels (Generate, Copy, Edit, Schedule) to `text-sm` for unified design language and improved readability.
- **Accessibility Pass**: Increased the size of utility buttons and history/log data to `text-xs` to improve scanning in high-density panels.
- **CSS Namespacing**: All custom classes and keyframe animations migrated to the `tst-` namespace (e.g., `.tst-glass`, `.tst-spin`) to ensure zero global scope conflicts.
- **Architecture Refinement**: Reorganized `js/social-toolkit.js` for better separation of concerns, moving effect-driven "whimsy" logic to modular internal methods.

### Fixed
- **Robust Export Mechanism**: Resolved issue where JSON/CSV exports were failing to download in some browser environments by implementing an "append-and-trigger" download logic.
- **Ollama Connectivity**: Support for custom model storage paths and improved default connection handling for macOS.


## [4.0.0] - 2026-03-15
### Changed
- **Major Release**: Transition to the fully rebranded **TVCNet SocialToolkit** ecosystem.
- **Baseline Reset**: All legacy rebranded systems and internal data structures migrated and normalized.
- **Architecture Stabilization**: Finalized file structure and modular includes for long-term maintenance.

## [3.2.1] - 2026-03-15
### Changed
- **Rebrand Normalization**: Final sync of internal `localStorage` keys to the new brand prefix (`tst_`).
- **Data Migration**: Added automatic migration of legacy rebranded settings to ensured zero data loss.
- **Documentation Sync**: Corrected historical filename references and synchronized versioning across all project files.

## [3.2.0] - 2026-03-14
### Added
- **Platform Rename**: Renamed all instances of 'Twitter' and '𝕏' to 'X' for simplicity.
- **Improved Calendar Rows**: Added prominent individual delete buttons for each post in the Content Calendar.
- **Activity Log**: Real-time terminal-style logging panel with Export and Clear controls.
- **Post History**: Auto-saves last 20 generated posts to localStorage with restore, remove, and clear.
- **Regenerate Button**: Re-run the same prompt without clearing inputs.
- **Word Count**: Displayed alongside character count in the preview pane.
- **Character Bar Colors**: Green (ideal), amber (under-target), red (over-limit) progress bar.
- **Error Toast Styling**: Red toast notifications for API errors, distinct from success messages.
- **Keyboard Shortcuts**: `⌘+Enter` to generate, `Escape` to close settings modal.
- **Platform Log Tracking**: Switching platforms is now recorded in the Activity Log.
### Changed
- **CDN Pinning**: Tailwind CSS (`3.4.17`) and Alpine.js (`3.14.8`) locked to specific versions.
- **Actions Grid**: Reorganized to a 2×2 layout with Generate, Regenerate, Clear All, and Google Search.

## [3.1.3] - 2026-03-14
### Changed
- Switched Google provider from Gemini 2.0 Flash to **Gemma 3 27B** (`gemma-3-27b-it`) to resolve quota limits.
- Updated all UI labels and API logic for Gemma integration.

## [3.1.2] - 2026-03-14
### Added
- Global API error handling with descriptive toast notifications for all providers.
- Cache-busting query string on script tags.
### Fixed
- Resolved 404 error in Gemini generation by updating to valid model identifier (`gemini-2.0-flash`).
- Fixed platform reordering (LinkedIn moved to the right of Bluesky).

## [3.1.1] - 2026-03-14
### Added
- **🦋 Bluesky Integration**: Added support for Bluesky with a 300-character limit and specialized conversational writing guide.

## [3.1.0] - 2026-03-14
### Added
- **🧠 Custom Writing Instructions**: Persistent global rules for AI behavior (e.g., "Always use emojis", "Strip meta-labels").
- **🦙 Improved Ollama Support**: 
  - Switch to native `/api/tags` endpoint for faster and more reliable model detection.
  - Added support for fetching models via `127.0.0.1` and `localhost` with tailored CORS troubleshooting.
  - Resolved model binding disappearance on page reload using Alpine.js `$nextTick` lifecycle hooks.
### Changed
- **Visual Overhaul**: Implementation of "Clear Sky Glassmorphism" UI with frosted interactive elements, semantic color tokens, and smooth micro-animations.
- **Code Organization**: Refactored logic into structured modular includes:
  - `css/social-toolkit.css`: Centralized design system and glass effects.
  - `js/social-toolkit.js`: Core state management and AI provider logic.
- **File Renaming**: Main application consolidated to `tvcnet-social-toolkit.html`.
### Fixed
- **Ollama CORS Block**: Fixed pre-flight request failures by optimizing server URL normalization.
- **Dropdown State Loss**: Prevented Alpine.js from resetting selected models before dynamic options render.
- **API Connectivity**: Resolved IPv6 vs IPv4 binding conflicts on macOS environments.

## [3.0.0] - 2026-03-01
### Added
- Initial release of the redesigned social media toolkit.
- Multi-provider support (OpenAI, Anthropic, Google Gemini).
- Local AI support via Ollama integration.
- Content Calendar and CSV Export functionality.
- Privacy-first architecture (no login, local storage only).
