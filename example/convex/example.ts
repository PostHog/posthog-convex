import { posthog } from "./posthog.js";
import { action, mutation } from "./_generated/server.js";
import { v } from "convex/values";

// --- Fire-and-forget methods (mutations) ---

export const testCapture = mutation({
  args: {
    distinctId: v.string(),
    event: v.string(),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await posthog.capture(ctx, {
      distinctId: args.distinctId,
      event: args.event,
      properties: args.properties,
      groups: { company: "test-corp" },
    });
    return { success: true };
  },
});

export const testIdentify = mutation({
  args: {
    distinctId: v.string(),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await posthog.identify(ctx, {
      distinctId: args.distinctId,
      properties: args.properties ?? { name: "Test User", plan: "pro" },
    });
    return { success: true };
  },
});

export const testGroupIdentify = mutation({
  args: {
    groupType: v.string(),
    groupKey: v.string(),
    properties: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await posthog.groupIdentify(ctx, {
      groupType: args.groupType,
      groupKey: args.groupKey,
      properties: args.properties ?? { industry: "Technology" },
    });
    return { success: true };
  },
});

export const testAlias = mutation({
  args: {
    distinctId: v.string(),
    alias: v.string(),
  },
  handler: async (ctx, args) => {
    await posthog.alias(ctx, {
      distinctId: args.distinctId,
      alias: args.alias,
    });
    return { success: true };
  },
});

// --- Feature flag methods (actions) ---

export const testGetFeatureFlag = action({
  args: { distinctId: v.string(), flagKey: v.string() },
  handler: async (ctx, args) => {
    const value = await posthog.getFeatureFlag(ctx, {
      key: args.flagKey,
      distinctId: args.distinctId,
    });
    return { flagKey: args.flagKey, value };
  },
});

export const testIsFeatureEnabled = action({
  args: { distinctId: v.string(), flagKey: v.string() },
  handler: async (ctx, args) => {
    const enabled = await posthog.isFeatureEnabled(ctx, {
      key: args.flagKey,
      distinctId: args.distinctId,
    });
    return { flagKey: args.flagKey, enabled };
  },
});

export const testGetFeatureFlagPayload = action({
  args: { distinctId: v.string(), flagKey: v.string() },
  handler: async (ctx, args) => {
    const payload = await posthog.getFeatureFlagPayload(ctx, {
      key: args.flagKey,
      distinctId: args.distinctId,
    });
    return { flagKey: args.flagKey, payload };
  },
});

export const testGetFeatureFlagResult = action({
  args: { distinctId: v.string(), flagKey: v.string() },
  handler: async (ctx, args) => {
    const result = await posthog.getFeatureFlagResult(ctx, {
      key: args.flagKey,
      distinctId: args.distinctId,
    });
    return { flagKey: args.flagKey, result };
  },
});

export const testGetAllFlags = action({
  args: { distinctId: v.string() },
  handler: async (ctx, args) => {
    const flags = await posthog.getAllFlags(ctx, {
      distinctId: args.distinctId,
    });
    return { flags };
  },
});

export const testGetAllFlagsAndPayloads = action({
  args: { distinctId: v.string() },
  handler: async (ctx, args) => {
    const result = await posthog.getAllFlagsAndPayloads(ctx, {
      distinctId: args.distinctId,
    });
    return result;
  },
});
