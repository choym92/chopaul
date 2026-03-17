import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        defineField({ name: "live", type: "url", title: "Live URL" }),
        defineField({ name: "github", type: "url", title: "GitHub URL" }),
      ],
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", featured: "featured" },
    prepare({ title, featured }) {
      return { title, subtitle: featured ? "Featured" : "" };
    },
  },
});
