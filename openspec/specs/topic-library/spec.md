# topic-library Specification

## Purpose
Presents the study library as a topics menu with progress and per-chapter status, so the user always sees where they stand and what to study next.

## Requirements

### Requirement: Topics menu is the home screen
The app SHALL open on a menu of all available topics. Each topic entry SHALL display its title, overall progress, chapters-completed count, and the number of cards currently due for review.

#### Scenario: Opening the app
- **WHEN** the user opens the app with at least one topic available
- **THEN** the home screen lists every topic with its progress, chapters completed, and due-review count

#### Scenario: Topic with no activity
- **WHEN** a topic has no chapters completed
- **THEN** its entry shows zero progress and no due count

### Requirement: Chapter list with status per topic
Selecting a topic SHALL show its chapters in order, each with a status: new, in progress, done, or review due.

#### Scenario: Opening a topic
- **WHEN** the user selects a topic
- **THEN** a chapter list is shown where every chapter carries one of the statuses new, in progress, done, or review due

#### Scenario: Chapter with weak answers
- **WHEN** a chapter's quiz has been taken and some of its answers are weak or missed
- **THEN** that chapter is marked as review due

### Requirement: Chapter completion counts toward progress
A chapter SHALL count as completed for progress purposes once its end-of-chapter quiz has been taken.

#### Scenario: Progress updates after a quiz
- **WHEN** the user completes a chapter's end-of-chapter quiz for the first time
- **THEN** the topic's chapters-completed count and progress indicator increase accordingly

### Requirement: Due review entry points
The home screen and each topic view SHALL offer a review action when that scope has cards due, showing the due count and an estimated session length.

#### Scenario: Starting a review from home
- **WHEN** the home screen shows one or more cards due across topics
- **THEN** the user can start a review session covering the due cards

#### Scenario: Starting a topic-scoped review
- **WHEN** a topic view shows cards due for that topic
- **THEN** the user can start a review session limited to that topic's due cards
