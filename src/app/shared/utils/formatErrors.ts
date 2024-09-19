export function formatErrors(errors: { [key: string]: string[] }): string {
    return Object.entries(errors)
      .map(([category, messages]) => 
        `${category}:\n${messages.join('\n')}`
      )
      .join('\n\n');
  }