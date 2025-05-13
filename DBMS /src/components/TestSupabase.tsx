import { useEffect, useState } from 'react';
import { supabase } from '../services/database.service';

const TestSupabase: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('users').select('count').single();
        
        if (error) {
          throw error;
        }
        
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      {status === 'loading' && (
        <div className="flex items-center text-blue-600">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Testing connection...
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-green-600 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Connected to Supabase successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-red-600">
          <p className="font-medium">Connection failed:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TestSupabase;