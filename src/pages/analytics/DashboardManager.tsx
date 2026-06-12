// src/pages/analytics/DashboardManager.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Edit, Trash2, Share2, Check, Copy } from 'lucide-react';
import {
  useDashboards,
  useDeleteDashboard,
  useCreateDashboard,
  useUpdateDashboard,
  useShareDashboard,
} from '@/features/dashboards/api/useDashboards';
import { Button } from '@/components/ui/Button';
import { Dialog, FormInput, DialogFooter } from '@/components/ui/Dialog';
import { toast } from 'sonner';

const DashboardManager = () => {
  const navigate = useNavigate();
  const { data: dashboards, isLoading, error } = useDashboards();
  const deleteMutation = useDeleteDashboard();
  const createMutation = useCreateDashboard();
  const updateMutation = useUpdateDashboard();
  const shareMutation = useShareDashboard();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<{ id: string; name: string } | null>(
    null
  );
  const [shareInfo, setShareInfo] = useState<{ name: string; shareUrl: string } | null>(null);
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null);

  const [name, setName] = useState('');

  const handleDelete = (id: string, dashboardName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the dashboard "${dashboardName}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(`Dashboard "${dashboardName}" deleted.`),
        onError: (err) => toast.error(`Failed to delete dashboard: ${err.message}`),
      });
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Dashboard name is required');
      return;
    }

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          toast.success(`Dashboard "${name.trim()}" created!`);
          setIsCreateOpen(false);
          setName('');
          navigate('/analytics');
        },
        onError: (err) => toast.error(`Failed to create dashboard: ${err.message}`),
      }
    );
  };

  const handleEdit = () => {
    if (!editingDashboard) return;
    if (!name.trim()) {
      toast.error('Dashboard name is required');
      return;
    }
    updateMutation.mutate(
      { id: editingDashboard.id, name: name.trim() },
      {
        onSuccess: () => {
          toast.success('Dashboard renamed.');
          setEditingDashboard(null);
          setName('');
        },
        onError: (err) => toast.error(`Failed to update dashboard: ${err.message}`),
      }
    );
  };

  const handleShare = (id: string, dashboardName: string) => {
    shareMutation.mutate(id, {
      onSuccess: (dashboard) => {
        if (dashboard?.shareUrl) {
          setShareInfo({ name: dashboardName, shareUrl: dashboard.shareUrl });
          setCopied(null);
        } else {
          toast.error('Share link was not returned by the server.');
        }
      },
      onError: (err) => toast.error(`Failed to share dashboard: ${err.message}`),
    });
  };

  const copyShare = async (kind: 'link' | 'embed') => {
    if (!shareInfo) return;
    const publicUrl = `${window.location.origin}/shared/${shareInfo.shareUrl}`;
    const text =
      kind === 'link'
        ? publicUrl
        : `<iframe src="${window.location.origin}/embed/${shareInfo.shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    toast.success(kind === 'link' ? 'Public link copied' : 'Embed code copied');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboards</h1>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> New dashboard
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 md:p-6">
        {isLoading && (
          <div className="text-center py-6 text-text-secondary">Loading dashboards…</div>
        )}
        {error && (
          <div className="text-center py-6 text-error">
            Error loading dashboards: {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            {dashboards && dashboards.length > 0 ? (
              dashboards.map((db) => (
                <div
                  key={db.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-surface-2 border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  <button
                    type="button"
                    className="mb-2 md:mb-0 text-left group"
                    onClick={() => navigate('/analytics')}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <LayoutDashboard className="w-5 h-5 text-primary" aria-hidden="true" />
                      <span className="text-base font-semibold group-hover:text-primary transition-colors">
                        {db.name}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary font-mono ml-7">{db.id}</span>
                  </button>
                  <div className="flex gap-2 self-end md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(db.id, db.name)}
                      disabled={shareMutation.isPending && shareMutation.variables === db.id}
                      title="Share dashboard"
                      aria-label={`Share dashboard ${db.name}`}
                    >
                      <Share2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDashboard({ id: db.id, name: db.name });
                        setName(db.name);
                      }}
                      title="Rename dashboard"
                      aria-label={`Rename dashboard ${db.name}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(db.id, db.name)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === db.id}
                      className="border-error/40 text-error hover:border-error hover:bg-error/10"
                      title="Delete dashboard"
                      aria-label={`Delete dashboard ${db.name}`}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === db.id ? (
                        <span className="animate-pulse">…</span>
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-text-secondary">
                No dashboards yet — create your first one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Dashboard Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setName('');
        }}
        title="Create dashboard"
      >
        <FormInput
          label="Dashboard name"
          placeholder="Enter dashboard name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setIsCreateOpen(false);
              setName('');
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create dashboard'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Rename Dashboard Modal */}
      <Dialog
        isOpen={!!editingDashboard}
        onClose={() => {
          setEditingDashboard(null);
          setName('');
        }}
        title="Rename dashboard"
      >
        <FormInput
          label="Dashboard name"
          placeholder="Enter dashboard name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setEditingDashboard(null);
              setName('');
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Share Dashboard Modal */}
      <Dialog isOpen={!!shareInfo} onClose={() => setShareInfo(null)} title="Share dashboard">
        {shareInfo && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-text">{shareInfo.name}</span> is now publicly
              viewable by anyone with this link.
            </p>

            <div>
              <span className="block mb-1.5 text-sm font-medium">Public link</span>
              <div className="flex gap-2">
                <code className="flex-1 min-w-0 truncate rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm font-mono">
                  {`${window.location.origin}/shared/${shareInfo.shareUrl}`}
                </code>
                <Button variant="outline" size="sm" onClick={() => copyShare('link')}>
                  {copied === 'link' ? (
                    <Check className="h-4 w-4 text-success" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <span className="block mb-1.5 text-sm font-medium">Embed code</span>
              <div className="flex gap-2">
                <code className="flex-1 min-w-0 truncate rounded-lg bg-surface-2 border border-border px-3 py-2 text-xs font-mono">
                  {`<iframe src="${window.location.origin}/embed/${shareInfo.shareUrl}" …>`}
                </code>
                <Button variant="outline" size="sm" onClick={() => copyShare('embed')}>
                  {copied === 'embed' ? (
                    <Check className="h-4 w-4 text-success" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="primary" onClick={() => setShareInfo(null)}>
            Done
          </Button>
        </DialogFooter>
      </Dialog>
    </motion.div>
  );
};

export default DashboardManager;
