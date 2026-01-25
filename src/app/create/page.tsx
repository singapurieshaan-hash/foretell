'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, AlertCircle, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';
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

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [category, setCategory] = useState<Category>('Crypto');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [resolutionSource, setResolutionSource] = useState<ResolutionSourceType>('official_url');
  const [chainlinkFeed, setChainlinkFeed] = useState('');
  const [url, setUrl] = useState('');
  const [jsonPath, setJsonPath] = useState('');
  const [exchangeName, setExchangeName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minLiquidity, setMinLiquidity] = useState('100');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(createSlug(val));
  };

  const handleImageChange = (url: string) => {
    setImage(url);
    setImagePreview(url);
  };

  const step1Errors = useMemo(() => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Market title is required');
    else if (title.length < 5) errs.push('Title must be at least 5 characters');
    if (!description.trim()) errs.push('Description is required');
    else if (description.length < 20) errs.push('Description must be at least 20 characters');
    if (!image.trim()) errs.push('Market image is required');
    return errs;
  }, [title, description, image]);

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
        creatorId: '0xDemoUser',
        creatorName: 'Market Creator',
      });

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-300/60 hover:text-emerald-300 mb-8 transition group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Markets
        </Link>

        {step <= 3 && (
          <div className="mb-12">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      s < step
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                        : s === step
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/50 scale-110'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                    }`}
                  >
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 w-8 rounded-full transition-all duration-300 ${
                        s < step ? 'bg-emerald-500' : 'bg-slate-700/50'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Step {step} of 3
            </div>
          </div>
        )}

        {(error || (step === 1 && step1Errors.length > 0) || (step === 2 && step2Errors.length > 0)) && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm font-medium">{error || (step === 1 ? step1Errors[0] : step2Errors[0])}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-emerald-400" />
                Create a Market
              </h1>
              <p className="text-slate-400 font-medium">Step 1: Basic Information</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Market Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Will Bitcoin reach $100K by end of 2025?"
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
              />
              <p className="text-xs text-slate-400">{title.length}/500 characters</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">Slug (auto-generated)</label>
              <div className="relative">
                <span className="absolute left-5 top-3.5 text-slate-500">foretell.com/markets/</span>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="w-full pl-56 pr-5 py-3.5 rounded-lg bg-slate-700/30 border border-slate-600/30 text-slate-400 cursor-not-allowed backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide clear context for traders. Help them understand what this market is about."
                rows={4}
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none backdrop-blur-sm"
              />
              <p className="text-xs text-slate-400">{description.length}/1000 characters (minimum 20)</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Market Image (URL) *</label>
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
              />
              {imagePreview && (
                <div className="mt-4 overflow-hidden rounded-lg border border-emerald-500/30">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}
              {!imagePreview && image && (
                <div className="mt-4 p-8 rounded-lg bg-slate-700/50 border border-slate-600/30 text-center text-slate-400 flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Unable to load image preview</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3.5 text-white font-bold rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-700/30 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setError('');
                  setStep(2);
                }}
                disabled={step1Errors.length > 0}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Continue to Rules
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-white mb-3">Market Rules & Resolution</h1>
              <p className="text-slate-400 font-medium">Step 2: Define how this market resolves</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Market Rules *</label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Clearly define how YES/NO outcomes are determined. Be specific about edge cases and dispute resolution. Minimum 50 characters."
                rows={6}
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none backdrop-blur-sm"
              />
              <p className="text-xs text-slate-400">{rules.length}/2000 characters (minimum 50)</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Resolution Source *</label>
              <select
                value={resolutionSource}
                onChange={(e) => setResolutionSource(e.target.value as ResolutionSourceType)}
                className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                {RESOLUTION_SOURCES.map((src) => (
                  <option key={src.value} value={src.value}>
                    {src.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">Choose the trusted source for verifying the market outcome</p>
            </div>

            {resolutionSource === 'chainlink' && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Chainlink Feed Address *</label>
                <input
                  type="text"
                  value={chainlinkFeed}
                  onChange={(e) => setChainlinkFeed(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            )}

            {['official_url', 'custom_api', 'exchange_price'].includes(resolutionSource) && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">
                  {resolutionSource === 'exchange_price' ? 'API URL' : 'Source URL'} *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            )}

            {resolutionSource === 'custom_api' && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">JSON Path *</label>
                <input
                  type="text"
                  value={jsonPath}
                  onChange={(e) => setJsonPath(e.target.value)}
                  placeholder="e.g., result.price or data[0].value"
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            )}

            {resolutionSource === 'exchange_price' && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Exchange Name *</label>
                <input
                  type="text"
                  value={exchangeName}
                  onChange={(e) => setExchangeName(e.target.value)}
                  placeholder="e.g., Binance, Coinbase, NYSE"
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">End Date *</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-emerald-300 uppercase tracking-wide">Min Liquidity ($)</label>
                <input
                  type="number"
                  value={minLiquidity}
                  onChange={(e) => setMinLiquidity(e.target.value)}
                  min="0"
                  className="w-full px-5 py-3.5 rounded-lg bg-slate-800/50 border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setError('');
                  setStep(1);
                }}
                className="flex-1 px-6 py-3.5 text-white font-bold rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-700/30 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setError('');
                  setStep(3);
                }}
                disabled={step2Errors.length > 0}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Review Market
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-white mb-3">Review Your Market</h1>
              <p className="text-slate-400 font-medium">Step 3: Submit for admin approval</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 border border-emerald-500/30 rounded-xl p-8 space-y-6 backdrop-blur-sm">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Title</p>
                <p className="text-2xl font-bold text-white mt-2">{title}</p>
              </div>

              {imagePreview && (
                <div className="rounded-lg overflow-hidden border border-emerald-500/30">
                  <img
                    src={imagePreview}
                    alt="Market"
                    className="w-full h-40 object-cover"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}

              <div className="h-px bg-slate-700/50" />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Category</p>
                  <p className="text-white font-semibold mt-2">{category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ends</p>
                  <p className="text-white font-semibold mt-2">{new Date(endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="h-px bg-slate-700/50" />

              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Description</p>
                <p className="text-slate-300 mt-2 leading-relaxed">{description}</p>
              </div>

              <div className="h-px bg-slate-700/50" />

              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Market Rules</p>
                <p className="text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed text-sm">{rules}</p>
              </div>

              <div className="h-px bg-slate-700/50" />

              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Resolution Source</p>
                <p className="text-slate-300 mt-2 font-semibold">{RESOLUTION_SOURCES.find((r) => r.value === resolutionSource)?.label}</p>
              </div>
            </div>

            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-5">
              <p className="text-sm text-emerald-200 font-medium">
                <strong>✓ Your market will be submitted for admin verification.</strong> You'll receive a decision within <strong>{autoRejectMinutes} minutes</strong> and start earning 20% of all trading fees!
              </p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                className="flex-1 px-6 py-3.5 text-white font-bold rounded-lg border border-slate-600/50 hover:border-slate-500 hover:bg-slate-700/30 disabled:opacity-50 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">Market Submitted!</h2>
              <p className="text-slate-300 text-lg">Your market is pending admin approval</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 border border-emerald-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
              <p className="text-emerald-300 font-bold">⏱️ Decision within {autoRejectMinutes} minutes</p>
              <p className="text-slate-300 text-sm mt-2">You'll earn 20% of all trading fees on this market</p>
            </div>
            <p className="text-sm text-slate-400 animate-pulse">Redirecting to home...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
