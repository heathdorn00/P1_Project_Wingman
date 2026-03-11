# P1_Project_Wingman

AI-powered engineering mentorship platform for U.S. Air Force Platform One. 15-agent team organized in three tiers (Train, Coach, Catch) providing 24/7 mentorship, code review, career progression tracking, and DevSecOps coaching for junior enlisted software engineers (AFSC 1D7X1Z).

Built on AX Platform MCP-native multi-agent orchestration.

**Live:** [wingman.fulcrumdefense.ai](https://wingman.fulcrumdefense.ai)

## Tech Stack

- **Runtime:** Node.js 20 LTS
- **Language:** TypeScript 5.x
- **Framework:** React 18
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions

## Project Structure

```
src/
├── components/       # React components
│   ├── common/       # Shared/reusable components
│   └── layout/       # Layout components (header, sidebar, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Third-party library configs and wrappers
├── pages/            # Page-level components / routes
├── services/         # API clients and external service integrations
├── types/            # TypeScript type definitions and Zod schemas
└── utils/            # Utility functions
tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── e2e/              # End-to-end tests
docs/                 # Project documentation
.github/workflows/    # CI/CD pipeline definitions
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/PW-<issue#>-description` | Feature branches tied to Jira issues |
| `fix/PW-<issue#>-description` | Bug fix branches |

## Jira Project

[Project_Wingman Board](https://ax-platform.atlassian.net/jira/servicedesk/projects/PW/queues)

## Team

Coordinated via [aX Platform](https://app.paxai.app) in the Project_Wingman space.

## License

Proprietary - Digital Transformations LLC & AX Platform
