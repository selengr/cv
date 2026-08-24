export default class ValidationError {
  messages: Record<string, string | string[]>;

  constructor(messages: Record<string, string | string[]> = {}) {
    this.messages = messages;
  }
}

export function applyFieldErrors(
  messages: Record<string, string | string[]>,
  setFieldError: (field: string, message: string) => void,
) {
  Object.entries(messages).forEach(([key, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    if (message) setFieldError(key, String(message));
  });
}
