'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Save, ExternalLink } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';
import { useAuthStore, isStartup } from '@/store/auth.store';
import api from '@/lib/api';

interface StartupProfile {
  id: string;
  foundingYear: number | null;
  teamSize: number | null;
  fundingStage: string | null;
  technologies: string[];
  industries: string[];
  govtExperience: boolean;
  prevGovtProjects: string | null;
  organization: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    logoUrl: string | null;
  };
}

export default function StartupProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    foundingYear: '',
    teamSize: '',
    fundingStage: 'BOOTSTRAPPED',
    technologies: '',
    industries: '',
    govtExperience: false,
    prevGovtProjects: '',
  });

  useEffect(() => {
    if (user && !isStartup(user.role)) {
      router.push('/dashboard');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Startups only have one profile, but they get it from findAll which is scoped to their org
      const res = await api.get<{ data: StartupProfile[] }>('/startups');
      if (res.data && res.data.length > 0) {
        const p = res.data[0];
        setProfile(p);
        setFormData({
          foundingYear: p.foundingYear?.toString() || '',
          teamSize: p.teamSize?.toString() || '',
          fundingStage: p.fundingStage || 'BOOTSTRAPPED',
          technologies: p.technologies?.join(', ') || '',
          industries: p.industries?.join(', ') || '',
          govtExperience: p.govtExperience,
          prevGovtProjects: p.prevGovtProjects || '',
        });
      }
    } catch {
      // Profile not found
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      foundedYear: parseInt(formData.foundingYear) || undefined,
      teamSize: parseInt(formData.teamSize) || undefined,
      fundingStage: formData.fundingStage,
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
      industries: formData.industries.split(',').map(s => s.trim()).filter(Boolean),
      govtExperience: formData.govtExperience,
      govtProjectSummary: formData.prevGovtProjects,
    };

    try {
      if (profile) {
        await api.patch(`/startups/${profile.id}`, payload);
      } else {
        await api.post('/startups/profile', payload);
      }
      setIsEditing(false);
      await fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Manage your startup identity and capabilities</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            {profile ? 'Edit Profile' : 'Create Profile'}
          </Button>
        )}
      </div>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-8 py-10 text-white flex items-center gap-6">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{profile?.organization?.name || 'Your Startup'}</h2>
            <div className="text-indigo-100 flex items-center gap-4 text-sm">
              {profile?.organization?.website && (
                <a href={profile.organization.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isEditing && profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Founding Year</span>
                <span className="text-base text-gray-900">{profile.foundingYear || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Team Size</span>
                <span className="text-base text-gray-900">{profile.teamSize ? `${profile.teamSize} employees` : 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Funding Stage</span>
                <span className="text-base text-gray-900">{profile.fundingStage?.replace(/_/g, ' ') || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Govt Experience</span>
                <span className="text-base text-gray-900">{profile.govtExperience ? 'Yes' : 'No'}</span>
              </div>
              
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Technologies</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.technologies.length > 0 ? profile.technologies.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">{t}</span>
                  )) : <span className="text-gray-500 text-sm">None listed</span>}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Industries</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.industries.length > 0 ? profile.industries.map(i => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md border border-indigo-100">{i}</span>
                  )) : <span className="text-gray-500 text-sm">None listed</span>}
                </div>
              </div>

              {profile.govtExperience && (
                <div className="md:col-span-2">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Previous Govt Projects</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.prevGovtProjects || 'No details provided'}</p>
                </div>
              )}
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founding Year</label>
                  <input type="number" min="1900" max="2100" className="input" value={formData.foundingYear} onChange={e => setFormData({...formData, foundingYear: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <input type="number" min="1" className="input" value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funding Stage</label>
                  <select className="input" value={formData.fundingStage} onChange={e => setFormData({...formData, fundingStage: e.target.value})}>
                    <option value="BOOTSTRAPPED">Bootstrapped</option>
                    <option value="PRE_SEED">Pre-Seed</option>
                    <option value="SEED">Seed</option>
                    <option value="SERIES_A">Series A</option>
                    <option value="SERIES_B">Series B</option>
                    <option value="SERIES_C_PLUS">Series C+</option>
                    <option value="PROFITABLE">Profitable</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="govtExperience" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" checked={formData.govtExperience} onChange={e => setFormData({...formData, govtExperience: e.target.checked})} />
                  <label htmlFor="govtExperience" className="text-sm font-medium text-gray-700">We have previous government experience</label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                  <input type="text" className="input" placeholder="e.g. AI/ML, IoT, Blockchain" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industries (comma separated)</label>
                  <input type="text" className="input" placeholder="e.g. Healthcare, Agriculture, Smart Cities" value={formData.industries} onChange={e => setFormData({...formData, industries: e.target.value})} />
                </div>

                {formData.govtExperience && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Govt Project Details</label>
                    <textarea rows={4} className="input" placeholder="Describe past deployments..." value={formData.prevGovtProjects} onChange={e => setFormData({...formData, prevGovtProjects: e.target.value})} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You have not created your startup profile yet.</p>
              <Button variant="primary" onClick={() => setIsEditing(true)}>Create Profile Now</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
