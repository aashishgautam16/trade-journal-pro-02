import { motion } from 'framer-motion';
import { useJournal } from '@/context/JournalContext';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { TrendingUp, TrendingDown, Activity, Target, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

export const PnLSummary = () => {
  const { journals, getTotalPnL, getWinRate, getTotalTrades } = useJournal();

  const totalPnL = getTotalPnL();
  const winRate = getWinRate();
  const totalTrades = getTotalTrades();
  const winCount = journals.filter((j) => j.tradeStatus === 'win').length;
  const lossCount = journals.filter((j) => j.tradeStatus === 'loss').length;

  // Prepare chart data (cumulative P/L over time)
  const chartData = journals
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], journal, index) => {
      const prevPnL = index > 0 ? acc[index - 1].pnl : 0;
      acc.push({
        date: format(new Date(journal.date), 'MMM d'),
        pnl: prevPnL + journal.profitLoss,
        dailyPnl: journal.profitLoss,
      });
      return acc;
    }, []);

  const stats = [
    {
      label: 'Total P/L',
      value: `$${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}`,
      icon: DollarSign,
      color: totalPnL >= 0 ? 'text-success' : 'text-destructive',
      bgColor: totalPnL >= 0 ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      color: winRate >= 50 ? 'text-success' : 'text-warning',
      bgColor: winRate >= 50 ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20',
    },
    {
      label: 'Total Trades',
      value: totalTrades.toString(),
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/20',
    },
    {
      label: 'Win/Loss',
      value: `${winCount}/${lossCount}`,
      icon: BarChart3,
      color: 'text-foreground',
      bgColor: 'bg-secondary border-border',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (totalTrades === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <BarChart3 className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No data yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Add some trades to see your P/L analysis and performance metrics.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <AnimatedCard className={cn('border', stat.bgColor)}>
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{stat.label}</span>
                  <span className={cn('text-lg font-bold', stat.color)}>{stat.value}</span>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div variants={itemVariants}>
          <AnimatedCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Cumulative P/L
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={totalPnL >= 0 ? 'hsl(160, 84%, 39%)' : 'hsl(0, 84%, 60%)'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={totalPnL >= 0 ? 'hsl(160, 84%, 39%)' : 'hsl(0, 84%, 60%)'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(215, 20%, 55%)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 40%, 98%)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'P/L']}
                  />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    stroke={totalPnL >= 0 ? 'hsl(160, 84%, 39%)' : 'hsl(0, 84%, 60%)'}
                    strokeWidth={2}
                    fill="url(#pnlGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </motion.div>
      )}

      {/* Recent Performance */}
      <motion.div variants={itemVariants}>
        <AnimatedCard>
          <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
          <div className="space-y-2">
            {journals.slice(0, 5).map((journal) => (
              <div
                key={journal.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {journal.tradeStatus === 'win' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : journal.tradeStatus === 'loss' ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{journal.tradingPair}</span>
                </div>
                <span
                  className={cn(
                    'font-semibold',
                    journal.profitLoss > 0 ? 'text-success' : journal.profitLoss < 0 ? 'text-destructive' : ''
                  )}
                >
                  {journal.profitLoss > 0 ? '+' : ''}${journal.profitLoss.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </motion.div>
    </motion.div>
  );
};
