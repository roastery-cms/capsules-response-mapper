# @roastery-capsules/response-mapper

Elysia plugin that automatically maps entity responses to DTOs for the [Roastery CMS](https://github.com/roastery-cms) ecosystem.

[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Overview

`baristaResponseMapper` is an [Elysia](https://elysiajs.com) plugin that intercepts all responses after they are handled and automatically converts [`@roastery/beans`](https://github.com/roastery-cms) `Entity` instances (and arrays of them) to plain DTOs via `Mapper.toDTO`. It also preserves the original HTTP status code when the response is wrapped in an `ElysiaCustomStatusResponse`.

## Technologies

| Tool | Purpose |
|------|---------|
| [Elysia](https://elysiajs.com) | HTTP framework and plugin system |
| [@roastery/barista](https://github.com/roastery-cms) | Elysia factory used across the Roastery ecosystem |
| [@roastery/beans](https://github.com/roastery-cms) | Entity and Mapper base classes |
| [Bun](https://bun.sh) | Runtime, test runner, and package manager |
| [tsup](https://tsup.egoist.dev) | Bundling to ESM + CJS with `.d.ts` generation |

## Installation

```bash
bun add @roastery-capsules/response-mapper
```

Peer dependencies:

```bash
bun add @roastery/barista @roastery/beans
```

## Usage

Register the plugin on your Elysia app:

```typescript
import { Elysia } from "elysia";
import { baristaResponseMapper } from "@roastery-capsules/response-mapper";

const app = new Elysia()
  .use(baristaResponseMapper)
  .get("/users/:id", ({ params }) => {
    return new UserEntity({ id: params.id, name: "Alan" });
  })
  .listen(3000);
```

The plugin registers a **global** `onAfterHandle` hook, so all routes and sub-apps are covered automatically.

### What it does

- If the response is an `Entity`, it is replaced with `Mapper.toDTO(entity)`.
- If the response is an array where the first element is an `Entity`, every item is mapped with `Mapper.toDTO`.
- If the response is wrapped in `ElysiaCustomStatusResponse` (e.g. returned via `status(201, entity)`), it is unwrapped before mapping and the original status code is preserved.
- Any other response type is left untouched.

## Development

```bash
# Run tests
bun run test:unit

# Run tests with coverage
bun run test:coverage

# Build for distribution
bun run build

# Check for unused exports and dependencies
bun run knip

# Full setup (build + bun link)
bun run setup
```

## License

MIT
