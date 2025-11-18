import { useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, isValid } from 'date-fns';
import type { Transformer } from '@/types/transformer';
import { useChartStore } from '@/store/chartStore';
import { getHealthColor } from '@/lib/utils';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface TransformerChartProps {
  data: Transformer[];
}

// Chart configuration constants
const CHART_MARGIN = { top: 5, right: 30, left: 20, bottom: 5 } as const;
const Y_AXIS_LABEL = { value: 'Voltage (V)', angle: -90, position: 'insideLeft' } as const;
const TOOLTIP_STYLE = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
} as const;
const LINE_DOT = { r: 3 } as const;
const LINE_ACTIVE_DOT = { r: 5 } as const;

export function TransformerChart({ data }: TransformerChartProps) {
  const { selectedTransformers, selectAll, toggleTransformer, setSelectAll } = useChartStore();

  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    const readingsByTimestamp = new Map<string, Map<string, number>>();

    data.forEach((transformer) => {
      transformer.lastTenVoltageReadings.forEach((reading) => {
        if (!readingsByTimestamp.has(reading.timestamp)) {
          readingsByTimestamp.set(reading.timestamp, new Map());
        }
        readingsByTimestamp.get(reading.timestamp)!.set(transformer.name, reading.voltage);
      });
    });

    // Sort timestamps and transform data
    const sortedTimestamps = Array.from(readingsByTimestamp.keys()).sort();

    return sortedTimestamps
      .map((timestamp) => {
        try {
          const date = new Date(timestamp);

          // Validate date
          if (!isValid(date)) {
            console.warn(`Invalid timestamp: ${timestamp}`);
            return null;
          }

          const dataPoint: Record<string, string | number> = {
            timestamp,
            formattedTime: format(date, 'MMM dd HH:mm'),
          };

          const readings = readingsByTimestamp.get(timestamp)!;
          readings.forEach((voltage, name) => {
            dataPoint[name] = voltage;
          });

          return dataPoint;
        } catch (error) {
          console.error(`Error formatting timestamp ${timestamp}:`, error);
          return null;
        }
      })
      .filter((point): point is Record<string, string | number> => point !== null);
  }, [data]);

  // Get transformers that should be displayed
  const visibleTransformers = useMemo(() => {
    if (selectAll) {
      return data;
    }
    return data.filter((t) => selectedTransformers.includes(t.assetId));
  }, [data, selectedTransformers, selectAll]);

  const handleToggle = useCallback(
    (assetId: number) => {
      toggleTransformer(assetId);
    },
    [toggleTransformer]
  );

  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
  }, [selectAll, setSelectAll]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voltage Readings Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-4">
          <Checkbox
            id="select-all"
            label="All Transformers"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          {data.map((transformer) => (
            <Checkbox
              key={transformer.assetId}
              id={`transformer-${transformer.assetId}`}
              label={transformer.name}
              checked={!selectAll && selectedTransformers.includes(transformer.assetId)}
              disabled={selectAll}
              onChange={() => handleToggle(transformer.assetId)}
            />
          ))}
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="formattedTime" stroke="#6b7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} label={Y_AXIS_LABEL} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              {visibleTransformers.map((transformer) => (
                <Line
                  key={transformer.assetId}
                  type="monotone"
                  dataKey={transformer.name}
                  stroke={getHealthColor(transformer.health)}
                  strokeWidth={2}
                  dot={LINE_DOT}
                  activeDot={LINE_ACTIVE_DOT}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {visibleTransformers.length === 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Select at least one transformer to display the chart
          </div>
        )}
      </CardContent>
    </Card>
  );
}
