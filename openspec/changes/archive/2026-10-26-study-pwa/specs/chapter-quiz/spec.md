# Spec Delta

## Purpose

Lets the user read a chapter and immediately self-test with a quiz at the end of it, with feedback that points back to the exact passage an answer came from.

## ADDED Requirements

### Requirement: Chapter reading view
The app SHALL render a chapter's content as readable, mobile-friendly text with its title and reading position, and SHALL offer the chapter's quiz at the end of the chapter by default.

#### Scenario: Reaching the end of a chapter
- **WHEN** the user reads to the end of a chapter
- **THEN** the chapter's quiz is offered as the next action, showing the number of questions

#### Scenario: Chapter without questions
- **WHEN** a chapter has no questions available
- **THEN** the end of the chapter indicates there is nothing to quiz on and offers the next chapter instead

### Requirement: Chapter quiz presents the chapter's questions
Starting a chapter quiz SHALL present the question set linked to that chapter, one question at a time, with an indication of position within the quiz.

#### Scenario: Taking a chapter quiz
- **WHEN** the user starts a chapter quiz
- **THEN** questions are presented one at a time with a progress indicator covering the whole set

### Requirement: Immediate answer feedback
The app SHALL grade each answer immediately on submission. An incorrect answer SHALL reveal the correct answer and an explanation, and SHALL offer a link back to the passage the question was derived from.

#### Scenario: Correct answer
- **WHEN** the user submits a correct answer
- **THEN** the answer is confirmed as correct before moving on

#### Scenario: Incorrect answer
- **WHEN** the user submits an incorrect answer
- **THEN** the correct answer is highlighted, an explanation is shown, and a link to the relevant content passage is offered

### Requirement: Quiz results summary
Completing a chapter quiz SHALL show a results summary with the score and the list of missed questions, each linking back to its source passage.

#### Scenario: Finishing a quiz
- **WHEN** the user answers the last question of a chapter quiz
- **THEN** a summary shows the score and each missed question with a link to its passage

### Requirement: Chapter quizzes can be retaken
The user SHALL be able to retake any chapter's quiz at any time, regardless of prior results or scheduling.

#### Scenario: Retaking a completed chapter quiz
- **WHEN** the user opens a chapter whose quiz was already taken
- **THEN** the quiz can be started again from the chapter
