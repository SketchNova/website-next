# Project Instructions

This is a Next.js website project with modern features:

- Next.js 14 with App Router for routing and server components
- TypeScript for type safety and better developer experience
- Tailwind CSS for utility-first styling
- ESLint for code quality
- Project structure using `src` directory

## Development Workflow

1. Start the development server:
```bash
npm run dev
```

2. Make changes to:
- `src/app/page.tsx` for the home page
- `src/app/layout.tsx` for the main layout
- Create new routes by adding directories in `src/app/`
- Add components in `src/components/`
- Modify styles in `src/styles/`

3. Test changes at http://localhost:3000

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy using Vercel or your preferred hosting platform.

## Best Practices

- Use TypeScript types for all components and functions
- Style with Tailwind CSS utility classes
- Follow ESLint rules for consistent code quality
- Use Next.js App Router patterns for routing and layouts
- Keep components small and reusable
- Organize code logically in the `src` directory structure