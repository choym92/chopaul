import {
  PortableText as PortableTextReact,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { codeToHtml } from "shiki";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

export async function highlightCodeBlocks(body: unknown[]): Promise<unknown[]> {
  return Promise.all(
    body.map(async (block: any) => {
      if (block._type === "code" && block.code) {
        try {
          const html = await codeToHtml(block.code, {
            lang: block.language || "text",
            theme: "github-light",
          });
          return { ...block, highlightedHtml: html };
        } catch {
          return block;
        }
      }
      return block;
    })
  );
}

function CodeBlock({ value }: { value: { language?: string; code: string; highlightedHtml?: string } }) {
  if (value.highlightedHtml) {
    return <div className="my-6 rounded-lg overflow-hidden text-sm" dangerouslySetInnerHTML={{ __html: value.highlightedHtml }} />;
  }
  return (
    <pre className="my-6 rounded-lg overflow-hidden text-sm bg-surface p-4">
      <code>{value.code}</code>
    </pre>
  );
}

function Callout({ value }: { value: { type: string; text: string } }) {
  const colors: Record<string, string> = {
    info: "border-blue-500/30 bg-blue-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    tip: "border-green-500/30 bg-green-500/5",
  };
  return (
    <div className={`my-6 border-l-2 pl-4 py-3 text-base text-text-secondary ${colors[value.type] || colors.info}`}>
      {value.text}
    </div>
  );
}

function SanityImage({ value }: { value: { asset: { _ref: string }; alt?: string } }) {
  const url = urlFor(value).width(720).auto("format").url();
  return (
    <div className="my-6">
      <Image src={url} alt={value.alt || ""} width={720} height={400} className="rounded-lg" />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-text-primary text-2xl font-medium mt-12 mb-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-text-primary text-xl font-medium mt-10 mb-4">{children}</h3>,
    normal: ({ children }) => <p className="text-text-secondary text-base leading-relaxed mb-5">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-border pl-4 my-6 text-text-muted text-base italic">{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
    code: ({ children }) => <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded">{children}</code>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-link hover:text-text-primary underline underline-offset-2 transition-colors">{children}</a>
    ),
  },
  types: {
    code: CodeBlock,
    callout: Callout,
    image: SanityImage,
  },
};

export function PortableText({ value }: { value: unknown[] }) {
  return <PortableTextReact value={value as PortableTextBlock[]} components={components} />;
}
