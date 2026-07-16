import { useState } from 'react';
import axios from 'axios';
import { Workflow, WorkflowGraph } from '../types';

interface WorkflowParserProps {
  onParsed: (data: { workflow: Workflow; graph: WorkflowGraph }) => void;
}

export const WorkflowParser = ({ onParsed }: WorkflowParserProps) => {
  const [yamlContent, setYamlContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!yamlContent.trim()) {
      setError('Please enter or paste a workflow YAML');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/parse-workflow', { yamlContent });
      if (response.data.success) {
        onParsed(response.data);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to parse workflow';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/sample-workflow');
      setYamlContent(response.data.yamlContent);
    } catch (err) {
      setError('Failed to load sample workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setYamlContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleLoadSample}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          📋 Load Sample
        </button>
        <label className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-lg transition-colors cursor-pointer">
          📁 Upload File
          <input
            type="file"
            accept=".yml,.yaml"
            onChange={handleFileUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
        <button
          onClick={handleParse}
          disabled={loading || !yamlContent.trim()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Parsing...' : '✨ Visualize'}
        </button>
      </div>

      <textarea
        value={yamlContent}
        onChange={(e) => setYamlContent(e.target.value)}
        placeholder="Paste your GitHub Actions workflow YAML here..."
        className="w-full h-48 p-3 border-2 border-gray-300 rounded-lg font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none resize-none"
      />

      {error && (
        <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
          <div className="text-red-800 font-semibold text-sm">❌ Error</div>
          <div className="text-red-700 text-sm mt-1">{error}</div>
        </div>
      )}

      <div className="text-xs text-gray-600 space-y-1">
        <p>💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Paste a complete GitHub Actions workflow YAML file</li>
          <li>Upload a .yml or .yaml file from your repository</li>
          <li>Click "Load Sample" to see an example workflow</li>
        </ul>
      </div>
    </div>
  );
};
