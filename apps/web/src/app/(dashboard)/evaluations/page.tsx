'use client';

import { useEffect, useState } from 'react';
import { Star, Clock, CheckCircle, ArrowRight, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button, EmptyState, Skeleton, Badge } from '@/components/ui';
import { useAuthStore, isEvaluator, isGovernmentUser } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Assignment {
  id: string;
  applicationId: string;
  isCompleted: boolean;
  dueDate: string | null;
  completedAt: string | null;
  application: {
    challenge: {
      id: string;
      title: string;
    };
    startupProfile: {
      organization: {
        id: string;
        name: string;
        logoUrl: string | null;
      };
    };
  };
}

export default function EvaluationsPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role && isEvaluator(role)) {
      fetchAssignments();
    } else {
      setLoading(false);
    }
  }, [role]);

  const fetchAssignments = async () => {
    try {
      const res = await api.get<Assignment[]>('/evaluations/my-assignments');
      setAssignments(res);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isEvaluator(role) && !loading) {
    return (
      <div className="p-8">
        <h1 className="page-title mb-6">Evaluations</h1>
        <EmptyState
          icon={<Star className="w-10 h-10" />}
          title="Evaluator Portal"
          description="Only Evaluator accounts can view assignments here. Government officers should manage evaluations from the specific Challenge page."
        />
      </div>
    );
  }

  const pending = assignments.filter((a) => !a.isCompleted);
  const completed = assignments.filter((a) => a.isCompleted);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">My Evaluations</h1>
          <p className="page-subtitle">
            {pending.length} pending applications to review
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={<Star className="w-10 h-10" />}
          title="No assignments"
          description="You currently have no applications assigned for evaluation."
        />
      ) : (
        <div className="space-y-10">
          {/* Pending */}
          {pending.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pending Review ({pending.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pending.map((a) => (
                  <div key={a.id} className="card p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:border-indigo-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="orange">Pending</Badge>
                        {a.dueDate && (
                          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Due {formatDate(a.dueDate)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                        {a.application.startupProfile.organization.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        Challenge: {a.application.challenge.title}
                      </p>
                    </div>
                    <Link href={`/evaluations/${a.applicationId}`} className="shrink-0 w-full sm:w-auto">
                      <Button variant="primary" className="w-full">
                        Evaluate <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Completed ({completed.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completed.map((a) => (
                  <div key={a.id} className="card p-5 hover:border-gray-300 transition-colors bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="green">Scored</Badge>
                      <span className="text-xs text-gray-500">
                        Completed {formatDate(a.completedAt ?? '')}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                      {a.application.startupProfile.organization.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mb-4">
                      Challenge: {a.application.challenge.title}
                    </p>
                    <Link href={`/evaluations/${a.applicationId}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        View Score
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
