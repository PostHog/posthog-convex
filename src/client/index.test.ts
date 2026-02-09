import { describe, expect, test } from "vitest";
import { PostHog } from "./index.js";

describe("PostHog client", () => {
  test("constructor uses defaults from env", () => {
    process.env.POSTHOG_API_KEY = "test-key";
    process.env.POSTHOG_HOST = "https://test.posthog.com";

    const posthog = new PostHog({} as never);
    expect(posthog).toBeInstanceOf(PostHog);

    delete process.env.POSTHOG_API_KEY;
    delete process.env.POSTHOG_HOST;
  });

  test("constructor accepts explicit options", () => {
    const posthog = new PostHog({} as never, {
      apiKey: "explicit-key",
      host: "https://custom.posthog.com",
    });
    expect(posthog).toBeInstanceOf(PostHog);
  });

  test("exposes capture, identify, groupIdentify, alias methods", () => {
    const posthog = new PostHog({} as never, { apiKey: "test" });

    expect(typeof posthog.capture).toBe("function");
    expect(typeof posthog.identify).toBe("function");
    expect(typeof posthog.groupIdentify).toBe("function");
    expect(typeof posthog.alias).toBe("function");
  });

  test("exposes feature flag methods", () => {
    const posthog = new PostHog({} as never, { apiKey: "test" });

    expect(typeof posthog.getFeatureFlag).toBe("function");
    expect(typeof posthog.isFeatureEnabled).toBe("function");
    expect(typeof posthog.getFeatureFlagPayload).toBe("function");
    expect(typeof posthog.getFeatureFlagResult).toBe("function");
    expect(typeof posthog.getAllFlags).toBe("function");
    expect(typeof posthog.getAllFlagsAndPayloads).toBe("function");
  });
});
