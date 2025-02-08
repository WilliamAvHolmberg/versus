██╗   ██╗███████╗██████╗ ███████╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔══██╗██╔════╝██║   ██║██╔════╝
██║   ██║█████╗  ██████╔╝███████╗██║   ██║███████╗
╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██║   ██║╚════██║
 ╚████╔╝ ███████╗██║  ██║███████║╚██████╔╝███████║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝
```

# ⚠️ THIS PROJECT WAS RAWDOGGED WITH CURSOR, NO BEST PRACTICES ETC ⚠️

Compare HTML generation across multiple AI models simultaneously. Input a prompt, get multiple AI interpretations.

## Quick Start

1. Clone the repo
2. Install dependencies:
```bash
npm install
```
3. Create a .env file with the required environment variables

## Environment Variables

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/versus"

# OpenRouter (Required)
OPENROUTER_API_KEY="your_api_key"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development

```bash
# Start development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Project Structure

Check `.cursorrules` for detailed project structure and coding conventions.

## License

MIT