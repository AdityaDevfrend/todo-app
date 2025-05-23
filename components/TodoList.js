'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2, Edit2, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function TodoList({ user }) {
  const { toast } = useToast();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch todos
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      setTodos(data || []);
      setLoading(false);
    };
    fetchTodos();

    // Real-time subscription with optimized handling
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          
          // Handle different event types
          switch (payload.eventType) {
            case 'INSERT':
              setTodos(prev => {
                // Find a temp todo with the same title
                const tempIndex = prev.findIndex(
                  todo => todo.id.startsWith('temp-') && todo.title === payload.new.title
                );
                if (tempIndex !== -1) {
                  // Replace the temp todo with the real one
                  const newTodos = [...prev];
                  newTodos[tempIndex] = payload.new;
                  return newTodos;
                }
                // If the real todo already exists, do nothing
                if (prev.some(todo => todo.id === payload.new.id)) {
                  return prev;
                }
                // Otherwise, add the new todo
                return [payload.new, ...prev];
              });
              break;
            case 'DELETE':
              console.log('Processing delete for todo:', payload.old.id);
              setTodos(prev => {
                const newTodos = prev.filter(todo => todo.id !== payload.old.id);
                console.log('Updated todos after delete:', newTodos);
                return newTodos;
              });
              break;
            case 'UPDATE':
              setTodos(prev => prev.map(todo => 
                todo.id === payload.new.id ? payload.new : todo
              ));
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to todos changes');
        }
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Add todo
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      setAdding(true);
      // Optimistically add the todo
      const optimisticTodo = {
        id: 'temp-' + Date.now(),
        title: newTodo,
        user_id: user.id,
        completed: false,
        created_at: new Date().toISOString()
      };
      setTodos(prev => [optimisticTodo, ...prev]);
      setNewTodo('');

      const { data, error } = await supabase
        .from('todos')
        .insert({
          title: newTodo,
          user_id: user.id,
          completed: false,
        })
        .select()
        .single();

      if (error) {
        // Remove the optimistic todo if there's an error
        setTodos(prev => prev.filter(todo => todo.id !== optimisticTodo.id));
        setError(error.message);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        // Replace the optimistic todo with the real one
        setTodos(prev => prev.map(todo => 
          todo.id === optimisticTodo.id ? data : todo
        ));
        toast({ title: 'Todo added', description: 'Your todo was added successfully.' });
      }
    } catch (err) {
      console.error('Error adding todo:', err);
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  // Toggle complete
  const handleToggle = async (todo) => {
    try {
      setUpdating(true);
      // Optimistically update the todo
      setTodos(prev => prev.map(t => 
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      ));

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id)
        .select()
        .single();

      if (error) {
        // Revert the optimistic update if there's an error
        setTodos(prev => prev.map(t => 
          t.id === todo.id ? { ...t, completed: todo.completed } : t
        ));
        setError(error.message);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Todo updated', description: 'Todo status updated.' });
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  };

  // Save edit
  const saveEdit = async (todo) => {
    try {
      setUpdating(true);
      const oldTitle = todo.title;
      // Optimistically update the todo
      setTodos(prev => prev.map(t => 
        t.id === todo.id ? { ...t, title: editValue } : t
      ));

      const { error } = await supabase
        .from('todos')
        .update({ title: editValue })
        .eq('id', todo.id)
        .select()
        .single();

      if (error) {
        // Revert the optimistic update if there's an error
        setTodos(prev => prev.map(t => 
          t.id === todo.id ? { ...t, title: oldTitle } : t
        ));
        setError(error.message);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setEditingId(null);
        toast({ title: 'Todo updated', description: 'Todo title updated.' });
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      // Optimistically remove the todo from the list
      setTodos(prev => prev.filter(todo => todo.id !== id));
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        // If there's an error, revert the optimistic update
        const { data } = await supabase
          .from('todos')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setTodos(prev => [...prev, data]);
        }
        setError(error.message);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Todo deleted', description: 'Todo was deleted.' });
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={adding}
        />
        <Button type="submit" disabled={adding || !newTodo.trim()}>Add</Button>
      </form>
      {loading ? (
        <div className="flex justify-center items-center py-10"><Loader2 className="animate-spin" /></div>
      ) : (
        <AnimatePresence>
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
              layout
              className="mb-3"
            >
              <Card className="flex items-center gap-3 p-4">
                <Button
                  size="icon"
                  variant={todo.completed ? 'default' : 'outline'}
                  onClick={() => handleToggle(todo)}
                  disabled={updating}
                  className="rounded-full"
                >
                  <Check className={todo.completed ? 'text-green-500' : ''} />
                </Button>
                {editingId === todo.id ? (
                  <form onSubmit={e => { e.preventDefault(); saveEdit(todo); }} className="flex-1 flex gap-2">
                    <Input value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus />
                    <Button type="submit" size="icon" variant="outline"><Check /></Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => setEditingId(null)}><X /></Button>
                  </form>
                ) : (
                  <span
                    className={`flex-1 text-lg ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.title}
                  </span>
                )}
                <Button size="icon" variant="ghost" onClick={() => startEdit(todo)} disabled={editingId === todo.id}><Edit2 /></Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(todo.id)} disabled={deletingId === todo.id}><Trash2 /></Button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
    </div>
  );
} 