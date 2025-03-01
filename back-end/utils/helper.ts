function extractJsonFromResponse(text: string): string {
  // Check if the response contains backtick code blocks
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);

  if (match && match[1]) {
    // If we found a code block, return its contents
    return match[1].trim();
  }

  // Otherwise return the original text after trimming
  return text.trim();
}
