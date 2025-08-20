'use client';

import { useState, useEffect } from 'react';
import { S3Config } from '@/lib/s3-client';
import { saveConfig, loadConfig } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSave: (config: S3Config) => void;
}

export default function SettingsModal({ isOpen, onClose, onConfigSave }: SettingsModalProps) {
  const [config, setConfig] = useState<S3Config>({
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: 'fujifilm-x100vi',
    region: 'us-east-2',
  });

  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(config);
    onConfigSave(config);
    onClose();
  };

  const handleInputChange = (field: keyof S3Config) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 ios-overlay backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="ios-fill-secondary backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold ios-fg">S3 Configuration</h2>
          <button
            onClick={onClose}
            className="ios-secondary hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5" autoComplete="on">
          <div>
            <label htmlFor="accessKeyId" className="block text-sm font-medium ios-secondary mb-2">
              Access Key ID
            </label>
            <input
              type="text"
              id="accessKeyId"
              name="username"
              autoComplete="username"
              value={config.accessKeyId}
              onChange={handleInputChange('accessKeyId')}
              className="w-full px-4 py-3 ios-fill border border-white/10 rounded-xl ios-fg placeholder:ios-secondary outline-none transition-all"
              style={{
                '--tw-ring-color': 'var(--ios-blue)',
                focusRingColor: 'var(--ios-blue)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = 'var(--ios-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              placeholder="Enter your AWS Access Key ID"
              required
            />
          </div>
          
          <div>
            <label htmlFor="secretAccessKey" className="block text-sm font-medium ios-secondary mb-2">
              Secret Access Key
            </label>
            <input
              type="password"
              id="secretAccessKey"
              name="password"
              autoComplete="current-password"
              value={config.secretAccessKey}
              onChange={handleInputChange('secretAccessKey')}
              className="w-full px-4 py-3 ios-fill border border-white/10 rounded-xl ios-fg placeholder:ios-secondary outline-none transition-all"
              style={{
                '--tw-ring-color': 'var(--ios-blue)',
                focusRingColor: 'var(--ios-blue)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = 'var(--ios-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              placeholder="Enter your AWS Secret Access Key"
              required
            />
          </div>
          
          <div>
            <label htmlFor="bucketName" className="block text-sm font-medium ios-secondary mb-2">
              Bucket Name
            </label>
            <input
              type="text"
              id="bucketName"
              value={config.bucketName}
              onChange={handleInputChange('bucketName')}
              className="w-full px-4 py-3 ios-fill border border-white/10 rounded-xl ios-fg placeholder:ios-secondary outline-none transition-all"
              style={{
                '--tw-ring-color': 'var(--ios-blue)',
                focusRingColor: 'var(--ios-blue)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = 'var(--ios-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              placeholder="your-bucket-name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="region" className="block text-sm font-medium ios-secondary mb-2">
              Region
            </label>
            <input
              type="text"
              id="region"
              value={config.region}
              onChange={handleInputChange('region')}
              className="w-full px-4 py-3 ios-fill border border-white/10 rounded-xl ios-fg placeholder:ios-secondary outline-none transition-all"
              style={{
                '--tw-ring-color': 'var(--ios-blue)',
                focusRingColor: 'var(--ios-blue)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = 'var(--ios-blue)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              placeholder="us-east-2"
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full text-white py-3 px-4 rounded-xl ios-blue-hover transition-all font-medium"
              style={{ backgroundColor: 'var(--ios-blue)' }}
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}