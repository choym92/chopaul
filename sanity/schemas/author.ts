import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "bio", type: "text", rows: 3, description: "Short bio for home page" }),
    defineField({ name: "fullBio", type: "blockContent", description: "Full bio for /about" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "socialLinks",
      type: "object",
      fields: [
        defineField({ name: "github", type: "url" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "email", type: "string" }),
      ],
    }),
    defineField({
      name: "skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "category", type: "string" }),
            defineField({ name: "items", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
          ],
          preview: {
            select: { title: "category" },
          },
        },
      ],
    }),
    defineField({ name: "nowContent", type: "blockContent", description: "What you're working on now" }),
    defineField({ name: "nowUpdatedAt", type: "datetime", description: "When Now section was last updated" }),
    defineField({ name: "resumePdf", type: "file" }),
  ],
  preview: { select: { title: "name" } },
});
