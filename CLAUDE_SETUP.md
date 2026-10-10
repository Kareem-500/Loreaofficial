# Claude API Integration Guide

This guide explains how to set up and use Claude API authentication in the Loreaofficial project.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @anthropic-ai/sdk
# or
yarn add @anthropic-ai/sdk
```

### 2. Get Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll only see it once)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
   CLAUDE_MODEL=claude-3-5-sonnet-20241022
   CLAUDE_MAX_TOKENS=2048
   CLAUDE_TEMPERATURE=0.7
   ```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Usage Examples

### Using the Hook (Client-Side)

```tsx
import { useClaude } from "@/hooks/useClaude";

export function MyComponent() {
  const { response, loading, error, ask } = useClaude();

  const handleAsk = async () => {
    await ask("What is React?");
  };

  return (
    <div>
      <button onClick={handleAsk} disabled={loading}>
        Ask Claude
      </button>
      {response && <p>{response}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Using the API Endpoint

```typescript
// Client-side
const response = await fetch("/api/claude", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Hello Claude!",
    maxTokens: 1024,
  }),
});

const data = await response.json();
console.log(data.response);
```

### Using the Library Directly (Server-Side)

```typescript
import { askClaude, generateCodeSuggestion } from "@/lib/claude";

// Simple message
const response = await askClaude("Explain TypeScript");

// Code suggestion
const suggestion = await generateCodeSuggestion(`
  const x = 5;
  const y = 10;
  console.log(x + y);
`);
```

## Components

### ClaudeChat Component

A ready-to-use chat interface:

```tsx
import { ClaudeChat } from "@/components/ClaudeChat";

export default function Page() {
  return <ClaudeChat />;
}
```

## Configuration Options

- **CLAUDE_MODEL**: The model to use (default: `claude-3-5-sonnet-20241022`)
- **CLAUDE_MAX_TOKENS**: Maximum tokens in response (default: `2048`)
- **CLAUDE_TEMPERATURE**: Response randomness 0-1 (default: `0.7`)

## Available Functions

### `askClaude(message, config?)`

Send a single message to Claude.

```typescript
const response = await askClaude("Hello!", {
  model: "claude-3-opus-20250219",
  maxTokens: 1024,
  temperature: 0.5,
});
```

### `askClaudeConversation(messages, config?)`

Continue a multi-turn conversation.

```typescript
const response = await askClaudeConversation([
  { role: "user", content: "What is AI?" },
  { role: "assistant", content: "AI is artificial intelligence..." },
  { role: "user", content: "Tell me more" },
]);
```

### `generateCodeSuggestion(codeContext)`

Get code improvement suggestions.

```typescript
const suggestion = await generateCodeSuggestion("const arr = [1,2,3]");
```

## Security Best Practices

1. **Never expose your API key**: Keep it in environment variables only
2. **Use server-side calls for sensitive operations**: Prefer server components or API routes
3. **Validate user input**: Always validate messages before sending to Claude
4. **Rate limit**: Implement rate limiting on API endpoints
5. **Monitor usage**: Check your Anthropic console for unexpected API usage

## Troubleshooting

### "API key not found" Error

- Make sure `.env.local` exists and contains `ANTHROPIC_API_KEY`
- Restart your development server after adding the key
- Ensure the key starts with `sk-ant-`

### Rate Limiting

- Implement exponential backoff for retries
- Check your plan limits at console.anthropic.com
- Cache responses when possible

### Connection Issues

- Verify your internet connection
- Check if Anthropic's API is operational
- Ensure your firewall isn't blocking API calls

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Claude Models](https://docs.anthropic.com/en/docs/about-claude/models/latest)
- [API Reference](https://docs.anthropic.com/en/api/getting-started)

## Support

For issues with the Claude API, visit:
- [Anthropic Support](https://support.anthropic.com)
- [GitHub Issues](https://github.com/Kareem-500/Loreaofficial/issues)
