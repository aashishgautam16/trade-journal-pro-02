import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '@/context/JournalContext';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, TrendingUp, TrendingDown, Minus, Trash2, DollarSign, Image, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const ViewJournal = () => {
  const { journals, deleteJournal } = useJournal();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'win':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'loss':
        return <TrendingDown className="w-5 h-5 text-destructive" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'win':
        return 'bg-success/10 text-success border-success/20';
      case 'loss':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (journals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <TrendingUp className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No trades yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start logging your trades to track your progress and improve your trading performance.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {journals.map((journal, index) => (
          <AnimatedCard key={journal.id} delay={index * 0.05}>
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg border', getStatusColor(journal.tradeStatus))}>
                    {getStatusIcon(journal.tradeStatus)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{journal.tradingPair}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(journal.date), 'MMM d, yyyy')}
                      </span>
                      {journal.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {journal.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteJournal(journal.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <span className="text-xs text-muted-foreground block mb-1">Status</span>
                  <span className={cn(
                    'text-sm font-medium capitalize',
                    journal.tradeStatus === 'win' && 'text-success',
                    journal.tradeStatus === 'loss' && 'text-destructive'
                  )}>
                    {journal.tradeStatus}
                  </span>
                </div>

                <div className="bg-secondary/30 rounded-lg p-3">
                  <span className="text-xs text-muted-foreground block mb-1">P/L</span>
                  <span className={cn(
                    'text-sm font-semibold flex items-center gap-1',
                    journal.profitLoss > 0 && 'text-success',
                    journal.profitLoss < 0 && 'text-destructive'
                  )}>
                    <DollarSign className="w-3.5 h-3.5" />
                    {journal.profitLoss > 0 ? '+' : ''}{journal.profitLoss.toFixed(2)}
                  </span>
                </div>

                {journal.riskReward && (
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block mb-1">R:R</span>
                    <span className="text-sm font-medium">{journal.riskReward}</span>
                  </div>
                )}

                {journal.screenshot && (
                  <a
                    href={journal.screenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground block mb-1">Screenshot</span>
                    <span className="text-sm font-medium flex items-center gap-1 text-primary">
                      <Image className="w-3.5 h-3.5" />
                      View
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                )}
              </div>

              {/* Learnings */}
              {journal.learnings && (
                <div className="bg-secondary/20 rounded-lg p-4 border border-border/50">
                  <span className="text-xs text-muted-foreground block mb-2">Learnings</span>
                  <p className="text-sm leading-relaxed">{journal.learnings}</p>
                </div>
              )}
            </div>
          </AnimatedCard>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
