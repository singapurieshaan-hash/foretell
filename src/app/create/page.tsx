'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { ResolutionSourceType, Category } from '@/types';

const CATEGORIES: Category[] = ['Crypto', 'Markets', 'Sports', 'Culture', 'Other'];
const RESOLUTION_SOURCES: { label: string; value: ResolutionSourceType }[] = [
  { label: 'Chainlink Price Feed', value: 'chainlink' },
  { label: 'Official Website/API', value: 'official_url' },
  { label: 'Exchange Price', value: 'exchange_price' },
  { label: 'Custom API with JSON Path', value: 'custom_api' },
];

const createSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

export default function CreateMarket() {
  const router = useRouter();
  const createMarketSubmission = useStore((state) => state.createMarketSubmission);
  const autoRejectMinutes = parseInt(
    process.env.NEXT_PUBLIC_ADMIN_AUTO_REJECT_MINUTES || '10',
    10
  );

  // Step 1: Metadata
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<Category>('Crypto');
  const [description, setDescription] = useState('');

  // Step 2: Rules & Resolution
  const [rules, setRules] = useState('');
  const [resolutionSource, setResolutionSource] = useState<ResolutionSourceType>('official_url');
  const [chainlinkFeed, setChainlinkFeed] = useState('');
  const [url, setUrl] = useState('');
  const [jsonPath, setJsonPath] = useState('');
  const [exchangeName, setExchangeName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minLiquidity, setMinLiquidity] = useState('100');

  // Step 3: Review
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(createSlug(val));
  };

  // Compute validation errors for display
  const step1Errors = useMemo(() => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Market title is required');
    else if (title.length < 5) errs.push('Title must be at least 5 characters');
    if (!description.trim()) errs.push('Description is required');
    else if (description.length < 20) errs.push('Description must be at least 20 characters');
    return errs;
  }, [title, description]);

  const step2Errors = useMemo(() => {
    const errs: string[] = [];
    if (!rules.trim()) errs.push('Market rules are required');
    else if (rules.length < 50) errs.push('Rules must be at least 50 characters for clarity');
    if (!endDate) errs.push('End date is required');
    else {
      const end = new Date(endDate);
      const now = new Date();
      if (end <= now) errs.push('End date must be in the future');
    }
    if (resolutionSource === 'official_url' && !url) errs.push('URL is required for official resolution source');
    if (resolutionSource === 'custom_api' && !url) errs.push('API URL is required');
    if (resolutionSource === 'custom_api' && !jsonPath) errs.push('JSON Path is required (e.g., "result.price")');
    if (resolutionSource === 'exchange_price' && !exchangeName) errs.push('Exchange name is required');
    if (resolutionSource === 'chainlink' && !chainlinkFeed) errs.push('Chainlink feed address is required');
    return errs;
  }, [rules, endDate, resolutionSource, url, jsonPath, exchangeName, chainlinkFeed]);

  const handleSubmit = async () => {
    if (step2Errors.length > 0) {
      setError(step2Errors[0]);
      return;
    }

    setSubmitting(true);
    try {
      createMarketSubmission({
        title,
        slug,
        description,
        category,
        image: image || 'https://images.unsplash.com/photo-1611974212247-9fcf94f2f5b2?w=500',
        rules,
        endDate: new Date(endDate),
        resolutionSource: {
          type: resolutionSource,
          chainlinkFeed: resolutionSource === 'chainlink' ? chainlinkFeed : undefined,
          url: ['official_url', 'custom_api', 'exchange_price'].includes(resolutionSource) ? url : undefined,
          jsonPath: resolutionSource === 'custom_api' ? jsonPath : undefined,
          exchangeName: resolutionSource === 'exchange_price' ? exchangeName : undefined,
          timestamp: Date.now(),
        },
        minLiquidity: parseFloat(minLiquidity),
        creatorId: '0xDemoUser', // In real app, use connected wallet
        creatorName: 'Market Creator',
      });

      // Show success page
      setStep(4);
      setError('');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-text mb-8 transition">
          <ChevronLeft className="w-4 h-4" />
          Back to Markets
        </Link>

        {/* Steps Indicator */}
        {step <= 3 && (
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    s <= step
                      ? 'bg-brand-success text-white'
                      : 'bg-brand-border text-brand-text/40'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`h-1 w-12 ${s < step ? 'bg-brand-success' : 'bg-brand-border'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {(error || (step === 1 && step1Errors.length > 0) || (step === 2 && step2Errors.length > 0)) && (
          <div className="mb-6 p-4 bg-brand-error/10 border border-brand-error/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-error flex-shrink-0 mt-0.5" />
            <p className="text-brand-error text-sm">{error || (step === 1 ? step1Errors[0] : step2Errors[0])}</p>
          </div>
        )}

        {/* Step 1: Metadata */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-text mb-2">Create a Market</h1>
              <p className="text-brand-text/60">Step 1 of 3: Market Metadata</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Market Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Will Bitcoin reach $100K by end of 2025?"
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Slug (auto-generated)</label>
              <input
                type="text"
                value={slug}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-surface text-brand-text/60 cursor-not-allowed"
              />
              <p className="text-xs text-brand-text/50 mt-1">Used in URL: foretell.com/markets/{slug}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context for traders. Minimum 20 characters."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition resize-none"
              />
              <p className="text-xs text-brand-text/50 mt-1">{description.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Market Image (URL)</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setError('');
                  setStep(2);
                }}
                disabled={step1Errors.length > 0}
                className="flex-1 px-6 py-3 bg-brand-success text-white font-semibold rounded-lg hover:bg-brand-success/90 disabled:bg-brand-border disabled:text-brand-text/40 transition"
              >
                Continue to Rules
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Rules & Resolution */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-text mb-2">Market Rules & Resolution</h1>
              <p className="text-brand-text/60">Step 2 of 3: Define how this market resolves</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Market Rules *</label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Clearly define the market resolution criteria. Be specific about how YES/NO outcomes are determined. Minimum 50 characters."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition resize-none"
              />
              <p className="text-xs text-brand-text/50 mt-1">{rules.length}/2000</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text mb-2">Resolution Source *</label>
              <select
                value={resolutionSource}
                onChange={(e) => setResolutionSource(e.target.value as ResolutionSourceType)}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
              >
                {RESOLUTION_SOURCES.map((src) => (
                  <option key={src.value} value={src.value}>
                    {src.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chainlink Option */}
            {resolutionSource === 'chainlink' && (
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Chainlink Feed Address *</label>
                <input
                  type="text"
                  value={chainlinkFeed}
                  onChange={(e) => setChainlinkFeed(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
            )}

            {/* URL-based options */}
            {['official_url', 'custom_api', 'exchange_price'].includes(resolutionSource) && (
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">
                  {resolutionSource === 'exchange_price' ? 'API URL' : 'URL'} *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
            )}

            {/* JSON Path for Custom API */}
            {resolutionSource === 'custom_api' && (
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">JSON Path *</label>
                <input
                  type="text"
                  value={jsonPath}
                  onChange={(e) => setJsonPath(e.target.value)}
                  placeholder="e.g., result.price or data[0].value"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
            )}

            {/* Exchange Name */}
            {resolutionSource === 'exchange_price' && (
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Exchange Name *</label>
                <input
                  type="text"
                  value={exchangeName}
                  onChange={(e) => setExchangeName(e.target.value)}
                  placeholder="e.g., Binance, Coinbase, NYSE"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Min Liquidity ($)</label>
                <input
                  type="number"
                  value={minLiquidity}
                  onChange={(e) => setMinLiquidity(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => {
                  setError('');
                  setStep(1);
                }}
                className="flex-1 px-6 py-3 border border-brand-border text-brand-text font-semibold rounded-lg hover:bg-brand-surface transition"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setError('');
                  setStep(3);
                }}
                disabled={step2Errors.length > 0}
                className="flex-1 px-6 py-3 bg-brand-success text-white font-semibold rounded-lg hover:bg-brand-success/90 disabled:bg-brand-border disabled:text-brand-text/40 transition"
              >
                Review Market
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-text mb-2">Review Your Market</h1>
              <p className="text-brand-text/60">Step 3 of 3: Submit for admin approval</p>
            </div>

            <div className="bg-white border border-brand-border rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-brand-text/60 uppercase">Title</p>
                <p className="text-lg font-semibold text-brand-text mt-1">{title}</p>
              </div>

              <div className="h-px bg-brand-border" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-brand-text/60 uppercase">Slug</p>
                  <p className="text-sm text-brand-text mt-1 font-mono">{slug}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-text/60 uppercase">Category</p>
                  <p className="text-sm text-brand-text mt-1">{category}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-text/60 uppercase">Description</p>
                <p className="text-sm text-brand-text mt-1">{description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-text/60 uppercase">Rules</p>
                <p className="text-sm text-brand-text mt-1 whitespace-pre-wrap">{rules}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-brand-text/60 uppercase">End Date</p>
                  <p className="text-sm text-brand-text mt-1">{new Date(endDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-text/60 uppercase">Resolution</p>
                  <p className="text-sm text-brand-text mt-1">{RESOLUTION_SOURCES.find((r) => r.value === resolutionSource)?.label}</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-success/10 border border-brand-success/30 rounded-lg p-4">
              <p className="text-sm text-brand-text">
                <strong>Next Steps:</strong> Your market will be submitted for admin verification. You can expect a decision within {autoRejectMinutes} minutes.
              </p>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                className="flex-1 px-6 py-3 border border-brand-border text-brand-text font-semibold rounded-lg hover:bg-brand-surface disabled:opacity-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-brand-success text-white font-semibold rounded-lg hover:bg-brand-success/90 disabled:opacity-50 transition"
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {step === 4 && (
          <div className="text-center space-y-4 py-12">
            <div className="w-12 h-12 rounded-full bg-brand-success/20 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-brand-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Market Submitted!</h2>
            <p className="text-brand-text/60">Your market is pending admin approval. You'll get a decision within {autoRejectMinutes} minutes.</p>
            <p className="text-sm text-brand-text/40">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
}
