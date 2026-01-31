import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TabButton } from '@/components/dashboard/TabButton';
import { AddJournal } from '@/components/dashboard/AddJournal';
import { ViewJournal } from '@/components/dashboard/ViewJournal';
import { PnLSummary } from '@/components/dashboard/PnLSummary';
import { NotesSection } from '@/components/dashboard/NotesSection';
import { TabType } from '@/types/journal';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye, BarChart3, StickyNote, LogOut, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('add');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddJournal />;
      case 'view':
        return <ViewJournal />;
      case 'pnl':
        return <PnLSummary />;
      case 'notes':
        return <NotesSection />;
      default:
        return null;
    }
  };

  const tabs = [
    { key: 'add' as TabType, label: 'Add', icon: PlusCircle },
    { key: 'view' as TabType, label: 'View', icon: Eye },
    { key: 'pnl' as TabType, label: 'P/L', icon: BarChart3 },
    { key: 'notes' as TabType, label: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center glow-primary">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">Trading Journal</h1>
                <p className="text-xs text-muted-foreground">
                  Welcome, <span className="text-primary font-medium">{user?.username}</span>
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Desktop Tabs */}
      <div className="hidden md:block container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-2 inline-flex gap-2"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              tabKey={tab.key}
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
        className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 px-4 py-2 z-50"
      >
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              tabKey={tab.key}
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          ))}
        </div>
      </motion.nav>
    </div>
  );
};

export default Dashboard;
