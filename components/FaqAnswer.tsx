import { faqIsHtml, sanitizeFaqHtml } from "@/lib/faq";

export function FaqAnswer({ answer }: { answer: string }) {
  if (!faqIsHtml(answer)) {
    return <dd className="mt-2 text-muted leading-relaxed">{answer}</dd>;
  }
  return (
    <dd
      className="faq-answer mt-2 text-muted leading-relaxed"
      dangerouslySetInnerHTML={{ __html: sanitizeFaqHtml(answer) }}
    />
  );
}
