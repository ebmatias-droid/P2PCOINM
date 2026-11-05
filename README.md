# P2PCoin

A prototype for peer-to-peer community posts with optional cryptocurrency amount fields and direct messaging.

## Current functionality

- Create posts with a title and description
- Optionally include a cryptocurrency amount and contact information
- Browse recent posts
- Open a direct-message conversation associated with a post

## Technology

- TypeScript
- Vite
- Supabase

## Development

Install dependencies:

```sh
npm install
```

Configure the Supabase project URL and anonymous client key in the environment variables expected by the application. Apply database schema and Row Level Security policies before exposing a deployment.

Start the development server:

```sh
npm run dev
```

Build the application:

```sh
npm run build
```

## Security and project status

This codebase is a prototype, not a production-ready exchange or custodial cryptocurrency service. Do not use it to store private keys, custody funds, or transmit sensitive personal information. Review Supabase access policies, abuse controls, input validation, and messaging privacy before deployment.

## License

See [LICENSE](LICENSE) for the applicable terms.
