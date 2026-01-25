'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);

  const submissions = useStore((state) => state.submissions);
  const approveSubmission = useStore((state) => state.approveSubmission);
  const rejectSubmission = useStore((state) => state.rejectSubmission);
  const adminPassword = useStore((state) => state.adminPassword);

  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  useEffect(() => {
    if (DEMO_MODE) {
      setAuthenticated(true);
    }
  }, [DEMO_MODE]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const rejectedSubmissions = submissions.filter((s) => s.status === 'rejected');

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-surface to-white">
        <div className="max-w-md mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-text mb-12 transition">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-text">Admin Dashboard</h1>
              <p className="text-brand-text/60 mt-2">Market Approval & Moderation</p>
            </div>

            {DEMO_MODE && (
              <div className="p-4 bg-brand-success/10 border border-brand-success/30 rounded-lg">
                <p className="text-sm text-brand-text/80">
                  <strong>DEMO MODE:</strong> Auto-authenticated. Set NEXT_PUBLIC_DEMO_MODE=false for production.
                </p>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition"
                />
              </div>

              {authError && (
                <div className="p-3 bg-brand-error/10 border border-brand-error/30 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-error">{authError}</p>
                </div>
              )}

              <button type="submit" className="w-full px-6 py-3 bg-brand-success text-white font-semibold rounded-lg hover:bg-brand-success/90 transition">
                Authenticate
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-surface to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-text mb-8 transition">
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-text mb-2">Admin Dashboard</h1>
          <p className="text-brand-text/60">Manage market submissions and approvals</p>
        </div>

        {DEMO_MODE && (
          <div className="mb-6 p-4 bg-brand-success/10 border border-brand-success/30 rounded-lg text-sm text-brand-text/80">
            <strong>DEMO MODE:</strong> Auto-rejected submissions after {process.env.NEXT_PUBLIC_ADMIN_AUTO_REJECT_MINUTES || '10'} minutes
          </div>
        )}

        {/* Pending Submissions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-brand-text mb-4">
            Pending Submissions ({pendingSubmissions.length})
          </h2>

          {pendingSubmissions.length === 0 ? (
            <div className="p-6 bg-white border border-brand-border rounded-lg text-center text-brand-text/60">
              No pending submissions
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="bg-white border border-brand-border rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    {submission.image && (
                      <img src={submission.image} alt={submission.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-text text-lg">{submission.title}</h3>
                      <p className="text-sm text-brand-text/60 mt-1">{submission.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-brand-text/50">
                        <span>Category: {submission.category}</span>
                        <span>•</span>
                        <span>Ends: {new Date(submission.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-surface p-3 rounded-lg">
                    <p className="text-xs font-semibold text-brand-text/60 uppercase mb-2">Resolution Rules</p>
                    <p className="text-sm text-brand-text whitespace-pre-wrap">{submission.rules}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-brand-text/60 uppercase">Resolution Source</p>
                      <p className="text-brand-text mt-1">{submission.resolutionSource.type}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text/60 uppercase">Min Liquidity</p>
                      <p className="text-brand-text mt-1">${(submission.minLiquidity || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {editingId === submission.id ? (
                    <div className="space-y-3 border-t border-brand-border pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          id={`featured-${submission.id}`}
                          className="w-4 h-4 rounded border-brand-border"
                        />
                        <label htmlFor={`featured-${submission.id}`} className="text-sm font-semibold text-brand-text">
                          Featured Market
                        </label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={seeded}
                          onChange={(e) => setSeeded(e.target.checked)}
                          id={`seeded-${submission.id}`}
                          className="w-4 h-4 rounded border-brand-border"
                        />
                        <label htmlFor={`seeded-${submission.id}`} className="text-sm font-semibold text-brand-text">
                          Seeded from API
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            approveSubmission(submission.id, { featured, seeded });
                            setEditingId(null);
                          }}
                          className="flex-1 px-4 py-2 bg-brand-success text-white text-sm font-semibold rounded-lg hover:bg-brand-success/90 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Market
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setShowRejectForm(submission.id);
                          }}
                          className="flex-1 px-4 py-2 border border-brand-border text-brand-text text-sm font-semibold rounded-lg hover:bg-brand-surface transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : showRejectForm === submission.id ? (
                    <div className="space-y-3 border-t border-brand-border pt-4">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this market is rejected..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-text placeholder:text-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-success/20 focus:border-brand-success transition resize-none text-sm"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            if (rejectionReason.trim()) {
                              rejectSubmission(submission.id, rejectionReason);
                              setShowRejectForm(null);
                              setRejectionReason('');
                            }
                          }}
                          disabled={!rejectionReason.trim()}
                          className="flex-1 px-4 py-2 bg-brand-error text-white text-sm font-semibold rounded-lg hover:bg-brand-error/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject Market
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectForm(null);
                            setRejectionReason('');
                          }}
                          className="flex-1 px-4 py-2 border border-brand-border text-brand-text text-sm font-semibold rounded-lg hover:bg-brand-surface transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 border-t border-brand-border pt-4">
                      <button
                        onClick={() => {
                          setEditingId(submission.id);
                          setFeatured(false);
                          setSeeded(false);
                        }}
                        className="flex-1 px-4 py-2 bg-brand-success/10 text-brand-success text-sm font-semibold rounded-lg hover:bg-brand-success/20 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectForm(submission.id)}
                        className="flex-1 px-4 py-2 bg-brand-error/10 text-brand-error text-sm font-semibold rounded-lg hover:bg-brand-error/20 transition flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Markets */}
        {approvedSubmissions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-brand-text mb-4">
              Approved Markets ({approvedSubmissions.length})
            </h2>
            <div className="space-y-2">
              {approvedSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 bg-white border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brand-text">{submission.title}</h3>
                    <p className="text-sm text-brand-text/60 mt-1">
                      {submission.approvedMarketId && `Market ID: ${submission.approvedMarketId.slice(0, 8)}...`}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Markets */}
        {rejectedSubmissions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-brand-text mb-4">
              Rejected Markets ({rejectedSubmissions.length})
            </h2>
            <div className="space-y-2">
              {rejectedSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 bg-white border border-brand-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-brand-text">{submission.title}</h3>
                    <XCircle className="w-5 h-5 text-brand-error flex-shrink-0" />
                  </div>
                  <p className="text-sm text-brand-text/60">{submission.rejectionReason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
