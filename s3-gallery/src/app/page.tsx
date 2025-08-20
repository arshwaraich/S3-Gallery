'use client';

import { useState, useEffect } from 'react';
import { S3Client, S3Config } from '@/lib/s3-client';
import { loadConfig } from '@/lib/storage';
import SettingsModal from '@/components/SettingsModal';
import Gallery from '@/components/Gallery';
import LoadingSpinner from '@/components/LoadingSpinner';
import AWS from 'aws-sdk';

export default function Home() {
  const [s3Client, setS3Client] = useState<S3Client | null>(null);
  const [objects, setObjects] = useState<AWS.S3.Object[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoLoadImages, setAutoLoadImages] = useState(false);

  useEffect(() => {
    const config = loadConfig();
    if (config) {
      handleConfigSave(config);
    } else {
      setShowSettings(true);
    }
  }, []);

  const handleConfigSave = async (config: S3Config) => {
    try {
      setError(null);
      setLoading(true);
      
      const client = new S3Client(config);
      setS3Client(client);
      
      const objectList = await client.listObjects();
      setObjects(objectList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to S3');
      setS3Client(null);
      setObjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (s3Client) {
      const config = loadConfig();
      if (config) {
        handleConfigSave(config);
      }
    }
  };

  return (
    <div className="h-screen ios-bg ios-fg overflow-hidden relative">
      {/* Bottom control pills */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center space-y-3">
        {/* Main control pill */}
        <div className="ios-fill-secondary backdrop-blur-xl rounded-full px-3 sm:px-5 py-2.5 flex items-center space-x-2 sm:space-x-3 shadow-2xl border border-white/10 min-w-0">
          {objects.length > 0 && (
            <span className="text-sm ios-secondary font-medium whitespace-nowrap">
              {objects.filter(obj => S3Client.isImageFile(obj.Key!) || S3Client.isVideoFile(obj.Key!)).length}
            </span>
          )}
          
          {/* Auto-load toggle */}
          <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
            <span className="text-xs sm:text-sm ios-fg font-medium whitespace-nowrap">Auto-load</span>
            <button
              onClick={() => setAutoLoadImages(!autoLoadImages)}
              className="w-9 h-5 sm:w-10 sm:h-6 rounded-full transition-all duration-200 flex-shrink-0"
              style={{ backgroundColor: autoLoadImages ? 'var(--ios-blue)' : 'var(--ios-tertiary)' }}
            >
              <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                autoLoadImages ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="w-px h-3 sm:h-4 bg-white/20 flex-shrink-0"></div>
          
          {s3Client && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1 sm:p-1.5 ios-secondary hover:text-white disabled:opacity-50 transition-colors rounded-full hover:bg-white/10 flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-1 sm:p-1.5 ios-secondary hover:text-white transition-colors rounded-full hover:bg-white/10 flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <main className="h-full overflow-auto p-4 pb-24 ios-bg">
        {error && (
          <div className="mb-6 rounded-xl p-4 border border-white/10" style={{ backgroundColor: 'rgba(255, 69, 58, 0.1)' }}>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 69, 58, 0.2)' }}>
                  <svg className="h-4 w-4" style={{ color: 'var(--ios-red)' }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--ios-red)' }}>Connection Error</h3>
                  <div className="mt-1 text-sm ios-secondary">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {loading ? (
          <LoadingSpinner />
        ) : s3Client && objects.length > 0 ? (
          <Gallery objects={objects} s3Client={s3Client} autoLoadImages={autoLoadImages} />
          ) : s3Client && objects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 ios-fill flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">📷</div>
                </div>
                <h3 className="text-lg font-medium ios-fg mb-2">No Photos</h3>
                <p className="ios-secondary text-sm mb-6 max-w-sm mx-auto">No images or videos found in your S3 bucket.</p>
                <button
                  onClick={handleRefresh}
                  className="text-white px-4 py-2 ios-blue-hover transition-colors text-sm font-medium"
                  style={{ backgroundColor: 'var(--ios-blue)' }}
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : !showSettings ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm mx-auto px-6">
                {/* Icon with gradient background */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" 
                     style={{ background: 'linear-gradient(135deg, var(--ios-blue), #0a84ff)' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h1 className="text-2xl font-semibold ios-fg mb-3">Welcome to Gallery</h1>
                <p className="ios-secondary text-base leading-relaxed mb-8">
                  Connect your AWS S3 bucket to start browsing and organizing your photo collection.
                </p>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full text-white py-4 px-6 rounded-xl font-medium text-base shadow-lg ios-blue-hover transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--ios-blue)' }}
                >
                  Get Started
                </button>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="ios-tertiary text-xs">
                    Your credentials are stored locally and never shared
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onConfigSave={handleConfigSave}
      />
    </div>
  );
}
