// src/pages/docs/CodeBlock.tsx — labelled code block with a copy-to-clipboard button.
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeBlockProps {
  label: string;
  code: string;
  maxHeight?: string;
}

export const CodeBlock = ({ label, code, maxHeight }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-medium">{label}</h5>
        <Button size="sm" variant="outline" onClick={copy} className="gap-1">
          {copied ? (
            <Check className="w-3 h-3 text-success" aria-hidden="true" />
          ) : (
            <Copy className="w-3 h-3" aria-hidden="true" />
          )}
          Copy
        </Button>
      </div>
      <pre
        className="bg-surface-2 border border-border p-4 rounded-lg overflow-x-auto text-sm font-mono"
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
      >
        {code}
      </pre>
    </div>
  );
};
