'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Calendar, MapPin, DollarSign,
  Users, ChevronRight, Edit, Zap, FileText,
  CheckCircle2, Clock, AlertCircle, ExternalLink,
} from 'lucide-react';
import { Button, Skeleton, EmptyState, Alert, Card, CardBody, CardHeader } from '@/components/ui';
import { useAuthStore, isGovernmentUser, isStartup } from '@/store/auth.store';
import {
  formatDate, formatLakh, getChallengeStatusBadge,
  CHALLENGE_STATUS_LABELS, cn,
} from '@/lib/utils';
import api from '@/lib/api';

interface Challenge {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string;
  problemStatement: string;
  desiredOutcome: string | null;
  existingApproach: string | null;
  sector: string | null;
  domain: string | null;
  location: string | null;
  state: string | null;
  targetBeneficiaries: string | null;
  technicalRequirements: string | null;
  functionalRequirements: string | null;
  constraints: string | null;
  eligibilityCriteria: string | null;
  budgetMinLakh: number | null;
  budgetMaxLakh: number | null;
  pilotDurationDays: number | null;
  submissionDeadline: string | null;
  publishedAt: string | null;
  createdAt: string;
  evaluationCriteria: any;
  organization: { id: string; name: string; type: string; logoUrl: string | null };
  createdBy: { id: string; firstName: string; lastName: string; email: string };
  _count: { applications: number };
}

