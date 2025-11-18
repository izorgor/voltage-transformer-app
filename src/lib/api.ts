import { z } from 'zod';
import type { Transformer } from '@/types/transformer';

/**
 * Zod schema for voltage reading validation
 * Accepts both number and string, converting string to number
 */
const VoltageReadingSchema = z.object({
  timestamp: z.string().min(1),
  voltage: z.union([
    z.number(),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num)) {
        throw new Error(`Invalid voltage value: ${val}`);
      }
      return num;
    }),
  ]),
});

/**
 * Zod schema for transformer validation
 */
const TransformerSchema = z.object({
  assetId: z.number(),
  name: z.string().min(1),
  region: z.string().min(1),
  health: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'Critical']),
  lastTenVoltageReadings: z.array(VoltageReadingSchema),
});

/**
 * Fetches transformer data from the JSON file with runtime validation
 */
export const fetchTransformers = async (): Promise<Transformer[]> => {
  const response = await fetch('/sampledata.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch transformer data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Validate and transform data using Zod
  const validatedData = z.array(TransformerSchema).parse(data);

  return validatedData;
};
