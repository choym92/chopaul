import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Author")
        .child(S.document().schemaType("author").documentId("author")),
      S.listItem()
        .title("Resume")
        .child(S.document().schemaType("resume").documentId("resume")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["author", "resume"].includes(listItem.getId()!)
      ),
    ]);
