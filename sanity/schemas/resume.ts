import { defineField, defineType } from "sanity";

export const resume = defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    defineField({
      name: "experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "company", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "startDate", type: "date", validation: (r) => r.required() }),
            defineField({ name: "endDate", type: "date" }),
            defineField({ name: "current", type: "boolean", initialValue: false }),
            defineField({ name: "description", type: "blockContent" }),
          ],
          preview: {
            select: { title: "role", subtitle: "company" },
          },
        },
      ],
    }),
    defineField({
      name: "education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "institution", type: "string", validation: (r) => r.required() }),
            defineField({ name: "degree", type: "string" }),
            defineField({ name: "field", type: "string" }),
            defineField({ name: "startDate", type: "date" }),
            defineField({ name: "endDate", type: "date" }),
          ],
          preview: {
            select: { title: "institution", subtitle: "degree" },
          },
        },
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
          preview: { select: { title: "category" } },
        },
      ],
    }),
    defineField({
      name: "projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Resume" }) },
});
