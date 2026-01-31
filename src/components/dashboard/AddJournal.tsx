import { useState } from 'react';
import { motion } from 'framer-motion';
import { useJournal } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, TrendingDown, Minus, DollarSign, Image, BookOpen, Save } from 'lucide-react';
import { toast } from 'sonner';

export const AddJournal = () => {
  const { addJournal } = useJournal();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tradingPair: '',
    time: '',
    riskReward: '',
    tradeStatus: '' as 'win' | 'loss' | 'breakeven' | '',
    profitLoss: '',
    screenshot: '',
    learnings: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tradingPair || !formData.tradeStatus) {
      toast.error('Please fill in all required fields');
      return;
    }

    addJournal({
      date: formData.date,
      tradingPair: formData.tradingPair,
      time: formData.time,
      riskReward: formData.riskReward,
      tradeStatus: formData.tradeStatus as 'win' | 'loss' | 'breakeven',
      profitLoss: parseFloat(formData.profitLoss) || 0,
      screenshot: formData.screenshot,
      learnings: formData.learnings,
    });

    toast.success('Trade journal added successfully!');
    setFormData({
      date: new Date().toISOString().split('T')[0],
      tradingPair: '',
      time: '',
      riskReward: '',
      tradeStatus: '',
      profitLoss: '',
      screenshot: '',
      learnings: '',
    });
  };

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

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            Date
          </Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-secondary/50 border-border/50"
          />
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4 text-primary" />
            Time
          </Label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="bg-secondary/50 border-border/50"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trading Pair */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-primary" />
            Trading Pair *
          </Label>
          <Input
            placeholder="e.g., BTC/USD, EUR/USD"
            value={formData.tradingPair}
            onChange={(e) => setFormData({ ...formData, tradingPair: e.target.value })}
            className="bg-secondary/50 border-border/50"
            required
          />
        </div>

        {/* Risk Reward */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Risk : Reward</Label>
          <Input
            placeholder="e.g., 1:2, 1:3"
            value={formData.riskReward}
            onChange={(e) => setFormData({ ...formData, riskReward: e.target.value })}
            className="bg-secondary/50 border-border/50"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trade Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Trade Status *</Label>
          <Select
            value={formData.tradeStatus}
            onValueChange={(value) => setFormData({ ...formData, tradeStatus: value as any })}
          >
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="win">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Win
                </span>
              </SelectItem>
              <SelectItem value="loss">
                <span className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  Loss
                </span>
              </SelectItem>
              <SelectItem value="breakeven">
                <span className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                  Breakeven
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Profit/Loss */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-primary" />
            Profit / Loss ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            placeholder="e.g., 150.00 or -50.00"
            value={formData.profitLoss}
            onChange={(e) => setFormData({ ...formData, profitLoss: e.target.value })}
            className="bg-secondary/50 border-border/50"
          />
        </div>
      </motion.div>

      {/* Screenshot URL */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Image className="w-4 h-4 text-primary" />
          Screenshot URL (optional)
        </Label>
        <Input
          placeholder="https://..."
          value={formData.screenshot}
          onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
          className="bg-secondary/50 border-border/50"
        />
      </motion.div>

      {/* Learnings */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <BookOpen className="w-4 h-4 text-primary" />
          Learnings & Notes
        </Label>
        <Textarea
          placeholder="What did you learn from this trade? What went well? What could be improved?"
          value={formData.learnings}
          onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
          className="bg-secondary/50 border-border/50 min-h-[120px] resize-none"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-cyan-400 hover:opacity-90 text-primary-foreground font-semibold py-6 rounded-xl transition-all duration-300 glow-primary"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Trade Journal
        </Button>
      </motion.div>
    </motion.form>
  );
};
