/**
 * Convert Portable Text content to plain text string
 * Used for read time calculation and SEO meta descriptions
 */
export function toPlainText(blocks = []) {
  if (!Array.isArray(blocks)) return ''
  
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text || '').join('')
    })
    .join('\n\n')
}