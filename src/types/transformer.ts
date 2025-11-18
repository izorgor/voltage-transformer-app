export interface VoltageReading {
  timestamp: string;
  voltage: number;
}

export interface Transformer {
  assetId: number;
  name: string;
  region: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  lastTenVoltageReadings: VoltageReading[];
}

export type HealthStatus = Transformer['health'];

export interface TransformerTableRow {
  assetId: number;
  name: string;
  region: string;
  health: HealthStatus;
}
