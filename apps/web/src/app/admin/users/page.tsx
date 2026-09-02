'use client';

import { useEffect, useState } from 'react';
import { Users, Search, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton, EmptyState, Badge, Button } from '@/components/ui';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  organization: {
    name: string;
  } | null;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);

      const res = await api.get<{ data: User[]; meta: Meta }>(`/users?${params}`);
      setUsers(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      if (currentStatus) {
        await api.delete(`/users/${id}`);
      } else {
        // Assume there's an activate endpoint or a patch endpoint, wait, our backend has remove() which deactivates.
        // We'll just alert for now for activation if no specific endpoint exists
        alert('Activation functionality requires backend update. Deactivation works.');
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage platform users and roles</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select
            className="input h-10 w-full sm:w-48"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="STARTUP_USER">Startup</option>
            <option value="GOVERNMENT_OFFICER">Government</option>
            <option value="EVALUATOR">Evaluator</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="input pl-10 h-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="w-10 h-10" />}
            title="No users found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {u.organization?.name || <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="gray">{u.role.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.isActive ? (
                        <span className="flex items-center text-green-600 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {u.isActive && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="!py-1 !px-3"
                          onClick={() => toggleStatus(u.id, true)}
                        >
                          Deactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-gray-600">Page {meta.page} of {meta.totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
