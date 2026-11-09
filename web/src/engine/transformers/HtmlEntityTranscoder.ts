/**
 * Get a copy of {@link text} where all HTML entities are replaced by their corresponding UTF-8 characters.
 */
export function DecodeEntities(text: string) {
    const element = globalThis.document?.createElement('textarea');
    element.innerHTML = text;
    return element.value;
}