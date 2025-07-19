import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState, useEffect } from 'react';
import { ai } from '@/Utils';
import toast from 'react-hot-toast';

export default function ReviewButton({ sectionName, content, onReviewComplete }) {
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  // Calculate height based on content
  useEffect(() => {
    if (showSuggestions && suggestions) {
      const changeCount = suggestions.changes.length;
      // Set a reasonable max height based on number of changes
      const height = Math.min(500, 100 + changeCount * 80); // 80px per change item
      setContainerHeight(`${height}px`);
    }
  }, [showSuggestions, suggestions]);

  const analyzeContent = async () => {
    try {
      setLoading(true);
      
      const PROMPT = `Analyze this ${sectionName} section of a resume for:
      1. Spelling and grammatical errors
      2. Clarity and conciseness
      3. Professional tone
      4. Impactful language
      
      Return a JSON object with:
      - "original": the original text 
      - "improved": the improved version with changes
      - "changes": array of objects with:
        * "original": original text segment (only the part which is to be changed)
        * "suggestion": suggested improvement (only the changed part and not the complete sentence)
        * "reason": reason for change
      
      Content to analyze: ${JSON.stringify(content)}`;
      
      const result = await ai.sendMessage(PROMPT);
      const parsed = JSON.parse(result.response.text());
      setSuggestions(parsed);
      setShowSuggestions(true);
    } catch (error) {
      toast.error('Failed to analyze content');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={analyzeContent}
        disabled={loading}
        className="hover:bg-[#4977ec] w-[120px] hover:text-white transition-all duration-100 border border-[#4977ec] text-[#4977ec] h-[30px] text-sm font-medium rounded-md border-primary flex justify-center items-center gap-2"
        btnText={
          loading ? (
            <div className="size-4 fill-[#4977ec] dark:text-[#c5d5ff]">
              {icons.loading}
            </div>
          ) : (
            <>
              {icons.description} Review
            </>
          )
        }
      />
      
      {showSuggestions && suggestions && (
        <div 
          className="absolute z-10 mt-2 w-[400px] right-0 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col"
          style={{ height: containerHeight }}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">AI Suggestions</h3>
              <button 
                onClick={() => setShowSuggestions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                {icons.close}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {suggestions.changes.length > 0 ? (
              suggestions.changes.map((change, i) => (
                <div key={i} className="mb-3 p-2 bg-gray-50 rounded">
                  <div className="flex gap-2">
                    <span className="text-red-500 line-through">{change.original}</span>
                    <span className="text-green-600 font-medium">→ {change.suggestion}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{change.reason}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No suggestions found. Your content looks good!
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onReviewComplete?.(suggestions);
                  setShowSuggestions(false);
                }}
                className="flex-1 text-sm p-2 rounded-lg bg-gray-100"
                btnText="Apply All"
                disabled={suggestions.changes.length === 0}
              />
              <Button
                variant="outline"
                onClick={() => setShowSuggestions(false)}
                className="flex-1 text-sm p-2 rounded-lg bg-gray-100"
                btnText="Close"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}