type NewsletterPreparedStatement = {
  bind(...values: unknown[]): NewsletterPreparedStatement;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
};

type NewsletterDatabase = {
  prepare(query: string): NewsletterPreparedStatement;
  batch(statements: NewsletterPreparedStatement[]): Promise<unknown>;
};

declare global {
  // Sites injects this binding. It remains absent in the session-only Vercel mirror.
  var __NEWSLETTER_BUILDER_ENV__:
    | { DB?: NewsletterDatabase }
    | undefined;
}

export {};
