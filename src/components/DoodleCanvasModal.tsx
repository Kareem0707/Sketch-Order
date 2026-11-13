import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Download, Smile } from 'lucide-react';
import { playClick, playPencilScratch, playPaperFlip } from '../utils/soundEffects';

interface DoodleCanvasModalProps {
 isOpen: boolean;
 onClose: () => void;
}

export const DoodleCanvasModal: React.FC<DoodleCanvasModalProps> = ({
 isOpen,
 onClose,
}) => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [isDrawing, setIsDrawing] = useState(false);
 const [lineWidth, setLineWidth] = useState(3.5);
 const lastSoundTime = useRef<number>(0);

 useEffect(() => {
 if (!isOpen) return;
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 // Set canvas dimensions
 canvas.width = canvas.offsetWidth;
 canvas.height = canvas.offsetHeight;

 // Fill with paper white
 ctx.fillStyle = '#FFFFFF';
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 // Draw initial playful watermark prompt
 ctx.font = '18px Cairo';
 ctx.fillStyle = 'rgba(15, 15, 15, 0.25)';
 ctx.textAlign = 'center';
 ctx.fillText(' ارسم شخبطتك أو فكرة متجرك هنا بحرية...', canvas.width / 2, canvas.height / 2);
 }, [isOpen]);

 if (!isOpen) return null;

 const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
 setIsDrawing(true);
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 const rect = canvas.getBoundingClientRect();
 const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
 const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

 ctx.beginPath();
 ctx.moveTo(clientX - rect.left, clientY - rect.top);
 };

 const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
 if (!isDrawing) return;
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 const rect = canvas.getBoundingClientRect();
 const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
 const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

 ctx.strokeStyle = '#0F0F0F';
 ctx.lineWidth = lineWidth;
 ctx.lineCap = 'round';
 ctx.lineJoin = 'round';

 ctx.lineTo(clientX - rect.left, clientY - rect.top);
 ctx.stroke();

 // Throttle pencil scratch sound effect
 const now = Date.now();
 if (now - lastSoundTime.current > 160) {
 playPencilScratch();
 lastSoundTime.current = now;
 }
 };

 const stopDrawing = () => {
 setIsDrawing(false);
 };

 const clearCanvas = () => {
 playPaperFlip();
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;
 ctx.fillStyle = '#FFFFFF';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 };

 const stampStickman = () => {
 playClick();
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 const cx = canvas.width / 2;
 const cy = canvas.height / 2;

 ctx.strokeStyle = '#0F0F0F';
 ctx.lineWidth = 3;
 ctx.lineCap = 'round';

 // Head
 ctx.beginPath();
 ctx.arc(cx, cy - 30, 16, 0, Math.PI * 2);
 ctx.stroke();

 // Face
 ctx.beginPath();
 ctx.arc(cx - 5, cy - 33, 2, 0, Math.PI * 2);
 ctx.arc(cx + 5, cy - 33, 2, 0, Math.PI * 2);
 ctx.fill();

 // Smile
 ctx.beginPath();
 ctx.arc(cx, cy - 30, 10, 0.2 * Math.PI, 0.8 * Math.PI);
 ctx.stroke();

 // Torso
 ctx.beginPath();
 ctx.moveTo(cx, cy - 14);
 ctx.lineTo(cx, cy + 24);
 ctx.stroke();

 // Arms
 ctx.beginPath();
 ctx.moveTo(cx, cy - 4);
 ctx.lineTo(cx - 24, cy - 18);
 ctx.moveTo(cx, cy - 4);
 ctx.lineTo(cx + 24, cy - 18);
 ctx.stroke();

 // Legs
 ctx.beginPath();
 ctx.moveTo(cx, cy + 24);
 ctx.lineTo(cx - 18, cy + 50);
 ctx.moveTo(cx, cy + 24);
 ctx.lineTo(cx + 18, cy + 50);
 ctx.stroke();
 };

 const downloadSketch = () => {
 playClick();
 const canvas = canvasRef.current;
 if (!canvas) return;
 const dataUrl = canvas.toDataURL('image/png');
 const a = document.createElement('a');
 a.href = dataUrl;
 a.download = `sketch-order-${Date.now()}.png`;
 a.click();
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs select-none">
 <div className="relative max-w-2xl w-full bg-white border-3 md:border-4 border-[#0F0F0F] sketch-border-1 p-5 sm:p-6 sketch-shadow-xl paper-pattern">
 
 {/* Header */}
 <div className="flex items-center justify-between border-b-2 border-[#0F0F0F] pb-3 mb-4">
 <div className="flex items-center gap-2">
 <span className="w-7 h-7 border-2 border-[#0F0F0F] sketch-border-circle flex items-center justify-center font-bold text-xs bg-white">
 
 </span>
 <h3 className="text-xl font-black font-heading text-[#0F0F0F]">
 لوحة الرسم السريعة (The Doodle Pad)
 </h3>
 </div>

 <button
 onClick={() => {
 playClick();
 onClose();
 }}
 className="p-1.5 border-2 border-[#0F0F0F] sketch-border-circle hover:bg-neutral-100"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Toolbar */}
 <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border border-[#0F0F0F] p-2 sketch-border-pill bg-[#FAF9F6] text-xs font-bold">
 
 {/* Pen Size */}
 <div className="flex items-center gap-2">
 <span>سُمك الريشة:</span>
 {[2, 4, 7].map((size) => (
 <button
 key={size}
 onClick={() => {
 playClick();
 setLineWidth(size);
 }}
 className={`w-6 h-6 border-2 border-[#0F0F0F] sketch-border-circle flex items-center justify-center ${
 lineWidth === size ? 'bg-[#0F0F0F] text-white' : 'bg-white'
 }`}
 >
 {size === 2 ? '•' : size === 4 ? '●' : '⬛'}
 </button>
 ))}
 </div>

 {/* Quick Stamps */}
 <div className="flex items-center gap-2">
 <button
 onClick={stampStickman}
 className="px-2.5 py-1 border border-[#0F0F0F] sketch-border-tag bg-white hover:bg-neutral-100 flex items-center gap-1"
 >
 <Smile className="w-3.5 h-3.5" />
 <span>اختم ستيك مان</span>
 </button>

 <button
 onClick={clearCanvas}
 className="px-2.5 py-1 border border-[#0F0F0F] sketch-border-tag bg-white hover:bg-neutral-100 flex items-center gap-1"
 >
 <Trash2 className="w-3.5 h-3.5" />
 <span>مسح</span>
 </button>

 <button
 onClick={downloadSketch}
 className="px-2.5 py-1 border border-[#0F0F0F] sketch-border-tag bg-[#0F0F0F] text-white flex items-center gap-1"
 >
 <Download className="w-3.5 h-3.5" />
 <span>حفظ السكتش</span>
 </button>
 </div>

 </div>

 {/* The Drawing Canvas */}
 <div className="w-full h-80 sm:h-96 border-2 border-[#0F0F0F] sketch-border-2 bg-white overflow-hidden cursor-crosshair">
 <canvas
 ref={canvasRef}
 onMouseDown={startDrawing}
 onMouseMove={draw}
 onMouseUp={stopDrawing}
 onMouseLeave={stopDrawing}
 onTouchStart={startDrawing}
 onTouchMove={draw}
 onTouchEnd={stopDrawing}
 className="w-full h-full block touch-none"
 />
 </div>

 {/* Footer tip */}
 <div className="mt-3 text-[11px] font-mono text-center text-[#0F0F0F]/70">
 * ارسم فكرتك، احفظها، وأرفقها في استمارة طلب موقعك!
 </div>

 </div>
 </div>
 );
};
