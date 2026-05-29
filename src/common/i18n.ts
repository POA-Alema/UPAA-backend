export const SUPPORTED_LANGS = ['pt', 'en', 'de'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGS.includes(lang as SupportedLanguage);
}

export function translateLocalizedValue<T>(value: T, lang: SupportedLanguage): T {
  if (Array.isArray(value)) {
    return value.map((item) => translateLocalizedValue(item, lang)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (isLocalizedField(value)) {
    return (value[lang] ?? value.pt) as T;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [
      key,
      translateLocalizedValue(fieldValue, lang),
    ]),
  ) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isLocalizedField(value: Record<string, unknown>): boolean {
  return SUPPORTED_LANGS.some((language) => language in value);
}