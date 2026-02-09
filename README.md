# @posthog/convex

[![npm version](https://badge.fury.io/js/@posthog%2Fconvex.svg)](https://badge.fury.io/js/@posthog%2Fconvex)

Send analytics events to [PostHog](https://posthog.com) from your
[Convex](https://convex.dev) backend. Capture events, identify users, manage
groups, and evaluate feature flags directly from your mutations and actions.

Found a bug? Feature request?
[File it here](https://github.com/PostHog/posthog-convex/issues).

## Installation

```sh
npm install @posthog/convex
```

Register the component in your `convex/convex.config.ts`:

```ts
// convex/convex.config.ts
import { defineApp } from "convex/server";
import posthog from "@posthog/convex/convex.config.js";

const app = defineApp();
app.use(posthog);

export default app;
```

Set your PostHog API key and host on your Convex deployment:

```sh
npx convex env set POSTHOG_API_KEY phc_your_project_api_key
npx convex env set POSTHOG_HOST https://us.i.posthog.com
```

## Setup

Create a `convex/posthog.ts` file to initialize the client:

```ts
// convex/posthog.ts
import { PostHog } from "@posthog/convex";
import { components } from "./_generated/api";

export const posthog = new PostHog(components.posthog);
```

You can also pass the API key and host explicitly:

```ts
export const posthog = new PostHog(components.posthog, {
  apiKey: "phc_...",
  host: "https://eu.i.posthog.com",
});
```

## Usage

Import `posthog` from your setup file and call methods directly:

```ts
// convex/myFunctions.ts
import { posthog } from "./posthog";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", { email: args.email });

    await posthog.capture(ctx, {
      distinctId: userId,
      event: "user_created",
      properties: { email: args.email },
    });

    return userId;
  },
});
```

### Capture events

**`posthog.capture(ctx, args)`** — Capture an event. Works in mutations and
actions.

```ts
await posthog.capture(ctx, {
  distinctId: "user_123",
  event: "purchase_completed",
  properties: { amount: 99.99, currency: "USD" },
  groups: { company: "acme-corp" },
});
```

Supported options: `distinctId`, `event`, `properties`, `groups`,
`sendFeatureFlags`, `timestamp`, `uuid`, `disableGeoip`.

### Identify users

**`posthog.identify(ctx, args)`** — Set user properties.

```ts
await posthog.identify(ctx, {
  distinctId: "user_123",
  properties: { name: "Jane Doe", plan: "pro" },
});
```

### Identify groups

**`posthog.groupIdentify(ctx, args)`** — Set group properties.

```ts
await posthog.groupIdentify(ctx, {
  groupType: "company",
  groupKey: "acme-corp",
  properties: { industry: "Technology", employees: 500 },
});
```

### Alias

**`posthog.alias(ctx, args)`** — Link two distinct IDs.

```ts
await posthog.alias(ctx, {
  distinctId: "user_123",
  alias: "anonymous_456",
});
```

All of the above methods schedule the PostHog API call asynchronously via
`ctx.scheduler.runAfter`, so they return immediately without blocking your
mutation or action.

## Feature flags

Feature flag methods evaluate flags by calling the PostHog API and returning
the result. They require an **action** context (they use `ctx.runAction`
internally).

**`posthog.getFeatureFlag(ctx, args)`** — Get a flag's value.

```ts
import { posthog } from "./posthog";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const getDiscount = action({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const flag = await posthog.getFeatureFlag(ctx, {
      key: "discount-campaign",
      distinctId: args.userId,
    });

    if (flag === "variant-a") {
      return { discount: 20 };
    }
    return { discount: 0 };
  },
});
```

**`posthog.isFeatureEnabled(ctx, args)`** — Check if a flag is enabled.

```ts
const enabled = await posthog.isFeatureEnabled(ctx, {
  key: "new-onboarding",
  distinctId: "user_123",
});
```

**`posthog.getFeatureFlagPayload(ctx, args)`** — Get a flag's JSON payload.

```ts
const payload = await posthog.getFeatureFlagPayload(ctx, {
  key: "pricing-config",
  distinctId: "user_123",
});
```

**`posthog.getFeatureFlagResult(ctx, args)`** — Get a flag's value and payload
in one call.

```ts
const result = await posthog.getFeatureFlagResult(ctx, {
  key: "experiment-flag",
  distinctId: "user_123",
});
if (result) {
  console.log(result.enabled, result.variant, result.payload);
}
```

**`posthog.getAllFlags(ctx, args)`** — Get all flag values for a user.

```ts
const flags = await posthog.getAllFlags(ctx, {
  distinctId: "user_123",
});
```

**`posthog.getAllFlagsAndPayloads(ctx, args)`** — Get all flags and their
payloads.

```ts
const { featureFlags, featureFlagPayloads } =
  await posthog.getAllFlagsAndPayloads(ctx, {
    distinctId: "user_123",
  });
```

All feature flag methods accept optional `groups`, `personProperties`,
`groupProperties`, `sendFeatureFlagEvents`, and `disableGeoip` options.
`getAllFlags` and `getAllFlagsAndPayloads` also accept `flagKeys` to filter
which flags to evaluate.

## Example

See the [example app](./example) for a working demo.

## Development

```sh
pnpm i
pnpm dev
```
