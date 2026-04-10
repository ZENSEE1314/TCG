"use client";

import React, { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, CheckCircle2, AlertCircle, ArrowRight, Upload } from 'lucide-react';

export default function AIScannnerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [cardId, setCardId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload to S3/Cloudinary first.
      // For this demo, we'll use a local preview and send a mock URL to the AI.
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !cardId) {
      setError('Please upload an image and enter a Card ID');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await api.post('/ai/analyze', {
        imageUrl: image,
        cardId: cardId
      });
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'AI Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToCollection = async () => {
    try {
      await api.post('/collection/add', {
        cardId: cardId,
        condition: analysis.detectedCondition,
        quantity: 1
      });
      alert('Card added to your Dex with AI-verified condition!');
      router.push('/collection');
    } catch (err: any) {
      alert('Failed to add card');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3 h-3" /> AI Vision Engine
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">AI Damage Scanner</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Upload a high-res photo of your card. Our AI will analyze whitening, centering, and scratches to determine the exact grade.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">Card Image</label>
                <div
                  className={`relative h-64 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${image ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400'}`}
                >
                  {image ? (
                    <img src={image} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload card photo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">Card ID (Reference)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 123"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                />
              </div>

              {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

              <button
                onClick={analyzeCard}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                {isAnalyzing ? 'Analyzing Edges...' : 'Start AI Scan'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!analysis ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-100 rounded-2xl border border-gray-200 text-gray-400">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="w-8 h-8" />
                </div>
                <p>Upload a photo and start the scan to see the AI damage report.</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Analysis Report</h2>
                  <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                    {analysis.confidence * 100}% Confident
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                      <ShieldCheck className="w-4 h-4 text-blue-500" /> Overall Condition
                    </div>
                    <div className="text-2xl font-black text-blue-600">{analysis.detectedCondition}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <ReportItem label="Edge Whitening" value={analysis.findings.whitening} />
                    <ReportItem label="Holo Scratches" value={analysis.findings.scratches} />
                    <ReportItem label="Centering" value={analysis.findings.centering} />
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 mb-6">
                  <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-1">
                    <TrendingUp className="w-4 h-4" /> Value Adjustment
                  </div>
                  <p className="text-sm text-orange-600">
                    Suggested price: <span className="font-bold">{(1 + analysis.suggestedPriceAdjustment) * 100}%</span> of Mint value.
                  </p>
                </div>

                <button
                  onClick={addToCollection}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Add Verified Card to Dex
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-xs font-bold text-gray-800">{value}</span>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 14 2 2 4-4"/></svg>
  );
}
