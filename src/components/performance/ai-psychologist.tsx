
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { patternDetection, PatternDetectionOutput } from '@/ai/flows/pattern-detection';
import type { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

export function AIPsychologist({ trades }: { trades: Trade[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PatternDetectionOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);

    const tradeNotes = trades
      .map(trade => {
        let note = `Trade on ${trade.asset} (${trade.result}):\n`;
        if (trade.notes) note += `- Notes: ${trade.notes}\n`;
        if (trade.preTradeEmotion) note += `- Pre-Trade Emotion: ${trade.preTradeEmotion}\n`;
        if (trade.postTradeEmotion) note += `- Post-Trade Emotion: ${trade.postTradeEmotion}\n`;
        if (trade.marketContext) note += `- Market Context: ${trade.marketContext}\n`;
        if (trade.entryReason) note += `- Entry Reason: ${trade.entryReason}\n`;
        if (trade.tradeFeelings) note += `- Feelings During Trade: ${trade.tradeFeelings}\n`;
        if (trade.lossAnalysis) note += `- Loss Analysis: ${trade.lossAnalysis}\n`;
        return note;
      })
      .join('\n---\n');

    if (tradeNotes.trim().length < 100) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Data',
        description: 'Please add more detailed notes to your trades for a meaningful analysis.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await patternDetection({ tradeNotes });
      setAnalysis(result);
    } catch (error) {
      console.error('AI pattern detection failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'The AI could not complete the analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Psychologist</CardTitle>
        <CardDescription>Uncover hidden patterns in your trading behavior.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading || trades.length === 0} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze My Journal'}
        </Button>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle>AI Insights</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-sans text-sm">
                  {analysis.patterns}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
