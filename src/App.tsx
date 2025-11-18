import { useTransformers } from '@/hooks/useTransformers';
import { Layout } from '@/components/Layout';
import { TransformerTable } from '@/components/TransformerTable';
import { TransformerChart } from '@/components/TransformerChart';
import { Spinner } from '@/components/ui/Spinner';

function App() {
  const { data, isLoading, error } = useTransformers();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading transformer data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading data</h3>
            <p className="mt-2 text-sm text-gray-600">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No transformer data available</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <TransformerChart data={data} />
        <TransformerTable data={data} />
      </div>
    </Layout>
  );
}

export default App;
