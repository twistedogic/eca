# Spec Delta

## Purpose

Turns the repository's markdown content into the app's question set: deterministic generation from the writing, optional AI-drafted questions gated by human review, and hand-written questions — merged into one static data file whenever content changes.

## ADDED Requirements

### Requirement: Content and question sources live in the repository
Study content SHALL be organized per topic as markdown chapter files under a content directory for that topic, with hand-written questions stored in sidecar files next to their chapter. Pushing changes to these files SHALL trigger the pipeline automatically.

#### Scenario: Adding a chapter
- **WHEN** a new chapter markdown file is committed and pushed
- **THEN** the pipeline runs automatically and the deployed app gains that chapter with its quiz

#### Scenario: Hand-written questions ship with their chapter
- **WHEN** a chapter sidecar file contains hand-written questions
- **THEN** those questions appear in that chapter's quiz, tagged as hand-written

### Requirement: Deterministic generation from content
The pipeline SHALL generate questions mechanically from chapter content: each prominently marked key term SHALL produce a definition multiple-choice question whose distractors come from sibling key terms, and marked key sentences SHALL produce fill-in-the-blank (cloze) questions. Generated questions SHALL be tagged with their source.

#### Scenario: Bold key term in a chapter
- **WHEN** a chapter contains a marked key term
- **THEN** the chapter's quiz includes a definition question for that term with distractors drawn from other key terms

#### Scenario: No key terms present
- **WHEN** a chapter contains no marked key terms or key sentences
- **THEN** generation produces no questions for it and the pipeline still succeeds

### Requirement: AI-drafted questions require human review
When configured with an API key, the pipeline MAY draft additional reasoning questions with an AI model, but unreviewed drafts SHALL NOT be published to the app's question set. Drafts SHALL be presented for human review before inclusion.

#### Scenario: No API key configured
- **WHEN** the pipeline runs without an AI API key
- **THEN** it succeeds using deterministic and hand-written questions only

#### Scenario: Unreviewed AI drafts
- **WHEN** the pipeline has drafted AI questions that no human has approved
- **THEN** those drafts are excluded from the published question set

### Requirement: Merged question set with traceable origin
All questions from all sources SHALL be merged into a single static question set consumed by the app. Every question SHALL carry a stable unique identifier, a source tag, and a reference to the content passage it was derived from. When a hand-written question targets the same term or passage as a generated one, the generated one SHALL be dropped in favor of the hand-written one.

#### Scenario: Question provenance
- **WHEN** the app displays any question
- **THEN** the question set identifies whether it is generated, AI-drafted, or hand-written, and links it to its source passage

#### Scenario: Hand-written question overrides a generated duplicate
- **WHEN** a hand-written question and a generated question cover the same key term
- **THEN** only the hand-written question appears in the merged set

#### Scenario: Wrong answer links back to content
- **WHEN** the user answers a question incorrectly
- **THEN** the question's passage reference allows the app to link directly to the content section it came from
