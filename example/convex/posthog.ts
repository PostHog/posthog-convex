import { PostHog } from "@posthog/convex";
import { components } from "./_generated/api";

export const posthog = new PostHog(components.posthog, {
  beforeSend: (event) => {
    return {
      ...event,
      properties: {
        ...event.properties,
        environment: "example-app",
      },
    };
  },
});
