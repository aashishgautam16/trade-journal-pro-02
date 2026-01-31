import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '@/context/JournalContext';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const NotesSection = () => {
  const { notes, addNote, updateNote, deleteNote } = useJournal();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editData, setEditData] = useState({ title: '', content: '' });

  const handleAdd = () => {
    if (!newNote.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    addNote(newNote);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
    toast.success('Note added!');
  };

  const handleEdit = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditData({ title: note.title, content: note.content });
      setEditingId(noteId);
    }
  };

  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (editingId) {
      updateNote(editingId, editData);
      setEditingId(null);
      toast.success('Note updated!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Add Button */}
      {!isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full bg-gradient-to-r from-primary to-cyan-400 hover:opacity-90 text-primary-foreground font-semibold py-6 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Note
          </Button>
        </motion.div>
      )}

      {/* Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnimatedCard className="border border-primary/30">
              <div className="space-y-4">
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="bg-secondary/50 border-border/50 text-lg font-medium"
                />
                <Textarea
                  placeholder="Write your notes here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="bg-secondary/50 border-border/50 min-h-[120px] resize-none"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAdd}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setNewNote({ title: '', content: '' });
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      {notes.length === 0 && !isAdding ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <StickyNote className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Create notes to capture trading strategies, market observations, or important reminders.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnimatedCard>
                  {editingId === note.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="bg-secondary/50 border-border/50 text-lg font-medium"
                      />
                      <Textarea
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        className="bg-secondary/50 border-border/50 min-h-[100px] resize-none"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="bg-success hover:bg-success/90"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.updatedAt), 'MMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(note.id)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              deleteNote(note.id);
                              toast.success('Note deleted');
                            }}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {note.content && (
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}
                    </>
                  )}
                </AnimatedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
