import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Page } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setPages((data as Page[]) || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);

    const { error } = await supabase
      .from('pages')
      .update({
        title: editingPage.title,
        content: editingPage.content,
        is_active: editingPage.is_active,
      })
      .eq('id', editingPage.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Page updated successfully' });
      setDialogOpen(false);
      fetchPages();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pages</h1>
        <p className="text-muted-foreground">Manage footer and policy pages</p>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="admin-card flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{page.title}</h3>
              <p className="text-sm text-muted-foreground">/{page.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-2 py-1 ${
                page.is_active ? 'bg-success/20 text-success' : 'bg-muted'
              }`}>
                {page.is_active ? 'Active' : 'Hidden'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingPage(page);
                  setDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingPage?.title}</DialogTitle>
          </DialogHeader>
          
          {editingPage && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage(p => p ? { ...p, title: e.target.value } : null)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editingPage.content || ''}
                  onChange={(e) => setEditingPage(p => p ? { ...p, content: e.target.value } : null)}
                  className="mt-1"
                  rows={10}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={editingPage.is_active}
                  onCheckedChange={(checked) => setEditingPage(p => p ? { ...p, is_active: checked } : null)}
                />
                <Label htmlFor="active">Page is visible</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Page'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
