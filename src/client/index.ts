import type { Scheduler } from "convex/server";
import type { ComponentApi } from "../component/_generated/component.js";

/** Context with a scheduler — available in mutations and actions. */
type SchedulerCtx = { scheduler: Scheduler };

/** Context with runAction — available in actions only. */
type ActionCtx = { runAction: (reference: any, args: any) => Promise<any> };

type FeatureFlagOptions = {
  groups?: Record<string, string>;
  personProperties?: Record<string, string>;
  groupProperties?: Record<string, Record<string, string>>;
  sendFeatureFlagEvents?: boolean;
  disableGeoip?: boolean;
};

export type FeatureFlagResult = {
  key: string;
  enabled: boolean;
  variant: string | null;
  payload: unknown;
};

export class PostHog {
  private apiKey: string;
  private host: string;

  constructor(
    public component: ComponentApi,
    options?: { apiKey?: string; host?: string },
  ) {
    this.apiKey = options?.apiKey ?? process.env.POSTHOG_API_KEY ?? "";
    this.host =
      options?.host ?? process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
  }

  // --- Fire-and-forget methods (work in mutations and actions) ---

  async capture(
    ctx: SchedulerCtx,
    args: {
      distinctId: string;
      event: string;
      properties?: Record<string, unknown>;
      groups?: Record<string, string | number>;
      sendFeatureFlags?: boolean;
      timestamp?: Date;
      uuid?: string;
      disableGeoip?: boolean;
    },
  ) {
    await ctx.scheduler.runAfter(0, this.component.lib.capture, {
      apiKey: this.apiKey,
      host: this.host,
      distinctId: args.distinctId,
      event: args.event,
      properties: args.properties,
      groups: args.groups,
      sendFeatureFlags: args.sendFeatureFlags,
      timestamp: args.timestamp?.getTime(),
      uuid: args.uuid,
      disableGeoip: args.disableGeoip,
    });
  }

  async identify(
    ctx: SchedulerCtx,
    args: {
      distinctId: string;
      properties?: Record<string, unknown>;
      disableGeoip?: boolean;
    },
  ) {
    await ctx.scheduler.runAfter(0, this.component.lib.identify, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async groupIdentify(
    ctx: SchedulerCtx,
    args: {
      groupType: string;
      groupKey: string;
      properties?: Record<string, unknown>;
      distinctId?: string;
      disableGeoip?: boolean;
    },
  ) {
    await ctx.scheduler.runAfter(0, this.component.lib.groupIdentify, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async alias(
    ctx: SchedulerCtx,
    args: {
      distinctId: string;
      alias: string;
      disableGeoip?: boolean;
    },
  ) {
    await ctx.scheduler.runAfter(0, this.component.lib.alias, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  // --- Feature flag methods (require action context) ---

  async getFeatureFlag(
    ctx: ActionCtx,
    args: { key: string; distinctId: string } & FeatureFlagOptions,
  ): Promise<boolean | string | null> {
    return await ctx.runAction(this.component.lib.getFeatureFlag, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async isFeatureEnabled(
    ctx: ActionCtx,
    args: { key: string; distinctId: string } & FeatureFlagOptions,
  ): Promise<boolean | null> {
    return await ctx.runAction(this.component.lib.isFeatureEnabled, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async getFeatureFlagPayload(
    ctx: ActionCtx,
    args: {
      key: string;
      distinctId: string;
      matchValue?: boolean | string;
    } & FeatureFlagOptions,
  ): Promise<unknown> {
    return await ctx.runAction(this.component.lib.getFeatureFlagPayload, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async getFeatureFlagResult(
    ctx: ActionCtx,
    args: { key: string; distinctId: string } & FeatureFlagOptions,
  ): Promise<FeatureFlagResult | null> {
    return await ctx.runAction(this.component.lib.getFeatureFlagResult, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async getAllFlags(
    ctx: ActionCtx,
    args: {
      distinctId: string;
      groups?: Record<string, string>;
      personProperties?: Record<string, string>;
      groupProperties?: Record<string, Record<string, string>>;
      disableGeoip?: boolean;
      flagKeys?: string[];
    },
  ): Promise<Record<string, boolean | string>> {
    return await ctx.runAction(this.component.lib.getAllFlags, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }

  async getAllFlagsAndPayloads(
    ctx: ActionCtx,
    args: {
      distinctId: string;
      groups?: Record<string, string>;
      personProperties?: Record<string, string>;
      groupProperties?: Record<string, Record<string, string>>;
      disableGeoip?: boolean;
      flagKeys?: string[];
    },
  ): Promise<{
    featureFlags: Record<string, boolean | string>;
    featureFlagPayloads: Record<string, unknown>;
  }> {
    return await ctx.runAction(this.component.lib.getAllFlagsAndPayloads, {
      apiKey: this.apiKey,
      host: this.host,
      ...args,
    });
  }
}
