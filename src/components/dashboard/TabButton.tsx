import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabType } from '@/types/journal';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  tabKey: TabType;
  activeTab: TabType;
  onClick: (tab: TabType) => void;
}

export const TabButton = ({ icon: Icon, label, tabKey, activeTab, onClick }: TabButtonProps) => {
  const isActive = activeTab === tabKey;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(tabKey)}
      className={cn(
        'relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-5 h-5 relative z-10" />
      <span className="text-xs font-medium relative z-10">{label}</span>
    </motion.button>
  );
};
