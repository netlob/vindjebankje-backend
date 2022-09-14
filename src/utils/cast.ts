import { HttpException } from '@nestjs/common';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
  required?: boolean;
}

export function toLowerCase(value: string): string {
  return value.toLowerCase();
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseFloat(value || String(opts.default));

  if (Number.isNaN(newValue)) {
    if (opts.required == false) {
      newValue = opts.default;
    } else {
      throw new HttpException('Invalid request', 400);
    }
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}
