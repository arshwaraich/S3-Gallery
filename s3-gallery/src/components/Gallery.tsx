'use client';

import { useState } from 'react';
import AWS from 'aws-sdk';
import { S3Client } from '@/lib/s3-client';
import Image from 'next/image';

interface GalleryProps {
  objects: AWS.S3.Object[];
  s3Client: S3Client;
  autoLoadImages: boolean;
}

export default function Gallery({ objects, s3Client, autoLoadImages }: GalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video'; name: string } | null>(null);
  const [fullscreenLoading, setFullscreenLoading] = useState(false);

  const mediaObjects = objects.filter(obj => 
    S3Client.isImageFile(obj.Key!) || S3Client.isVideoFile(obj.Key!)
  );

  const openFullscreen = (key: string) => {
    setFullscreenLoading(true);
    const url = s3Client.getSignedUrl(key);
    const type = S3Client.isVideoFile(key) ? 'video' : 'image';
    setSelectedMedia({ url, type, name: key });
  };

  const closeFullscreen = () => {
    setSelectedMedia(null);
    setFullscreenLoading(false);
  };

  if (mediaObjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-600">No images or videos found in your S3 bucket.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Unified grid - responsive square layout */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
        {mediaObjects.map((obj) => (
          <MediaCard
            key={obj.Key}
            object={obj}
            s3Client={s3Client}
            autoLoadImages={autoLoadImages}
            onOpenFullscreen={openFullscreen}
          />
        ))}
      </div>

      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black z-50"
          onClick={closeFullscreen}
        >
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Simple top bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg flex items-center justify-between px-4 z-10">
              <button
                onClick={closeFullscreen}
                className="text-white/80 hover:text-white text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="text-white text-sm font-medium truncate max-w-md text-center">
                {selectedMedia.name.split('/').pop()}
              </div>
              <div className="w-16"></div>
            </div>
            
            {selectedMedia.type === 'image' ? (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.name}
                width={1200}
                height={800}
                className="max-w-[95vw] max-h-[90vh] object-contain"
                unoptimized
                onLoad={() => setFullscreenLoading(false)}
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-[95vw] max-h-[90vh]"
                autoPlay
                onLoadedData={() => setFullscreenLoading(false)}
              >
                Your browser does not support the video tag.
              </video>
            )}
            
            {/* Fullscreen loading overlay */}
            {fullscreenLoading && (
              <div className="absolute inset-0 ios-overlay flex items-center justify-center">
                <div className="ios-fill-secondary backdrop-blur-xl rounded-2xl p-6 flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 ios-tertiary rounded-full animate-spin" style={{ borderTopColor: 'var(--ios-blue)' }}></div>
                  <span className="ios-fg font-medium">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface MediaCardProps {
  object: AWS.S3.Object;
  s3Client: S3Client;
  autoLoadImages: boolean;
  onOpenFullscreen: (key: string) => void;
}

// Unified square media card for both mobile and desktop
function MediaCard({ object, s3Client, autoLoadImages, onOpenFullscreen }: MediaCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isVideo = S3Client.isVideoFile(object.Key!);
  const url = s3Client.getSignedUrl(object.Key!);
  const filename = object.Key!.split('/').pop() || object.Key!;

  const handleClick = () => {
    if (!autoLoadImages && !imageLoaded) {
      setIsLoading(true);
      setImageLoaded(true);
    } else {
      onOpenFullscreen(object.Key!);
    }
  };

  const shouldShowMedia = autoLoadImages || imageLoaded;

  return (
    <div 
      className="aspect-square cursor-pointer overflow-hidden hover:opacity-80 transition-opacity ios-fill relative"
      onClick={handleClick}
    >
      {shouldShowMedia ? (
        <>
          {isVideo ? (
            <video
              src={url}
              className="w-full h-full object-cover"
              preload="metadata"
              onLoadedData={() => setIsLoading(false)}
            />
          ) : (
            <Image
              src={url}
              alt={object.Key!}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              unoptimized
              onLoad={() => setIsLoading(false)}
            />
          )}
          
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 ios-fill flex items-center justify-center">
              <div className="w-6 h-6 border-2 ios-tertiary rounded-full animate-spin" style={{ borderTopColor: 'var(--ios-blue)' }}></div>
            </div>
          )}
          
          {/* Video indicator */}
          {isVideo && !isLoading && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-1">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <div className="text-2xl mb-2">{isVideo ? '🎬' : '📷'}</div>
          <div className="text-xs ios-secondary break-words leading-tight">
            {filename}
          </div>
        </div>
      )}
    </div>
  );
}