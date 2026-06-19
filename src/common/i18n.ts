import { BadRequestException } from '@nestjs/common';

export const SUPPORTED_LANGS = ['pt', 'en', 'de'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGS.includes(lang as SupportedLanguage);
}

export function validateLanguage(lang: string): SupportedLanguage {
  if (!isSupportedLanguage(lang)) {
    throw new BadRequestException(`Idioma inválido: "${lang}". Use pt, en ou de.`);
  }
  return lang;
}

export function translateLocalizedValue<T>(value: T, lang: SupportedLanguage): T {
  if (Array.isArray(value)) {
    return value.map((item) => translateLocalizedValue(item, lang)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (isLocalizedField(value)) {
    const resolved = value[lang] ?? SUPPORTED_LANGS.map((l) => value[l]).find((v) => v !== undefined);
    return resolved as T;
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
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => SUPPORTED_LANGS.includes(key as SupportedLanguage));
}
