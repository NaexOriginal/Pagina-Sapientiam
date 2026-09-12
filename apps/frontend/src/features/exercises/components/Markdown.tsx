import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Estilos del tema asignados elemento por elemento (sin @tailwindcss/typography)
const components: Components = {
  h2: ({ children }) => <h2 className="mt-8 mb-3 font-serif text-2xl text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 font-serif text-xl text-foreground">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed text-muted">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-cyan">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-3 flex list-disc flex-col gap-2 pl-5 text-muted marker:text-lime">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 flex list-decimal flex-col gap-2 pl-5 text-muted marker:text-lime">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-lime underline underline-offset-4">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-lime pl-4 text-muted">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-lime">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto border border-line bg-panel p-4 font-mono text-sm [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-foreground">
      {children}
    </pre>
  ),
}

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  )
}
