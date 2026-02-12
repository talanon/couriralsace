import type { Event } from '@/payload-types'
import { richTextToPlainText } from '@/utilities/richTextToPlainText'

type LexicalValue = null | boolean | number | string | LexicalValue[] | { [key: string]: LexicalValue }

const VARIABLE_PATTERN = /{{\s*event\.([a-zA-Z0-9_.]+)\s*}}/g

export const EVENT_TEMPLATE_VARIABLES = [
  '{{event.title}}',
  '{{event.startDate}}',
  '{{event.endDate}}',
  '{{event.dateRange}}',
  '{{event.location}}',
  '{{event.description}}',
  '{{event.descriptionRich}}',
  '{{event.registrationLink}}',
  '{{event.slug}}',
  '{{event.image}}',
  '{{event.imageUrl}}',
  '{{event.imageAlt}}',
  '{{event.courseCount}}',
  '{{event.firstCourse.title}}',
  '{{event.firstCourse.date}}',
  '{{event.firstCourse.location}}',
  '{{event.firstCourse.distance}}',
  '{{event.firstCourse.elevationGain}}',
  '{{event.firstCourse.type}}',
  '{{event.firstCourse.image}}',
  '{{event.firstCourse.imageUrl}}',
] as const

const formatDate = (value?: string | null) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

const getMediaUrl = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''
  if (!('url' in (value as Record<string, unknown>))) return ''
  return typeof (value as { url?: unknown }).url === 'string' ? ((value as { url?: string }).url as string) : ''
}

const getMediaAlt = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''
  if (!('alt' in (value as Record<string, unknown>))) return ''
  return typeof (value as { alt?: unknown }).alt === 'string' ? ((value as { alt?: string }).alt as string) : ''
}

const isLexicalValue = (value: unknown): value is LexicalValue => {
  if (value === null) return true
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.every((item) => isLexicalValue(item))
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every((item) => isLexicalValue(item))
  }
  return false
}

const isRichTextDocument = (value: unknown): value is { root: { children: unknown[] } } => {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'root' in (value as Record<string, unknown>) &&
      typeof (value as { root?: unknown }).root === 'object' &&
      Array.isArray((value as { root?: { children?: unknown[] } }).root?.children),
  )
}

const fullPlaceholder = (value: string): string | null => {
  const match = value.match(/^{{\s*event\.([a-zA-Z0-9_.]+)\s*}}$/)
  return match?.[1] || null
}

const getEventDescriptionNodes = (event: Event): LexicalValue[] => {
  const description = event.description as unknown

  if (isRichTextDocument(description)) {
    return (description.root.children as LexicalValue[]) || []
  }

  if (typeof description === 'string' && description.trim().length) {
    return [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: description,
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ]
  }

  return []
}

const interpolateRichTextRootChildren = (children: LexicalValue[], event: Event): LexicalValue[] => {
  return children.flatMap((child) => {
    if (!child || typeof child !== 'object' || Array.isArray(child)) {
      return [interpolateNode(child, event)]
    }

    const node = child as Record<string, LexicalValue>
    const nodeChildren = Array.isArray(node.children) ? node.children : []

    if (node.type === 'paragraph' && nodeChildren.length > 0) {
      const hasOnlyTextChildren = nodeChildren.every((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return false
        return typeof (item as Record<string, LexicalValue>).text === 'string'
      })

      if (hasOnlyTextChildren) {
        const mergedText = nodeChildren
          .map((item) => ((item as Record<string, LexicalValue>).text as string) || '')
          .join('')
        const placeholder = fullPlaceholder(mergedText)

        if (placeholder === 'descriptionRich' || placeholder === 'description') {
          const descriptionNodes = getEventDescriptionNodes(event)
          return descriptionNodes.map((descNode) => interpolateNode(descNode, event))
        }
      }
    }

    if (
      node.type === 'paragraph' &&
      nodeChildren.length === 1 &&
      nodeChildren[0] &&
      typeof nodeChildren[0] === 'object' &&
      !Array.isArray(nodeChildren[0])
    ) {
      const textNode = nodeChildren[0] as Record<string, LexicalValue>
      const rawText = typeof textNode.text === 'string' ? textNode.text : null
      const placeholder = rawText ? fullPlaceholder(rawText) : null

      if (placeholder === 'descriptionRich' || placeholder === 'description') {
        const descriptionNodes = getEventDescriptionNodes(event)
        return descriptionNodes.map((descNode) => interpolateNode(descNode, event))
      }
    }

    return [interpolateNode(child, event)]
  })
}

