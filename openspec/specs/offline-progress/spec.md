# offline-progress Specification

## Purpose
Keeps the study experience available with no network and all progress on the user's device — no accounts, no server, no tracking — fitting on-the-go use in tunnels, planes, and poor coverage.

## Requirements

### Requirement: Fully usable offline after first visit
After the app has been loaded once, it SHALL open and remain fully usable without a network connection: reading chapters, taking chapter quizzes, and running review sessions SHALL all work offline.

#### Scenario: Studying in airplane mode
- **WHEN** the user has loaded the app before and then loses network access
- **THEN** the app opens and reading, quizzing, and reviewing all function normally

#### Scenario: First visit requires network
- **WHEN** the user has never loaded the app and has no network
- **THEN** the app cannot yet be loaded, and no stale or partial experience is required

### Requirement: Progress is device-local
All study progress — chapters read, quiz results, review schedules and history — SHALL be stored on the device. A study session SHALL not require any network calls after assets are loaded, and the app SHALL not require an account or server-side state.

#### Scenario: Progress survives restart without network
- **WHEN** the user answers questions, closes the app, and reopens it while offline
- **THEN** all prior progress is intact

#### Scenario: No account needed
- **WHEN** the user uses the app for the first time
- **THEN** studying is possible without any sign-up, login, or data leaving the device

### Requirement: Content updates preserve progress
When a new version of the app or its content is deployed, the app SHALL pick it up on a subsequent online visit without losing locally stored progress.

#### Scenario: New content deployed
- **WHEN** the maintainer publishes new or updated content and the user opens the app online
- **THEN** the new content becomes available while all prior progress is preserved

### Requirement: Installable as an app
The app SHALL be installable to the device's home screen and launch as a standalone, full-screen app without browser chrome.

#### Scenario: Installing from the browser
- **WHEN** the user installs the app from the browser
- **THEN** it launches from the home screen in its own window with no browser address bar
