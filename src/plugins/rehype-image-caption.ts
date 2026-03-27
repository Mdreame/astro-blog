/**
 * Wraps markdown images that have alt text in <figure> + <figcaption>.
 * Only runs on markdown/MDX content (not on Astro/React components).
 */
const rehypeImageCaption = () => {
  return (tree: any) => {
    walk(tree)
  }
}

function walk(node: any): void {
  if (!Array.isArray(node.children)) return

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    if (child.type !== 'element') {
      walk(child)
      continue
    }

    if (child.tagName === 'img') {
      const alt = child.properties?.alt
      if (typeof alt === 'string' && alt.trim() !== '' && node.tagName !== 'figure') {
        node.children[i] = {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: [
            child,
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: alt.trim() }],
            },
          ],
        }
        // Don't recurse into the newly created figure — the img is already processed
      }
    } else {
      walk(child)
    }
  }
}

export default rehypeImageCaption
