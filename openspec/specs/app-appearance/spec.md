# app-appearance Specification

## Purpose
Lets the user read the app comfortably at any time of day by offering a light and a dark appearance across every screen, with a single control to switch between them and a device-local preference that survives restarts.

## Requirements

### Requirement: Light and dark appearances
The app SHALL provide both a light and a dark appearance, and the active appearance SHALL apply to every screen — the topics menu, the chapter list, chapter reading, chapter quizzes, quiz results, and review sessions. Text, controls, feedback, and progress indicators SHALL remain legible in both appearances.

#### Scenario: Reading a chapter in dark appearance
- **WHEN** the dark appearance is active and the user opens a chapter
- **THEN** the chapter text, section headings, and quiz call to action are shown in dark-appearance colours and are legible

#### Scenario: Grading an answer in dark appearance
- **WHEN** the dark appearance is active and the user submits a quiz answer
- **THEN** the correct/incorrect feedback, its explanation, and the link back to the source passage are shown in dark-appearance colours and are legible

#### Scenario: Reviewing due cards in dark appearance
- **WHEN** the dark appearance is active and the user starts a review session
- **THEN** the card, its provenance, the grade controls, and the next-interval indicator are shown in dark-appearance colours and are legible

#### Scenario: Changing appearance
- **WHEN** the user changes the appearance
- **THEN** every screen reflects the new appearance, including screens the user has not revisited since the change

### Requirement: Appearance control on the home screen
The home screen SHALL offer a control for the appearance, and activating it SHALL switch the app between light and dark.

#### Scenario: The control is present
- **WHEN** the user opens the topics menu
- **THEN** a control is shown that reports the appearance currently in effect

#### Scenario: Switching appearance from the home screen
- **WHEN** the user activates the appearance control on the home screen
- **THEN** the app switches to the other appearance

### Requirement: The appearance choice persists on the device
The appearance the user selects SHALL be stored on the device and restored the next time the app is opened. The app SHALL NOT require an account, a network connection, or any server-side state to remember it.

#### Scenario: Reopening the app
- **WHEN** the user selected the dark appearance, closes the app, and reopens it later
- **THEN** the app opens in the dark appearance

#### Scenario: The preference survives a new deployment
- **WHEN** a new version of the app is deployed and the user opens it again
- **THEN** the previously selected appearance is still in effect

### Requirement: The appearance defaults to the device preference
Until the user selects an appearance explicitly, the app SHALL use the device's own light or dark preference. Once the user selects an appearance, that selection SHALL take precedence over the device preference.

#### Scenario: A device set to dark, no explicit choice yet
- **WHEN** the user has never selected an appearance and the device is set to dark
- **THEN** the app opens in the dark appearance

#### Scenario: An explicit choice overrides the device preference
- **WHEN** the user has selected the light appearance and the device is set to dark
- **THEN** the app opens in the light appearance
