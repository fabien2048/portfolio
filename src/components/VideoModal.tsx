import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [shouldRender, setShouldRender] = useState(isOpen);

    const videoRef = useRef<HTMLVideoElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    // Sync shouldRender with isOpen but wait for close animation
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        }
    }, [isOpen]);

    useLayoutEffect(() => {
        if (isOpen && shouldRender && backdropRef.current && modalRef.current) {
            // Body lock
            document.body.style.overflow = 'hidden';

            const tl = gsap.timeline({
                defaults: { ease: 'power4.out', duration: 0.8 }
            });

            // Reset states
            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.set(modalRef.current, { scale: 0.8, opacity: 0, y: 40 });
            if (closeBtnRef.current) gsap.set(closeBtnRef.current, { opacity: 0, y: -20 });
            if (controlsRef.current) gsap.set(controlsRef.current, { opacity: 0, y: 20 });

            tl.to(backdropRef.current, { opacity: 1, duration: 0.5 })
                .to(modalRef.current, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, '-=0.3')
                .to([closeBtnRef.current, controlsRef.current], { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.6');

            if (videoRef.current) {
                videoRef.current.play().catch(err => console.error("Video play failed:", err));
            }
        } else if (!isOpen && shouldRender && backdropRef.current && modalRef.current) {
            // Close animation
            const tl = gsap.timeline({
                onComplete: () => {
                    setShouldRender(false);
                    document.body.style.overflow = 'unset';
                }
            });

            tl.to([closeBtnRef.current, controlsRef.current], { opacity: 0, y: 20, duration: 0.3 })
                .to(modalRef.current, { scale: 0.95, opacity: 0, y: 20, duration: 0.4, ease: 'power2.in' }, '-=0.2')
                .to(backdropRef.current, { opacity: 0, duration: 0.3 }, '-=0.2');
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, shouldRender]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            videoRef.current.currentTime = percentage * videoRef.current.duration;
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!shouldRender) return null;

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 lg:p-24 backdrop-blur-xl"
        >
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full aspect-video bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden group"
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    loop
                />

                {/* Top Close Button */}
                <button
                    ref={closeBtnRef}
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors z-10"
                >
                    <X size={32} strokeWidth={1.5} />
                </button>

                {/* Custom Controls Overlay */}
                <div
                    ref={controlsRef}
                    className="absolute inset-x-0 bottom-0 p-8 pt-16 bg-gradient-to-t from-black via-black/50 to-transparent"
                >
                    {/* Progress Bar (Clickable for Seeking) */}
                    <div
                        className="w-full h-4 mb-6 relative cursor-pointer group/progress flex items-center"
                        onClick={handleSeek}
                    >
                        <div className="w-full h-[1px] bg-white/10 relative">
                            <div
                                className="absolute h-full bg-white transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {/* Visual handle on hover */}
                        <div
                            className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                            style={{ left: `calc(${progress}% - 4px)` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-white font-lausanne text-[12px] tracking-[0.2em]">
                        <div className="flex items-center gap-10">
                            <button onClick={togglePlay} className="hover:opacity-50 transition-opacity flex items-center gap-2">
                                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                            </button>
                            <button onClick={toggleMute} className="hover:opacity-50 transition-opacity flex items-center gap-2">
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
                            </button>
                        </div>

                        <div className="opacity-40">
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>

                {/* Cinematic "CLOSE" Reveal (Motto style) */}
                <div className="absolute inset-x-0 bottom-24 flex justify-center pointer-events-none">
                    <button
                        onClick={onClose}
                        className="bg-white/5 backdrop-blur-md px-10 py-3 rounded-full text-white text-[12px] uppercase tracking-[0.3em] font-lausanne font-medium border border-white/10 pointer-events-auto hover:bg-white hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