const resolveEventVariable = (event: Event, key: string): unknown => {
  const firstCourse = event.courses?.[0]

  switch (key) {
    case 'title':
      return event.title || ''
    case 'startDate':
      return formatDate(event.startDate)
    case 'endDate':
      return formatDate(event.endDate)
    case 'dateRange':
      if (!event.startDate) return ''
      if (!event.endDate || event.endDate === event.startDate) return formatDate(event.startDate)
      return `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
    case 'location':
      return event.location || ''
    case 'description':
      return typeof event.description === 'string'
        ? event.description
        : richTextToPlainText(event.description)
    case 'descriptionRich':
      return getEventDescriptionNodes(event)
    case 'registrationLink':
      return event.registrationLink || ''
    case 'slug':
      return event.slug || ''
    case 'image':
      return event.image || null
    case 'imageUrl':
      return getMediaUrl(event.image)
    case 'imageAlt':
      return getMediaAlt(event.image)
    case 'courseCount':
      return String(event.courses?.length || 0)
    case 'firstCourse.title':
      return firstCourse?.title || ''
    case 'firstCourse.date':
      return formatDate(firstCourse?.date)
    case 'firstCourse.location':
      return firstCourse?.location || ''
    case 'firstCourse.distance':
      return firstCourse?.distance != null ? `${firstCourse.distance} km` : ''
    case 'firstCourse.elevationGain':
      return firstCourse?.elevationGain != null ? `${firstCourse.elevationGain} D+` : ''
    case 'firstCourse.type':
      if (!firstCourse?.type) return ''
      return firstCourse.type === 'trail' ? 'Trail' : 'Course'
    case 'firstCourse.image':
      return firstCourse?.image || null
    case 'firstCourse.imageUrl':
      return getMediaUrl(firstCourse?.image)
    default:
      return null
  }
}

const replaceInString = (value: string, event: Event): LexicalValue => {
  const fullMatch = fullPlaceholder(value)
  if (fullMatch) {
    const resolved = resolveEventVariable(event, fullMatch)
    if (typeof resolved !== 'string' && resolved != null && isLexicalValue(resolved)) {
      return resolved
    }
  }

  return value.replace(VARIABLE_PATTERN, (match, key: string) => {
    const resolved = resolveEventVariable(event, key)
    if (resolved == null) return match
    return typeof resolved === 'string' ? resolved : match
  })
}

const interpolateNode = (value: LexicalValue, event: Event): LexicalValue => {
  if (typeof value === 'string') {
    return replaceInString(value, event)
  }

  if (Array.isArray(value)) {
    return value.map((item) => interpolateNode(item, event))
  }

  if (value && typeof value === 'object') {
    if (isRichTextDocument(value)) {
      const root = value.root as Record<string, LexicalValue>
      const rootChildren = Array.isArray(root.children) ? root.children : []
      const interpolatedChildren = interpolateRichTextRootChildren(rootChildren, event)

      const interpolatedRoot: Record<string, LexicalValue> = {
        ...root,
        children: interpolatedChildren,
      }

      return {
        ...(value as Record<string, LexicalValue>),
        root: interpolatedRoot,
      }
    }

    const result: Record<string, LexicalValue> = {}
    for (const [key, nested] of Object.entries(value)) {
      result[key] = interpolateNode(nested as LexicalValue, event)
    }
    return result
  }

  return value
}

export const interpolateEventTemplate = <T>(value: T, event: Event): T => {
  return interpolateNode(value as LexicalValue, event) as T
}
