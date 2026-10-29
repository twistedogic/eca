# Spec Delta

## Purpose

Lets the user choose how large the app's text is, so the same material stays readable on a small phone screen, in bright light, or with the text held close.

## ADDED Requirements

### Requirement: A text size applies to every screen
The app SHALL offer a choice of text sizes, and the size in effect SHALL apply to every screen — the topics menu, the chapter list, chapter reading, chapter quizzes, quiz results, and review sessions. Body text, headings, controls, feedback, and progress indicators SHALL all be drawn at the chosen size.

#### Scenario: Reading a chapter at a larger size
- **WHEN** a larger text size is in effect and the user opens a chapter
- **THEN** the chapter body text, section headings, and quiz call to action are shown larger than at the default size

#### Scenario: Grading an answer at a larger size
- **WHEN** a larger text size is in effect and the user submits a quiz answer
- **THEN** the answer choices, the correct/incorrect feedback, and its explanation are shown larger than at the default size

#### Scenario: Reviewing due cards at a larger size
- **WHEN** a larger text size is in effect and the user starts a review session
- **THEN** the card, its provenance, the grade controls, and the next-interval indicator are shown larger than at the default size

#### Scenario: Changing the text size
- **WHEN** the user changes the text size
- **THEN** every screen reflects the new size, including screens the user has not revisited since the change

### Requirement: Text size control on the home screen
The home screen SHALL offer a control for the text size, showing the sizes that can be chosen and marking the one currently in effect. Choosing a size SHALL apply it immediately.

#### Scenario: The control is present
- **WHEN** the user opens the topics menu
- **THEN** a control is shown that reports the text size currently in effect

#### Scenario: Choosing a size from the home screen
- **WHEN** the user chooses a text size on the home screen
- **THEN** the app's text is drawn at that size straight away

### Requirement: The text size choice persists on the device
The text size the user selects SHALL be stored on the device and restored the next time the app is opened. The app SHALL NOT require an account, a network connection, or any server-side state to remember it.

#### Scenario: Reopening the app
- **WHEN** the user selected a larger text size, closes the app, and reopens it later
- **THEN** the app opens at that larger text size

#### Scenario: The preference survives a new deployment
- **WHEN** a new version of the app is deployed and the user opens it again
- **THEN** the previously selected text size is still in effect

### Requirement: The text size defaults to the standard size
Until the user selects a size explicitly, the app SHALL draw its text at the standard size. Once the user selects a size, that selection SHALL take precedence.

#### Scenario: A first-time user
- **WHEN** the user has never selected a text size
- **THEN** the app draws its text at the standard size

#### Scenario: An explicit choice overrides the standard size
- **WHEN** the user has selected a larger text size and reopens the app
- **THEN** the app opens at that larger size, not at the standard size

### Requirement: One consistent, readable type scale
The app SHALL draw every piece of text from a single type scale, so that text playing the same role is drawn at the same size on every screen, and the smallest text SHALL stay legible at every text size. Text drawn on a coloured fill SHALL keep a contrast ratio of at least 4.5:1 against that fill in both appearances.

#### Scenario: Prose and controls share a size
- **WHEN** the user compares the body text of a chapter with the answer choices of its quiz
- **THEN** both are drawn at the same size

#### Scenario: Captions and metadata share a size
- **WHEN** the user compares a topic's chapter count with a chapter's "review due" chip
- **THEN** both are drawn at the same size

#### Scenario: Small text stays legible at the largest size
- **WHEN** the text size is at its largest step
- **THEN** the smallest text on screen — captions, chips, and metadata — is still readable

#### Scenario: Text on a coloured fill
- **WHEN** the user reads a "done" chip, a "review due" chip, or the feedback shown after an answer
- **THEN** the text on the coloured fill is readable against that fill in both the light and the dark appearance
