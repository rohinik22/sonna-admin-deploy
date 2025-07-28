import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export default function DatabaseTest() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) {
        setError(`Database Error: ${error.message}`);
        setConnectionStatus('❌ Connection Failed');
      } else {
        setCategories(data || []);
        setConnectionStatus('✅ Connection Successful');
      }
    } catch (err) {
      setError(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setConnectionStatus('❌ Connection Failed');
    } finally {
      setLoading(false);
    }
  };

  const createTestCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: 'Test Category',
          description: 'This is a test category created from the app',
          sort_order: 999
        })
        .select()
        .single();

      if (error) {
        alert(`Error creating category: ${error.message}`);
      } else {
        alert('Test category created successfully!');
        // Refresh the list
        testConnection();
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <p className="text-lg">{connectionStatus}</p>
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Categories List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
            <button
              onClick={createTestCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Test Category
            </button>
          </div>

          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length > 0 ? (
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mt-2">Order: {category.sort_order}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No categories found. Try creating one!</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>If connection is successful, go to your Supabase dashboard</li>
            <li>Run the SQL script from <code>database-setup.sql</code></li>
            <li>Refresh this page to see the sample categories</li>
            <li>Create a storage bucket named "menu-images"</li>
            <li>Start building the admin interface!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