const LIFECYCLE_STEPS = [
  'DRAFT', 'INTERNAL_REVIEW', 'APPROVED', 'PUBLISHED',
  'STARTUP_DISCOVERY', 'EVALUATION', 'PILOT', 'PROCUREMENT', 'COMPLETED',
];

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    api.get<Challenge>(`/challenges/${id}`)
      .then(setChallenge)
      .catch(() => setError('Challenge not found or you do not have permission to view it.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTransition = async (targetStatus: string) => {
    if (!confirm(`Transition to "${CHALLENGE_STATUS_LABELS[targetStatus]}"?`)) return;
    setTransitioning(true);
    try {
      const updated = await api.patch<Challenge>(`/challenges/${id}/status`, { status: targetStatus });
      setChallenge(updated);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Transition failed');
    } finally {
      setTransitioning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="p-8">
        <Alert variant="error">{error || 'Challenge not found.'}</Alert>
        <div className="mt-4"><Link href="/challenges"><Button variant="secondary"><ArrowLeft className="w-4 h-4" />Back to Challenges</Button></Link></div>
      </div>
    );
  }

  const role = user?.role;
  const currentStepIdx = LIFECYCLE_STEPS.indexOf(challenge.status);
  const canManage = role && isGovernmentUser(role);
  const canApply = role && isStartup(role) && challenge.status === 'PUBLISHED';

  const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    DRAFT: ['INTERNAL_REVIEW', 'CANCELLED'],
    INTERNAL_REVIEW: ['APPROVED', 'DRAFT'],
    APPROVED: ['PUBLISHED', 'DRAFT'],
    PUBLISHED: ['STARTUP_DISCOVERY', 'CANCELLED'],
    STARTUP_DISCOVERY: ['EVALUATION'],
    EVALUATION: ['PILOT'],
    PILOT: ['PROCUREMENT'],
    PROCUREMENT: ['COMPLETED'],
  };

  const nextTransitions = ALLOWED_TRANSITIONS[challenge.status] ?? [];

  return (
    <div className="p-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/challenges" className="hover:text-indigo-600 transition-colors">Challenges</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{challenge.title}</span>
      </div>

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={getChallengeStatusBadge(challenge.status)}>
              {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
            </span>
            {challenge.sector && <span className="badge-gray">{challenge.sector}</span>}
            {challenge.domain && <span className="badge-blue">{challenge.domain}</span>}
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{challenge.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> {challenge.organization.name}
            </span>
            {challenge.state && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {challenge.location ?? challenge.state}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {challenge._count.applications} applications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canApply && (
            <Link href={`/applications/new?challengeId=${challenge.id}`}>
              <Button variant="primary">
                <FileText className="w-4 h-4" /> Apply Now
              </Button>
            </Link>
          )}
          {canManage && (
            <>
              <Link href={`/challenges/${challenge.id}/edit`}>
                <Button variant="secondary" size="sm">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
              </Link>
              {nextTransitions.length > 0 && (
                <div className="relative group">
                  <Button variant="secondary" size="sm" loading={transitioning}>
                    <Zap className="w-3.5 h-3.5" /> Move to…
                  </Button>
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-10 hidden group-hover:block">
                    {nextTransitions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleTransition(status)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 first:rounded-t-xl last:rounded-b-xl transition-colors"
                      >
                        {CHALLENGE_STATUS_LABELS[status] ?? status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {LIFECYCLE_STEPS.filter(s => s !== 'CANCELLED').map((step, idx) => {
              const isCompleted = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <div key={step} className="flex items-center gap-1 shrink-0">
                  <div className={cn(
                    'flex flex-col items-center gap-1',
                    isCompleted ? 'text-indigo-600' : isCurrent ? 'text-indigo-600' : 'text-gray-300',
                  )}>
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                      isCompleted ? 'bg-indigo-600 text-white' : isCurrent ? 'ring-2 ring-indigo-600 text-indigo-600' : 'bg-gray-100 text-gray-400',
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="text-[9px] text-center leading-tight max-w-[60px]">
                      {CHALLENGE_STATUS_LABELS[step] ?? step}
                    </span>
                  </div>
                  {idx < LIFECYCLE_STEPS.filter(s => s !== 'CANCELLED').length - 1 && (
                    <div className={cn('h-0.5 w-6 mb-3', isCompleted ? 'bg-indigo-600' : 'bg-gray-100')} />
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader><h2 className="section-title">Problem Statement</h2></CardHeader>
            <CardBody><p className="text-sm text-gray-700 leading-relaxed">{challenge.problemStatement}</p></CardBody>
          </Card>

          {challenge.description && (
            <Card>
              <CardHeader><h2 className="section-title">Background</h2></CardHeader>
              <CardBody><p className="text-sm text-gray-700 leading-relaxed">{challenge.description}</p></CardBody>
            </Card>
          )}

          {challenge.desiredOutcome && (
            <Card>
              <CardHeader><h2 className="section-title">Desired Outcome</h2></CardHeader>
              <CardBody><p className="text-sm text-gray-700 leading-relaxed">{challenge.desiredOutcome}</p></CardBody>
            </Card>
          )}

          {challenge.technicalRequirements && (
            <Card>
              <CardHeader><h2 className="section-title">Technical Requirements</h2></CardHeader>
              <CardBody><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{challenge.technicalRequirements}</p></CardBody>
            </Card>
          )}

          {challenge.eligibilityCriteria && (
            <Card>
              <CardHeader><h2 className="section-title">Eligibility Criteria</h2></CardHeader>
              <CardBody><p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{challenge.eligibilityCriteria}</p></CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader><h2 className="section-title">Details</h2></CardHeader>
            <CardBody className="space-y-4 pt-0">
              {(challenge.budgetMinLakh || challenge.budgetMaxLakh) && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Budget Range</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatLakh(challenge.budgetMinLakh ?? 0)} – {formatLakh(challenge.budgetMaxLakh ?? 0)}
                  </p>
                </div>
              )}
              {challenge.pilotDurationDays && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Pilot Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{challenge.pilotDurationDays} days</p>
                </div>
              )}
              {challenge.submissionDeadline && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Application Deadline</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(challenge.submissionDeadline)}</p>
                </div>
              )}
              {challenge.targetBeneficiaries && (
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Target Beneficiaries</p>
                  <p className="text-sm text-gray-700">{challenge.targetBeneficiaries}</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h2 className="section-title">Posted By</h2></CardHeader>
            <CardBody className="pt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{challenge.organization.name}</p>
                  <p className="text-xs text-gray-500">{challenge.createdBy.firstName} {challenge.createdBy.lastName}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
