'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Info, Save } from 'lucide-react';
import { Button, Alert, Card, CardBody, CardHeader } from '@/components/ui';
import api from '@/lib/api';

const schema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(500),
  description: z.string().min(50, 'Provide at least 50 characters of background'),
  problemStatement: z.string().min(50, 'Problem statement must be at least 50 characters'),
  desiredOutcome: z.string().optional(),
  existingApproach: z.string().optional(),
  sector: z.string().optional(),
  domain: z.string().optional(),
  location: z.string().optional(),
  state: z.string().optional(),
  targetBeneficiaries: z.string().optional(),
  technicalRequirements: z.string().optional(),
  functionalRequirements: z.string().optional(),
  constraints: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  budgetMinLakh: z.number({ coerce: true }).optional(),
  budgetMaxLakh: z.number({ coerce: true }).optional(),
  pilotDurationDays: z.number({ coerce: true }).min(1).optional(),
  submissionDeadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SECTORS = [
  'Water Management', 'Agriculture', 'Healthcare', 'Education', 'Transportation',
  'Energy', 'Urban Infrastructure', 'Digital Governance', 'Environment', 'Finance',
  'Defence', 'Other',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'All India',
];

function FormField({
  label, id, required, hint, error, children,
}: {
  label: string; id?: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default function NewChallengePage() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');
  const [savedAsDraft, setSavedAsDraft] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError('');
    try {
      const res = await api.post<{ id: string }>('/challenges', data);
      router.push(`/challenges/${res.id}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setApiError(Array.isArray(msg) ? msg.join('. ') : (msg ?? 'Failed to create challenge'));
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link href="/challenges">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="page-title">Post a Challenge</h1>
          <p className="page-subtitle">Describe an innovation need — GovSetu will match you with relevant startups.</p>
        </div>
      </div>

      {apiError && <Alert variant="error" className="mb-6">{apiError}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Section 1 — Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="section-title">Challenge Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">Core information about the innovation need</p>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Challenge Title" id="title" required error={errors.title?.message}
              hint="Be specific — a clear title helps startups identify relevant opportunities.">
              <input id="title" className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Real-time Water Leakage Detection for Urban Distribution Networks"
                {...register('title')} />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Sector" id="sector" error={errors.sector?.message}>
                <select id="sector" className="select" {...register('sector')}>
                  <option value="">Select sector</option>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="State / Region" id="state" error={errors.state?.message}>
                <select id="state" className="select" {...register('state')}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Domain / Technology Area" id="domain" error={errors.domain?.message}>
                <input id="domain" className="input" placeholder="e.g., IoT, AI/ML, Robotics"
                  {...register('domain')} />
              </FormField>
              <FormField label="City / Location" id="location" error={errors.location?.message}>
                <input id="location" className="input" placeholder="e.g., Bengaluru"
                  {...register('location')} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {/* Section 2 — Problem Definition */}
        <Card>
          <CardHeader>
            <h2 className="section-title">Problem Definition</h2>
            <p className="text-xs text-gray-500 mt-0.5">Help startups understand the challenge deeply</p>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Background" id="description" required error={errors.description?.message}
              hint="Provide context about the current situation, existing infrastructure, and the scale of the problem.">
              <textarea id="description" rows={4} className={`textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe the current situation and why this challenge exists…"
                {...register('description')} />
            </FormField>

            <FormField label="Problem Statement" id="problemStatement" required error={errors.problemStatement?.message}
              hint="A precise, outcome-oriented statement of the problem to be solved.">
              <textarea id="problemStatement" rows={3} className={`textarea ${errors.problemStatement ? 'input-error' : ''}`}
                placeholder="e.g., Municipal water pipelines lose ~30% of supply due to undetected leaks, leading to ₹200 Cr annual loss…"
                {...register('problemStatement')} />
            </FormField>

            <FormField label="Desired Outcome" id="desiredOutcome" error={errors.desiredOutcome?.message}
              hint="What does success look like? Include measurable KPIs where possible.">
              <textarea id="desiredOutcome" rows={2} className="textarea"
                placeholder="e.g., Reduce pipeline water loss by 50% within 12 months of pilot deployment…"
                {...register('desiredOutcome')} />
            </FormField>

            <FormField label="Existing Approach" id="existingApproach" error={errors.existingApproach?.message}
              hint="What is currently being done? Why is it inadequate?">
              <textarea id="existingApproach" rows={2} className="textarea"
                placeholder="e.g., Manual inspection quarterly, no real-time monitoring…"
                {...register('existingApproach')} />
            </FormField>
          </CardBody>
        </Card>

        {/* Section 3 — Requirements */}
        <Card>
          <CardHeader>
            <h2 className="section-title">Requirements & Eligibility</h2>
          </CardHeader>
          <CardBody className="space-y-5">
            <FormField label="Technical Requirements" id="technicalRequirements" error={errors.technicalRequirements?.message}>
              <textarea id="technicalRequirements" rows={3} className="textarea"
                placeholder="e.g., IoT sensor integration with SCADA, real-time dashboard, mobile alerts…"
                {...register('technicalRequirements')} />
            </FormField>

            <FormField label="Functional Requirements" id="functionalRequirements" error={errors.functionalRequirements?.message}>
              <textarea id="functionalRequirements" rows={2} className="textarea"
                placeholder="e.g., Automated leak detection alerts within 15 minutes…"
                {...register('functionalRequirements')} />
            </FormField>

            <FormField label="Constraints" id="constraints" error={errors.constraints?.message}
              hint="Technical, regulatory, or operational constraints the solution must respect.">
              <textarea id="constraints" rows={2} className="textarea"
                placeholder="e.g., Must integrate with existing SCADA system, data to remain on government servers…"
                {...register('constraints')} />
            </FormField>

            <FormField label="Target Beneficiaries" id="targetBeneficiaries" error={errors.targetBeneficiaries?.message}>
              <input id="targetBeneficiaries" className="input"
                placeholder="e.g., Municipal corporations, city residents"
                {...register('targetBeneficiaries')} />
            </FormField>

            <FormField label="Eligibility Criteria" id="eligibilityCriteria" error={errors.eligibilityCriteria?.message}
              hint="Requirements startups must meet to apply.">
              <textarea id="eligibilityCriteria" rows={2} className="textarea"
                placeholder="e.g., Indian-registered company, at least 2 years old, prior PoC mandatory…"
                {...register('eligibilityCriteria')} />
            </FormField>
          </CardBody>
        </Card>

        {/* Section 4 — Budget & Timeline */}
        <Card>
          <CardHeader>
            <h2 className="section-title">Budget & Timeline</h2>
          </CardHeader>
          <CardBody className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Minimum Budget (Lakhs ₹)" id="budgetMinLakh" error={errors.budgetMinLakh?.message}>
                <input id="budgetMinLakh" type="number" min="0" step="0.5" className="input"
                  placeholder="e.g., 10"
                  {...register('budgetMinLakh', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Maximum Budget (Lakhs ₹)" id="budgetMaxLakh" error={errors.budgetMaxLakh?.message}>
                <input id="budgetMaxLakh" type="number" min="0" step="0.5" className="input"
                  placeholder="e.g., 50"
                  {...register('budgetMaxLakh', { valueAsNumber: true })} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Pilot Duration (Days)" id="pilotDurationDays" error={errors.pilotDurationDays?.message}>
                <input id="pilotDurationDays" type="number" min="1" className="input"
                  placeholder="e.g., 90"
                  {...register('pilotDurationDays', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Application Deadline" id="submissionDeadline" error={errors.submissionDeadline?.message}>
                <input id="submissionDeadline" type="date" className="input"
                  {...register('submissionDeadline')} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-700">
            Your challenge will be saved as a <strong>Draft</strong>. It will go through an
            internal review before being published to startups. The AI matching engine will
            automatically identify relevant startups once published.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/challenges">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            <Save className="w-4 h-4" />
            Save Challenge
          </Button>
        </div>
      </form>
    </div>
  );
}
