import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";

describe("example", () => {
  test("mutation functions exist", () => {
    expect(api.example.testCapture).toBeDefined();
    expect(api.example.testIdentify).toBeDefined();
    expect(api.example.testGroupIdentify).toBeDefined();
    expect(api.example.testAlias).toBeDefined();
  });

  test("feature flag action functions exist", () => {
    expect(api.example.testGetFeatureFlag).toBeDefined();
    expect(api.example.testIsFeatureEnabled).toBeDefined();
    expect(api.example.testGetFeatureFlagPayload).toBeDefined();
    expect(api.example.testGetFeatureFlagResult).toBeDefined();
    expect(api.example.testGetAllFlags).toBeDefined();
    expect(api.example.testGetAllFlagsAndPayloads).toBeDefined();
  });
});
