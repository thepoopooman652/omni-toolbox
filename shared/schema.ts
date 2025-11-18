import { z } from "zod";

// This app is primarily client-side with minimal backend persistence needs
// Most tools operate entirely in the browser

export const unitCategories = [
  "length",
  "weight",
  "temperature",
  "volume",
  "time",
  "digital",
  "area",
  "speed",
] as const;

export type UnitCategory = typeof unitCategories[number];

// File conversion result schema
export const fileConversionResultSchema = z.object({
  originalName: z.string(),
  convertedData: z.string(), // base64 or data URL
  format: z.string(),
  size: z.number().optional(),
});

export type FileConversionResult = z.infer<typeof fileConversionResultSchema>;
