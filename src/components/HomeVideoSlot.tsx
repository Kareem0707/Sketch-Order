import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Check,
  X,
  Film,
  Info,
} from 'lucide-react';
import { StickmanDoodle } from './common/StickmanDoodle';
import { playClick, playCashSound, playPaperFlip } from '../utils/soundEffects';

interface HomeVideoSlotProps {
  initialVideoUrl?: string;
  onOpenStudio?: () => void;
  className?: string;
}

export const HomeVideoSlot: React.FC<HomeVideoSlotProps> = ({
  initialVideoUrl = '',
  onOpenStudio,
  className = '',
}) => {
  // Video Source Management (Stored locally so user can test their video right away)
  const [videoUrl, setVideoUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sketch_home_video_url');
      return saved !== null ? saved : initialVideoUrl;
    } catch {
      return initialVideoUrl;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30); // 30s for demo animation
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingUrlModalOpen, setIsSettingUrlModalOpen] = useState<boolean>(false);
  const [tempUrlInput, setTempUrlInput] = useState<string>(videoUrl);
  const [demoScenePhase, setDemoScenePhase] = useState<'mess' | 'drawing' | 'success'>('mess');

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const demoIntervalRef = useRef<number | null>(null);

  // Helper: Detect if url is YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      const match = url.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
      }
      return url;
    } catch {
      return url;
    }
  };

  // Demo animation loop when no external video is provided
  useEffect(() => {
    if (videoUrl.trim() !== '') {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
      return;
    }

    if (isPlaying) {
      demoIntervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5;
          if (next >= 30) {
            setIsPlaying(false);
            return 30;
          }
          // Phases
          if (next < 10) {
            setDemoScenePhase('mess');
          } else if (next < 20) {
            setDemoScenePhase('drawing');
          } else {
            setDemoScenePhase('success');
          }
          return next;
        });
      }, 500);
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    }

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, [isPlaying, videoUrl]);

  const togglePlay = () => {
    playClick();
    if (videoUrl.trim() !== '') {
      if (videoElementRef.current) {
        if (isPlaying) {
          videoElementRef.current.pause();
        } else {
          videoElementRef.current.play();
        }
      }
    } else {
      // Demo loop
      if (!isPlaying && currentTime >= duration) {
        setCurrentTime(0);
        setDemoScenePhase('mess');
      }
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        playPaperFlip();
      }
    }
  };

  const handleRestart = () => {
    playClick();
    setCurrentTime(0);
    setDemoScenePhase('mess');
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
      videoElementRef.current.play();
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = val;
    } else {
      if (val < 10) setDemoScenePhase('mess');
      else if (val < 20) setDemoScenePhase('drawing');
      else setDemoScenePhase('success');
    }
  };

  const toggleMute = () => {
    playClick();
    setIsMuted(!isMuted);
    if (videoElementRef.current) {
      videoElementRef.current.muted = !isMuted;
    }
  };

  const toggleFullscreen = () => {
    playClick();
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSaveCustomVideoUrl = () => {
    playClick();
    const clean = tempUrlInput.trim();
    setVideoUrl(clean);
    try {
      localStorage.setItem('sketch_home_video_url', clean);
    } catch {
      // ignore
    }
    setIsSettingUrlModalOpen(false);
    setCurrentTime(0);
    setIsPlaying(false);
    if (clean) {
      playCashSound();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`space-y-3.5 select-none ${className}`}>
      
      {/* ======================================================== */}
      {/* 1. TOP VIDEO HEADER BADGE (Status & Quick Action)        */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-black font-heading tracking-wide text-[#0F0F0F] dark:text-white flex items-center gap-1.5">
            <Film className="w-4 h-4 text-[#D9722B]" />
            <span>فيديو الشاشة الرئيسية (مكان مخصص)</span>
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D9722B]/15 text-[#D9722B] dark:text-[#E88B4D] border border-[#D9722B]/30">
            {videoUrl ? 'فيديو مخصص نشط' : 'عرض توضيحي 30 ثانية'}
          </span>
        </div>

        {/* Quick URL Config Button */}
        <button
          onClick={() => {
            playClick();
            setTempUrlInput(videoUrl);
            setIsSettingUrlModalOpen(true);
          }}
          className="text-xs font-bold px-2.5 py-1 rounded-lg border border-dashed border-[#0F0F0F]/30 dark:border-slate-600 hover:border-[#D9722B] hover:text-[#D9722B] dark:text-slate-300 transition-colors flex items-center gap-1.5 bg-white dark:bg-slate-900"
          title="ضع رابط فيديو MP4 أو يوتيوب هنا"
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#D9722B]" />
          <span>{videoUrl ? 'تعديل رابط الفيديو' : 'ضع رابط الفيديو الخاص بك'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. THE DEDICATED VIDEO PLAYER CONTAINER (Wireframe Box)  */}
      {/* ======================================================== */}
      <div
        ref={playerContainerRef}
        className="relative group rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-[#0F0F0F] dark:border-slate-600 bg-neutral-950 text-white sketch-shadow-lg overflow-hidden aspect-video flex flex-col justify-between"
      >
        {/* Wireframe CRT / Paper Background Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

        {/* ---------------------------------------------------- */}
        {/* CASE A: EXTERNAL YOUTUBE VIDEO                      */}
        {/* ---------------------------------------------------- */}
        {videoUrl && isYouTubeUrl(videoUrl) ? (
          <div className="w-full h-full relative z-10">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title="سكتش أوردر - فيديو الشاشة الرئيسية"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : videoUrl && !isYouTubeUrl(videoUrl) ? (
          /* -------------------------------------------------- */
          /* CASE B: DIRECT HTML5 VIDEO (MP4 / WebM)            */
          /* -------------------------------------------------- */
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <video
              ref={videoElementRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={() => {
                if (videoElementRef.current) {
                  setCurrentTime(videoElementRef.current.currentTime);
                  setDuration(videoElementRef.current.duration || 30);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Play Overlay if paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors z-20"
                aria-label="تشغيل الفيديو"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#D9722B] text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform border-3 border-white">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </button>
            )}
          </div>
        ) : (
          /* -------------------------------------------------- */
          /* CASE C: BUILT-IN INTERACTIVE 2D STORY DEMO VIDEO   */
          /* (Works immediately right out of the box!)          */
          /* -------------------------------------------------- */
          <div
            onClick={togglePlay}
            className="w-full h-full relative z-10 cursor-pointer flex flex-col items-center justify-center p-4 sm:p-6 text-center"
          >
            {/* Stage Backdrop Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#18181B] via-[#0F172A] to-[#090D16] z-0"></div>

            {/* Content per phase */}
            <div className="relative z-10 max-w-lg space-y-3">
              {/* Mascot Doodle */}
              <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto animate-wobble-slow">
                <StickmanDoodle size={90} />
              </div>

              {/* Dynamic Phase Storyboard */}
              {demoScenePhase === 'mess' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-0.5 rounded-full border border-red-500/30">
                    المشهد 1: فوضى الواتس وضياع الأوردرات (0s - 10s)
                  </span>
                  <h4 className="text-base sm:text-xl font-heading font-black text-white">
                    "حولت فودافون كاش ومحدش بيرد عليا.. والأوردر اتلغى!"
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto line-clamp-2">
                    68% من أصحاب المتاجر في مصر بيعانوا من زحمة الرسائل وتأخير الردود والمندوب اللي بيرجع الشحنة.
                  </p>
                </div>
              )}

              {demoScenePhase === 'drawing' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <span className="text-xs font-bold text-[#D9722B] bg-[#D9722B]/20 px-3 py-0.5 rounded-full border border-[#D9722B]/40">
                    المشهد 2: القلم السحري بيرسم متجرك (10s - 20s)
                  </span>
                  <h4 className="text-base sm:text-xl font-heading font-black text-white">
                    سكتش أوردر: في دقايق متجرك اتصمم بدومين خاص وهوية فريدة!
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto line-clamp-2">
                    بدون اشتراكات شهرية، بدون عمولات مبيعات، وبدون أي تعقيد برمجي.
                  </p>
                </div>
              )}

              {demoScenePhase === 'success' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-500/30">
                    المشهد 3: الأوردرات بتتسلم تلقائياً (20s - 30s)
                  </span>
                  <h4 className="text-base sm:text-xl font-heading font-black text-white">
                    الزبون بيطلب في ثواني، وأنت بتشرب قهوتك وبتتابع أرباحك!
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto line-clamp-2">
                    الفاتورة بتروح تلقائياً للواتساب، واللوكيشن بيوصل للمندوب بدون مكالمات رايحة جاية.
                  </p>
                </div>
              )}
            </div>

            {/* Play Button Overlay if Paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-2xs z-20">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#D9722B] text-white flex items-center justify-center shadow-2xl border-3 border-white transform hover:scale-110 active:scale-95 transition-all">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <div className="text-xs font-bold text-zinc-200 bg-black/60 px-3 py-1 rounded-full border border-zinc-700">
                    اضغط لتشغيل الفيديو التوضيحي (30 ثانية)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* BOTTOM VIDEO CONTROLS BAR (Wireframe Styled Bar)    */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-20 bg-neutral-900/90 backdrop-blur-md border-t border-zinc-800 p-2.5 sm:p-3 space-y-2">
          {/* Progress Timeline Scrubber */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#D9722B]"
              aria-label="شريط تقدم الفيديو"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between text-xs text-zinc-300">
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-[#D9722B] hover:text-white transition-colors"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title="إعادة من البداية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Time Display */}
              <span className="font-mono text-[11px] text-zinc-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {onOpenStudio && (
                <button
                  onClick={() => {
                    playClick();
                    onOpenStudio();
                  }}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-black text-white bg-[#D9722B] hover:bg-[#C25E1D] px-3 py-1 rounded-md transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>جرّب المتجر الآن</span>
                </button>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. "NOTE HERE" CALLOUT SPEECH BUBBLE (From Wireframe!)  */}
      {/* Exactly matches the dark [Note here] bubble in Image 2  */}
      {/* ======================================================== */}
      <div className="relative pt-1">
        {/* Comic Speech Pointer Tail (pointing UP into the video) */}
        <div className="w-4 h-3 mx-auto -mb-1 relative z-10">
          <svg className="w-4 h-3 text-[#18181B] dark:text-[#1E293B]" viewBox="0 0 16 12" fill="currentColor">
            <polygon points="8,0 16,12 0,12" />
          </svg>
        </div>

        {/* Speech Bubble Box */}
        <div className="bg-[#18181B] dark:bg-[#1E293B] text-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#0F0F0F] dark:border-slate-600 sketch-shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#D9722B]/20 text-[#D9722B] shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-heading font-black text-sm sm:text-base text-zinc-100 flex items-center gap-2">
              <span>ملاحظة هنا • Note here:</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-normal">
                مكان الفيديو الرئيسي
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed font-bold">
              هنا مكان مخصص لفيديو الشاشة الرئيسية. حالياً شغال عليه العرض التوضيحي الكرتوني التفاعلي لسكتش أوردر،
              وتقدر في أي وقت تضغط على <span className="text-[#D9722B] underline cursor-pointer" onClick={() => setIsSettingUrlModalOpen(true)}>«ضع رابط الفيديو»</span> وتضيف ملف MP4 أو رابط يوتيوب المخصص لمتجرك!
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL: SET CUSTOM VIDEO URL (MP4 / YouTube)           */}
      {/* ======================================================== */}
      {isSettingUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-md w-full bg-white dark:bg-[#111827] text-[#0F0F0F] dark:text-white rounded-3xl border-3 border-[#0F0F0F] dark:border-slate-700 p-6 sketch-shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#D9722B]" />
                <h3 className="font-heading font-black text-lg">
                  إعداد فيديو الشاشة الرئيسية
                </h3>
              </div>
              <button
                onClick={() => setIsSettingUrlModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              ضع رابط فيديو متجرك هنا (يدعم رابط يوتيوب مباشر أو مسار ملف MP4 / WebM):
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="مثال: https://www.youtube.com/watch?v=... أو /my-video.mp4"
                value={tempUrlInput}
                onChange={(e) => setTempUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0F0F0F] dark:border-slate-600 bg-neutral-50 dark:bg-slate-900 font-mono text-xs focus:outline-hidden focus:border-[#D9722B]"
                dir="ltr"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setTempUrlInput('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                  className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-neutral-200 dark:bg-slate-800 hover:bg-[#D9722B]/20 transition-colors"
                >
                  تجربة رابط يوتيوب
                </button>
                <button
                  type="button"
                  onClick={() => setTempUrlInput('')}
                  className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-neutral-200 dark:bg-slate-800 hover:bg-red-500/20 text-red-500 transition-colors"
                >
                  استعادة العرض التوضيحي الافتراضي
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200 dark:border-slate-700">
              <button
                onClick={() => setIsSettingUrlModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-slate-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCustomVideoUrl}
                className="btn-sketch btn-sketch-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتشغيل</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
