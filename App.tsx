
import React, { useState, useRef } from 'react';
import { AppState } from './types';
import { generateFestiveImage } from './services/geminiService';
import Editor from './components/Editor';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.IDLE);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startGeneration = async () => {
    if (!sourceImage) return;
    setCurrentStep(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const result = await generateFestiveImage(sourceImage);
      setGeneratedImage(result);
      setCurrentStep(AppState.EDITING);
    } catch (err: any) {
      setErrorMsg(err.message || "Oops! 生成失敗了。");
      setCurrentStep(AppState.ERROR);
    }
  };

  const reset = () => {
    setSourceImage(null);
    setGeneratedImage(null);
    setCurrentStep(AppState.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 transition-all duration-500">
      {/* Header with younger vibe */}
      <header className="text-center mb-10">
        <div className="inline-block bg-yellow-400 text-red-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-lg animate-bounce">
          2026 New Year Party
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-2xl">
          皮克斯新春派對
        </h1>
        <p className="text-lg text-white/70 font-medium italic tracking-wide">
          #ZootopiaStyle #LunarNewYear #AIArt
        </p>
      </header>

      <main className="w-full max-w-5xl glass rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        
        {currentStep === AppState.IDLE && (
          <div className="flex flex-col items-center space-y-10 py-16 px-6">
            <div 
              className="relative group cursor-pointer w-full max-w-sm aspect-square"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-full h-full border-2 border-dashed border-white/30 rounded-[2rem] flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all overflow-hidden">
                {sourceImage ? (
                  <img src={sourceImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-white">上傳你的照片</p>
                    <p className="text-sm text-white/50 mt-2">讓我們為你變身動物方程式角色</p>
                  </div>
                )}
              </div>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            
            <button
              disabled={!sourceImage}
              onClick={startGeneration}
              className={`group relative px-12 py-5 rounded-2xl text-xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-2xl overflow-hidden ${
                sourceImage 
                  ? 'bg-white text-red-900' 
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">開始變身 🚀</span>
            </button>
          </div>
        )}

        {currentStep === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-white/20 border-t-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🦊</span>
              </div>
            </div>
            <div className="text-center px-6">
              <h2 className="text-3xl font-black text-white mb-2">正在前往《動物方程式》...</h2>
              <p className="text-white/60">正在結合你的特徵與馬年元素</p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}

        {currentStep === AppState.EDITING && generatedImage && (
          <Editor imageUrl={generatedImage} onReset={reset} />
        )}

        {currentStep === AppState.ERROR && (
          <div className="text-center py-24 px-6">
            <div className="text-6xl mb-6">🥺</div>
            <h2 className="text-3xl font-black text-white mb-4">哎呀，網路有點堵塞</h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto">{errorMsg}</p>
            <button onClick={reset} className="px-10 py-4 bg-white text-red-900 rounded-2xl font-black hover:bg-yellow-400 transition-colors shadow-xl">
              再試一次
            </button>
          </div>
        )}
      </main>

      <footer className="mt-12 text-white/30 text-xs font-bold uppercase tracking-widest flex items-center gap-4">
        <span>Made with Gemini AI</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Disney Style Inspired</span>
      </footer>
    </div>
  );
};

export default App;
