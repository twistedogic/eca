type Child = Node | string | null | undefined | false | Child[]

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, unknown> | null = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v as string
    else if (k === 'html') el.innerHTML = v as string
    else if (k.startsWith('on') && typeof v === 'function') {
      const type = k.slice(2).toLowerCase()
      el.addEventListener(type, v as EventListener)
    } else el.setAttribute(k, String(v))
  }
  append(el, children)
  return el
}

function append(el: HTMLElement, children: Child[]): void {
  for (const c of children) {
    if (c == null || c === false) continue
    if (Array.isArray(c)) append(el, c)
    else el.append(c as Node | string)
  }
}

export function clear(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild)
}
