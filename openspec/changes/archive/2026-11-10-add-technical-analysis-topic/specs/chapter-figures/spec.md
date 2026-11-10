# Spec Delta

## Purpose

Chapter reading content can include schematic figures (inline SVG embedded in the source markdown) that illustrate concepts visually, rendering responsively inside the reading column.

## ADDED Requirements

### Requirement: Inline SVG figures render in chapters
A chapter section whose markdown contains an inline `<svg>` element SHALL render that SVG as part of the section body, with no pipeline stripping or transformation beyond existing markdown processing.

#### Scenario: Chapter with a candlestick anatomy figure
- **WHEN** the user opens a chapter whose markdown embeds an inline SVG diagram
- **THEN** the figure appears in the section body at the point it was authored

### Requirement: Figures fit the reading column
Figures SHALL scale to fit the section width without horizontal scrolling, on viewports down to the smallest supported width, preserving their aspect ratio.

#### Scenario: Narrow viewport
- **WHEN** the user reads a chapter containing a wide SVG figure on a narrow screen
- **THEN** the figure shrinks to the section width and no horizontal scrolling of the page occurs

### Requirement: Figures respect the active theme
Figure strokes and fills that reference theme colors SHALL resolve to the active theme's palette, so figures remain legible in light and dark themes.

#### Scenario: Dark theme
- **WHEN** the user reads a chapter with a figure while the dark theme is active
- **THEN** the figure's theme-referencing colors render with the dark theme's values and remain legible
