import type { StructureResolver } from "sanity/structure";
import { Iframe } from "../components/preview-iframe";

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
      S.listItem()
        .title("Post")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Posts")
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType("post")
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .title("Preview")
                    .options({ slug: `/blog/` }),
                ])
            )
        ),
      S.listItem()
        .title("Project")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType("project")
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .title("Preview")
                    .options({ slug: `/projects/` }),
                ])
            )
        ),
    ]);
