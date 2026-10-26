export type Route =
  | { name: 'home' }
  | { name: 'topic'; topicId: string }
  | { name: 'chapter'; topicId: string; chapterId: string; sectionId?: string }
  | { name: 'quiz'; topicId: string; chapterId: string }
  | { name: 'review'; topicId?: string; cardIds?: string[] }

export function parseHash(raw: string): Route {
  const path = raw.replace(/^#/, '')
  const [segments, query] = path.split('?')
  const params = new URLSearchParams(query ?? '')
  const parts = segments.split('/').filter(Boolean)

  if (parts[0] === 'topic' && parts[1] && parts[2] === 'chapter' && parts[3]) {
    return {
      name: 'chapter',
      topicId: parts[1],
      chapterId: parts[3],
      sectionId: params.get('s') ?? undefined,
    }
  }
  if (parts[0] === 'topic' && parts[1]) return { name: 'topic', topicId: parts[1] }
  if (parts[0] === 'quiz' && parts[1] && parts[2]) {
    return { name: 'quiz', topicId: parts[1], chapterId: parts[2] }
  }
  if (parts[0] === 'review') {
    const cards = params.get('cards')
    return {
      name: 'review',
      topicId: parts[1],
      cardIds: cards ? cards.split(',').filter(Boolean) : undefined,
    }
  }
  return { name: 'home' }
}

export function go(path: string): void {
  location.hash = path
}
