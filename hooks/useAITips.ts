import { useState, useEffect } from 'react';
export function useAITip(context: string = "general", userPreferences: any = {}) {
const [tip, setTip] = useState<string>("");
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

const generateNewTip = async () => {
setLoading(true);
setError(null);
try {
  const response = await fetch('/api/generate-tip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context,
      userPreferences
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate tip');
  }

  const data = await response.json();
  setTip(data.tip);
} catch (err) {
  console.error('Error generating AI tip:', err);
  setError('Failed to generate tip');
  // Fallback tips will be handled by the API
} finally {
  setLoading(false);
}
};

useEffect(() => {
generateNewTip();
}, [context, JSON.stringify(userPreferences)]);

return {
tip,
loading,
error,
refreshTip: generateNewTip
};
}