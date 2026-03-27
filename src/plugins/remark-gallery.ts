import { visit } from 'unist-util-visit'

/**
 * Transforms :::gallery container directives into <div class="gallery"> HTML elements.
 * Requires remark-directive to be registered before this plugin.
 */
const remarkGallery = () => {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'gallery') return
      node.data = {
        hName: 'div',
        hProperties: { class: 'gallery not-prose' },
      }
    })
  }
}

export default remarkGallery
