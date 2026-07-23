export {};

declare global {
  var __NEWSLETTER_BUILDER_ENV__: {
    DB?: D1Database;
  } | undefined;
}
