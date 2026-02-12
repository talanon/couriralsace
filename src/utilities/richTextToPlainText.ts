type RichTextNode = {
  text?: string
  children?: RichTextNode[]
}

type RichTextValue = {
  root?: {
    children?: RichTextNode[]
  }
}

const walkNodes = (nodes: RichTextNode[] = []): string[] => {
  const parts: string[] = []

  for (const node of nodes) {
    if (typeof node?.text === 'string' && node.text.length) {
      parts.push(node.text)
    }

    if (Array.isArray(node?.children) && node.children.length) {
      parts.push(...walkNodes(node.children))
    }
  }

  return parts
}

export const richTextToPlainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''

  const richText = value as RichTextValue
  const children = Array.isArray(richText.root?.children) ? richText.root?.children : []
  if (!children.length) return ''

  return walkNodes(children).join(' ').replace(/\s+/g, ' ').trim()
}
