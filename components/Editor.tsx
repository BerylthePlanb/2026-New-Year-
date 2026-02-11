
import React, { useState, useRef, useEffect } from 'react';
import { GREETINGS } from '../constants';
import { TextState } from '../types';

interface EditorProps {
  imageUrl: string;
  onReset: () => void;
}

const Editor: React.FC<EditorProps> = ({ imageUrl, onReset }) => {
  const [texts, setTexts] = useState<TextState[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 點擊空白處取消選取
  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
      setSelectedTextId(null);
    }
  };

  const addGreeting = (text: string) => {
    const newText: TextState = {
      id: Date.now(),
      content: text,
      x: 50,
      y: 50,
      fontSize: 32,
      color: '#ffffff',
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const removeText = (id: number) => {
    setTexts(texts.filter(t => t.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const updateText = (id: number, updates: Partial<TextState>) => {
    setTexts(texts.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // 拖曳邏輯 (支援滑鼠與觸控)
  const handleStartMove = (e: React.MouseEvent | React.TouchEvent, id: number) => {
    e.stopPropagation();
    setSelectedTextId(id);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const startX = clientX;
    const startY = clientY;
    const item = texts.find(t => t.id === id)!;
    const initialX = item.x;
    const initialY = item.y;

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const deltaX = ((currentX - startX) / containerRect.width) * 100;
      const deltaY = ((currentY - startY) / containerRect.height) * 100;

      updateText(id, {
        x: Math.max(5, Math.min(95, initialX + deltaX)),
        y: Math.max(5, Math.min(95, initialY + deltaY))
      });
    };

    const onEnd = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const drawCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    await new Promise((resolve) => { img.onload = resolve; });

    const SIZE = 1024;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const scale = SIZE / container.clientWidth;

    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    texts.forEach(t => {
      const finalFontSize = t.fontSize * scale;
      ctx.font = `900 ${finalFontSize}px "Noto Sans TC", sans-serif`;
      ctx.fillStyle = t.color;
      
      const posX = (t.x / 100) * SIZE;
      const posY = (t.y / 100) * SIZE;
      
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = finalFontSize * 0.15;
      ctx.strokeText(t.content, posX, posY);
      ctx.fillText(t.content, posX, posY);
    });

    return canvas;
  };

  const handleDownload = async () => {
    const canvas = await drawCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = `CNY_2026_Pixar_Card.png`;
    link.click();
  };

  const handleShare = async () => {
    const canvas = await drawCanvas();
    if (!canvas) return;
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'Pixar_CNY_Card.png', { type: 'image/png' });
      
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: '我的 2026 皮克斯賀卡',
            text: '祝大家新年快樂！',
          });
        } catch (e) {
          alert("分享失敗，請先下載圖片後手動分享。");
        }
      } else {
        alert("瀏覽器不支援直接分享，請下載圖片。");
      }
    }, 'image/png');
  };

  const selectedText = texts.find(t => t.id === selectedTextId);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
      {/* 畫布區域 */}
      <div 
        className="flex-1 p-4 lg:p-10 flex flex-col items-center justify-center bg-black/40 min-h-[400px]"
        onMouseDown={handleContainerClick}
        onTouchStart={handleContainerClick}
      >
        <div 
          ref={containerRef}
          className="relative aspect-square w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 select-none touch-none"
        >
          <img src={imageUrl} alt="Generated" className="w-full h-full object-cover pointer-events-none" />
          
          {texts.map(t => (
            <div
              key={t.id}
              onMouseDown={(e) => handleStartMove(e, t.id)}
              onTouchStart={(e) => handleStartMove(e, t.id)}
              style={{ 
                left: `${t.x}%`, 
                top: `${t.y}%`, 
                fontSize: `${t.fontSize}px`, 
                color: t.color,
                zIndex: selectedTextId === t.id ? 50 : 10,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)'
              }}
              className={`absolute cursor-move font-black whitespace-nowrap px-3 py-1 leading-none transition-transform duration-75 ${
                selectedTextId === t.id ? 'ring-2 ring-yellow-400 bg-white/10 rounded-lg scale-110' : ''
              }`}
            >
              {t.content}
              {selectedTextId === t.id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeText(t.id); }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-white/50 text-[10px] font-bold uppercase tracking-widest animate-pulse">
          {selectedTextId ? "拖曳文字移動位置" : "點選賀詞加入圖片"}
        </p>
      </div>

      {/* 控制面板 */}
      <div className="w-full lg:w-96 bg-zinc-900 lg:bg-black/80 backdrop-blur-3xl p-6 lg:p-8 flex flex-col gap-6">
        
        {/* 文字調整區 (僅選取時顯示) */}
        {selectedTextId && selectedText ? (
          <section className="bg-white/10 p-5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xs font-black text-yellow-400 mb-4 uppercase tracking-wider">調整文字大小與顏色</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-2 font-bold">
                  <span>大小: {selectedText.fontSize}px</span>
                </div>
                <input 
                  type="range" min="16" max="100" 
                  value={selectedText.fontSize} 
                  onChange={(e) => updateText(selectedTextId, { fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
              </div>
              <div>
                <div className="text-[10px] text-white/40 mb-3 font-bold">顏色選擇</div>
                <div className="flex gap-3">
                  {['#ffffff', '#fbbf24', '#ff4d4d', '#000000', '#4ade80', '#60a5fa'].map(c => (
                    <button
                      key={c}
                      onClick={() => updateText(selectedTextId, { color: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedText.color === c ? 'border-white scale-125' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section>
            <h3 className="text-xs font-black text-white/40 mb-4 uppercase tracking-[0.2em]">選擇賀詞</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {GREETINGS.map(g => (
                <button
                  key={g.id}
                  onClick={() => addGreeting(g.text)}
                  className="text-left px-4 py-3 bg-white/5 hover:bg-yellow-400 hover:text-red-900 rounded-xl transition-all font-bold text-xs"
                >
                  {g.text}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 下方按鈕區 */}
        <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="py-4 bg-white text-black rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all flex items-center justify-center"
            >
              儲存圖片
            </button>
            <button
              onClick={handleShare}
              className="py-4 bg-red-600 text-white rounded-2xl text-sm font-black hover:bg-red-500 transition-all flex items-center justify-center"
            >
              立即分享
            </button>
          </div>
          <button
            onClick={onReset}
            className="w-full py-3 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            重新製作
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Editor;
