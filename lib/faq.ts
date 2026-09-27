const ALLOWED = new Set(["p", "ul", "ol", "li", "strong", "em", "b", "i", "br", "code"]);

export function faqIsHtml(input: string): boolean {
  return /<\/?[a-z][\s\S]*?>/i.test(input);
}

/** Drop tags and attributes the pipeline does not need. Answers are our own MDX. */
export function sanitizeFaqHtml(input: string): string {
  return input.replace(/<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi, (full, tag: string) => {
    const name = tag.toLowerCase();
    if (!ALLOWED.has(name)) return "";
    if (full.startsWith("</")) return `</${name}>`;
    if (name === "br") return "<br>";
    return `<${name}>`;
  });
}

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

/** Plain text for FAQPage JSON-LD. HTML from the pipeline must not land in `text`. */
export function htmlToText(input: string): string {
  const withoutTags = faqIsHtml(input)
    ? sanitizeFaqHtml(input)
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    : input;
  return decodeEntities(withoutTags).replace(/\s+/g, " ").trim();
}
