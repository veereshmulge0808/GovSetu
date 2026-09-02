'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText, ArrowLeft, Building2, Calendar, FileBadge, CheckCircle, Clock, Send
} from 'lucide-react';
import Link from 'next/link';
import { Button, Skeleton, Badge } from '@/components/ui';
import { useAuthStore, isStartup, isGovernmentUser, isEvaluator } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface EvaluatorAssignment {
  id: string;
  isCompleted: boolean;
  evaluator: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Application {
  id: string;
  status: string;
  challengeId: string;
  startupProfileId: string;
  executiveSummary: string | null;
  technicalApproach: string | null;
  implementationPlan: string | null;
  teamDescription: string | null;
  previousExperience: string | null;
  proposedBudgetLakh: number | null;
  proposedTimeline: string | null;
  submittedAt: string | null;
  createdAt: string;
  challenge: {
    id: string;
    title: string;
    organization: {
      name: string;
    };
  };
  startupProfile: {
    organization: {
      name: string;
      logoUrl: string | null;
    };
  };
  evaluatorAssignments: EvaluatorAssignment[];
  documents: any[];
}

const getAppStatusBadge = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'badge-gray';
    case 'SUBMITTED': return 'badge-blue';
    case 'UNDER_REVIEW': return 'badge-yellow';
    case 'ADDITIONAL_INFO_REQUIRED': return 'badge-orange';
    case 'SHORTLISTED': return 'badge-indigo';
    case 'REJECTED': return 'badge-red';
    case 'SELECTED': return 'badge-green';
    case 'PILOT_STAGE': return 'badge-purple';
    case 'COMPLETED': return 'badge-green';
    default: return 'badge-gray';
  }
};

const getAppStatusLabel = (status: string) => {
  return status.replace(/_/g, ' ');
};

export default function ApplicationDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthStore();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetchApp();
  }, [id]);

  const fetchApp = async () => {
    try {
      const res = await api.get<Application>(`/applications/${id}`);
      setApp(res);
    } catch {
      router.push('/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit this application? You will not be able to edit it once submitted.')) return;
    setSubmitting(true);
    try {
      await api.post(`/applications/${id}/submit`);
      await fetchApp();
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Change application status to ${newStatus.replace(/_/g, ' ')}?`)) return;
    setTransitioning(true);
    try {
      await api.patch(`/applications/${id}/status`, { status: newStatus });
      await fetchApp();
    } finally {
      setTransitioning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!app) return null;

  const role = user?.role;
  const canEdit = isStartup(role) && (app.status === 'DRAFT' || app.status === 'ADDITIONAL_INFO_REQUIRED');
  const canSubmit = isStartup(role) && app.status === 'DRAFT';
  const canTransition = isGovernmentUser(role) && app.status !== 'DRAFT';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link href="/applications" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      {/* Header Card */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={getAppStatusBadge(app.status)}>
                {getAppStatusLabel(app.status)}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDate(app.submittedAt ?? app.createdAt)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application for: <Link href={`/challenges/${app.challengeId}`} className="text-indigo-600 hover:underline">{app.challenge.title}</Link>
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gray-400" />
                Applicant: {app.startupProfile.organization.name}
              </div>
              <div className="flex items-center gap-1.5">
                <FileBadge className="w-4 h-4 text-gray-400" />
                Challenge by: {app.challenge.organization.name}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {canEdit && (
              <Button variant="secondary" className="w-full">Edit Application</Button>
            )}
            {canSubmit && (
              <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
                {!submitting && <Send className="w-4 h-4 ml-2" />}
              </Button>
            )}
            
            {canTransition && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase">Govt Actions</span>
                {['SUBMITTED', 'ADDITIONAL_INFO_REQUIRED'].includes(app.status) && (
                  <Button variant="secondary" size="sm" onClick={() => handleStatusChange('UNDER_REVIEW')} disabled={transitioning}>Mark Under Review</Button>
                )}
                {['UNDER_REVIEW'].includes(app.status) && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => handleStatusChange('SHORTLISTED')} disabled={transitioning}>Shortlist</Button>
                    <Button variant="danger" size="sm" onClick={() => handleStatusChange('REJECTED')} disabled={transitioning}>Reject</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleStatusChange('ADDITIONAL_INFO_REQUIRED')} disabled={transitioning}>Request Info</Button>
                  </>
                )}
                {['SHORTLISTED'].includes(app.status) && (
                  <Button variant="primary" size="sm" onClick={() => handleStatusChange('SELECTED')} disabled={transitioning}>Select for Pilot</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Application Details
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Executive Summary</h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {app.executiveSummary || <span className="text-gray-400 italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Technical Approach</h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {app.technicalApproach || <span className="text-gray-400 italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Implementation Plan</h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {app.implementationPlan || <span className="text-gray-400 italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Team & Experience</h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {app.teamDescription || <span className="text-gray-400 italic">Not provided</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Previous Govt / Relevant Experience</h3>
                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
                  {app.previousExperience || <span className="text-gray-400 italic">Not provided</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Logistics</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 mb-1">Proposed Budget</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.proposedBudgetLakh ? `₹${app.proposedBudgetLakh} Lakhs` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Proposed Timeline</span>
                <span className="text-sm font-medium text-gray-900">
                  {app.proposedTimeline || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {(isGovernmentUser(role) || isEvaluator(role)) && (
            <div className="card p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                Evaluators
                <Badge variant="gray">{app.evaluatorAssignments.length}</Badge>
              </h3>
              
              {app.evaluatorAssignments.length === 0 ? (
                <p className="text-sm text-gray-500">No evaluators assigned yet.</p>
              ) : (
                <ul className="space-y-3">
                  {app.evaluatorAssignments.map(a => (
                    <li key={a.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {a.evaluator.firstName} {a.evaluator.lastName}
                      </span>
                      {a.isCompleted ? (
                        <span className="text-green-600 flex items-center gap-1 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Scored
                        </span>
                      ) : (
                        <span className="text-yellow-600 text-xs font-medium">Pending</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {isGovernmentUser(role) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button variant="secondary" size="sm" className="w-full">Assign Evaluator</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
