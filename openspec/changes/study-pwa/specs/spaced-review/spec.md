# Spec Delta

## Purpose

Resurfaces missed and shaky answers as scheduled review cards so studied knowledge survives weeks, not minutes — the retention engine of the app.

## ADDED Requirements

### Requirement: Missed answers become scheduled review cards
When a question is answered incorrectly in a chapter quiz or a review session, it SHALL enter the review schedule as a due card. Correctly answered review cards SHALL leave the due set until their next scheduled date.

#### Scenario: Missing a chapter quiz question
- **WHEN** the user answers a chapter quiz question incorrectly
- **THEN** that question becomes a review card scheduled for the near future

#### Scenario: Due card answered correctly
- **WHEN** the user answers a due review card correctly
- **THEN** the card leaves the due set until its next scheduled review date

### Requirement: Intervals stretch on success and collapse on failure
A review card answered correctly SHALL be scheduled with a strictly longer interval than its previous interval, following an increasing ladder (for example 1d, 3d, 7d, 16d). A card answered incorrectly SHALL have its interval collapsed so it returns within about a day.

#### Scenario: Correct review lengthens the gap
- **WHEN** the user answers a review card correctly
- **THEN** the card's next review is scheduled further away than its previous one

#### Scenario: Incorrect review resets the gap
- **WHEN** the user answers a review card incorrectly
- **THEN** the card is scheduled to return within about one day

### Requirement: Review sessions are short and traceable
A review session SHALL present due cards one at a time, show which chapter and topic each card came from with a link to its passage, and indicate the card's next scheduled interval after grading.

#### Scenario: Reviewing due cards
- **WHEN** the user starts a review session with due cards
- **THEN** due cards are presented one at a time, each showing its source chapter and a link to its passage

#### Scenario: Grading shows the next interval
- **WHEN** the user grades a review card
- **THEN** the app indicates when that card will next be due

### Requirement: Review state persists locally
Each card's schedule and review history SHALL be kept on the device alongside other study progress, surviving app restarts.

#### Scenario: Closing and reopening the app
- **WHEN** the user grades review cards, closes the app, and reopens it later
- **THEN** the review schedules and due counts reflect the earlier session
