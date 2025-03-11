import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "content/*.md",
      schema: z.object({
        title: z.string(),
        intro: z.string(),
      }),
    }),
  },
});
