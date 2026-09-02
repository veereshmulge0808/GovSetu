'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText, ArrowLeft, Building2, CheckCircle, Save
} from 'lucide-react';
import Link from 'next/link';
import { Button, Skeleton } from '@/components/ui';
import api from '@/lib/api';

interface Application {
  id: string;
  status: string;
  executiveSummary: string | null;
  technicalApproach: string | null;
  implementationPlan: string | null;
  teamDescription: string | null;
  previousExperience: string | null;
  challenge: { title: string; organization: { name: string } };
  startupProfile: { organization: { name: string } };
  evaluatorAssignments: { isCompleted: boolean; evaluatorId: string }[];
}

export default function EvaluateApplicationPage() {
  const { applicationId } = useParams() as { applicationId: string };
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [scores, setScores] = useState({
    technicalScore: 0,
    innovationScore: 0,
    feasibilityScore: 0,
    teamScore: 0,
    impactScore: 0,
  });
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('SHORTLIST');

  useEffect(() => {
    fetchApp();
  }, [applicationId]);

  const fetchApp = async () => {
    try {
      const res = await api.get<Application>(`/applications/${applicationId}`);
      setApp(res);
    } catch {
      router.push('/evaluations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Submit evaluation? This action cannot be undone.')) return;
    
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/evaluations/${applicationId}/score`, {
        ...scores,
        comments,
        recommendation
      });
      router.push('/evaluations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit evaluation');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link href="/evaluations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Evaluate: {app.startupProfile.organization.name}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <Building2 className="w-4 h-4" /> Challenge: {app.challenge.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Application Details (Read-only) */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Application Content</h2>
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Executive Summary</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.executiveSummary || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Technical Approach</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.technicalApproach || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Implementation Plan</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.implementationPlan || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Team & Experience</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.teamDescription || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Form */}
        <div className="card p-6 md:p-8 sticky top-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Evaluation Rubric
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {[
                { key: 'technicalScore', label: 'Technical Score (0-10)', desc: 'Technical viability and architecture' },
                { key: 'innovationScore', label: 'Innovation Score (0-10)', desc: 'Novelty of the approach' },
                { key: 'feasibilityScore', label: 'Feasibility Score (0-10)', desc: 'Ability to deploy in real-world govt settings' },
                { key: 'teamScore', label: 'Team Score (0-10)', desc: 'Expertise and capacity of the startup' },
                { key: 'impactScore', label: 'Impact Score (0-10)', desc: 'Potential socio-economic impact' }
              ].map(field => (
                <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">{field.label}</label>
                    <span className="text-xs text-gray-500">{field.desc}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    required
                    value={(scores as any)[field.key]}
                    onChange={(e) => setScores({ ...scores, [field.key]: parseInt(e.target.value) || 0 })}
                    className="input w-24 text-center text-lg font-bold"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Comments & Justification</label>
              <textarea
                required
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="input"
                placeholder="Provide detailed feedback supporting your scores..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Recommendation</label>
              <select
                required
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="input"
              >
                <option value="SHORTLIST">Recommend for Shortlist</option>
                <option value="FURTHER_INFO">Request Further Info</option>
                <option value="REJECT">Do Not Recommend (Reject)</option>
              </select>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}

            <Button type="submit" variant="primary" className="w-full h-12 text-base" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
              {!submitting && <Save className="w-5 h-5 ml-2" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
