export function analyzeRequirements(data) {
  const features = [];

  if (
    data.client_notes.toLowerCase().includes("admin")
  ) {
    features.push("Admin Dashboard");
  }

  if (
    data.client_notes.toLowerCase().includes("login")
  ) {
    features.push("Authentication System");
  }

  if (
    data.client_notes.toLowerCase().includes("payment")
  ) {
    features.push("Payment Integration");
  }

  if (
    data.client_notes.toLowerCase().includes("tracking")
  ) {
    features.push("Tracking System");
  }

  return `
# SDLC Discovery Analysis

## Project Purpose
${data.business_goal}

## Target Audience
${data.target_audience}

## Challenges
${data.challenges}

## Suggested Core Features
${features.map((f) => `- ${f}`).join("\n")}

## Suggested Architecture
- Frontend: React
- Backend: Node.js
- Database: SQLite/PostgreSQL

## MVP Recommendation
Start with core features first.

## Risks
- Scope creep
- Undefined requirements
- Scaling challenges

## Suggested Timeline
2-4 Months
`;
}