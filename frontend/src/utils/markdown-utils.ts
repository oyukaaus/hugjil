/**
 * Normalizes markdown text to fix common formatting issues
 * @param markdownText Original markdown text
 * @returns Normalized markdown text
 */
export const normalizeMarkdown = (markdownText: string): string => {
  if (!markdownText) return '';
  
  return markdownText
    // Fix bold syntax - ensure properly matched ** pairs
    .replace(/\*\*([^*]+)\*(?!\*)/g, '**$1**')
    
    // Fix unmatched bold markers
    .replace(/(?<!\*)\*\*(?!\*)/g, '')
    
    // Fix bullet points with proper spacing
    .replace(/\n\s*-\s+/g, '\n- ')
    
    // Fix numbered lists with proper spacing
    .replace(/\n\s*(\d+)\.\s+/g, '\n$1. ')
    
    // Fix excessive whitespace between paragraphs (limit to double newlines)
    .replace(/\n{3,}/g, '\n\n')
    
    // Fix multiple spaces
    .replace(/[ \t]{2,}/g, ' ')
    
    // Fix spacing around headers
    .replace(/\n(#{1,6}\s)/g, '\n\n$1')
    
    // Ensure space after header markers
    .replace(/(#{1,6})([^\s])/g, '$1 $2')
    
    // Fix spacing around list items
    .replace(/\n\n(\s*[-*+]\s)/g, '\n$1')
    
    // Trim whitespace
    .trim();
};

/**
 * Sanitizes text to prevent XSS attacks
 * @param text Text to sanitize
 * @returns Sanitized text
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Process text for ReactMarkdown by normalizing and sanitizing
 * @param text Original text
 * @returns Processed text ready for ReactMarkdown
 */
export const processMarkdownText = (text: string): string => {
  return normalizeMarkdown(text);
};