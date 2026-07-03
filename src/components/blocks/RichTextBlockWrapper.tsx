interface RichTextBlockProps {
  content: any
}

function renderLexicalNode(node: any): React.ReactNode {
  if (!node) return null

  if (node.type === "text") {
    let el: React.ReactNode = node.text
    if (node.format & 1) el = <strong key="b">{el}</strong>
    if (node.format & 2) el = <em key="i">{el}</em>
    return el
  }

  const children = node.children?.map((child: any, i: number) => (
    <span key={i}>{renderLexicalNode(child)}</span>
  ))

  switch (node.type) {
    case "paragraph":
      return <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
    case "heading": {
      const level = node.tag || 2
      const headingClass = "font-bold mb-3 text-gray-900 dark:text-white"
      if (level === 1) return <h1 className={headingClass}>{children}</h1>
      if (level === 3) return <h3 className={headingClass}>{children}</h3>
      if (level === 4) return <h4 className={headingClass}>{children}</h4>
      return <h2 className={headingClass}>{children}</h2>
    }
    case "list":
      const ListTag = node.listType === "number" ? "ol" : "ul"
      return <ListTag className="list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300">{children}</ListTag>
    case "listitem":
      return <li>{children}</li>
    case "link":
      return <a href={node.fields?.url} className="text-mannatech underline">{children}</a>
    case "root":
      return <>{children}</>
    default:
      return <div>{children}</div>
  }
}

export function RichTextBlockWrapper({ content }: RichTextBlockProps) {
  if (!content?.root) return null

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        {renderLexicalNode(content.root)}
      </div>
    </section>
  )
}
