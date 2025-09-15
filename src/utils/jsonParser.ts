export const parseJsonFromResponse = <T>(text: string): T | null => {
  try {
    // First, try to parse directly, in case the response is a clean JSON.
    return JSON.parse(text) as T;
  } catch (e) {
    // If it fails, try to extract from a markdown block.
    const markdownMatch = text.match(/```json\s*([\s\S]+?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]) as T;
      } catch (error) {
        console.error("Failed to parse extracted JSON from markdown:", error);
      }
    }

    // If that fails, try to find the first '{' and last '}'.
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonString = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonString) as T;
      } catch (error) {
        console.error("Failed to parse extracted JSON from braces:", error);
      }
    }

    console.error("Could not find or parse JSON in the response string.");
    console.error("Original string:", text);
    return null;
  }
};
