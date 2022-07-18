/**
 * Trims a long text at a certain amount of characters, and append "..." at the end if it was cutted-out
 * @param text The text to trim
 * @param n The amount of characters to show, minimum 3 or it will throw a RangeError
 * @returns The trimmed text
 */
export function trimText(text: string, n: number): string {
  if (n < 3)
    throw new RangeError('trimText requires at least 3 characters');
  return text.length > n ? `${text.slice(0, n - 3).trimEnd()}...` : text;
}
