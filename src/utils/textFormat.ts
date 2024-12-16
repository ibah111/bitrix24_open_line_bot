export function formatText(input: string): string {
  return input.replace(/\[b\](.*?)\[\/b\]/g, '**$1**').replace('[br]', '\n'); // Преобразование [b]текст[/b] в жирный текст (Markdown)
}
