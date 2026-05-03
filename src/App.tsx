import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, ChevronRight, CheckCircle2, XCircle, Lightbulb, HelpCircle } from 'lucide-react';
import { scenario1 } from './data/scenario';
import { useTTS } from './hooks/useTTS';

type AppState = 'intro' | 'story' | 'decision' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [screenIndex, setScreenIndex] = useState(0);
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [shuffledHint2, setShuffledHint2] = useState<string[]>([]);
  
  const [decision, setDecision] = useState<'move' | 'settle' | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const { speakSequence, stop, isPlaying } = useTTS();

  const totalStoryScreens = 3;

  // Helper to determine what to show in the story state
  const getStoryContent = () => {
    // Stage 0: Background Description
    if (screenIndex === 0) {
      return {
        image: scenario1.descriptionImage,
        title: "역사적 배경",
        items: [{ character: "해설", role: "배경", text: scenario1.description, voiceParams: { pitch: 1, rate: 0.95 } }],
        label: "배경"
      };
    }
    // Stage 1: Chief & Hunter (Dialogue 0 & 1)
    if (screenIndex === 1) {
      return {
        image: scenario1.dialogues[0].image,
        title: "부족의 회의",
        items: [scenario1.dialogues[0], scenario1.dialogues[1]],
        label: "회의 1"
      };
    }
    // Stage 2: Grandmother (Dialogue 2)
    if (screenIndex === 2) {
      return {
        image: scenario1.dialogues[2].image,
        title: "지혜로운 제안",
        items: [scenario1.dialogues[2]],
        label: "회의 2"
      };
    }
    return null;
  };

  const storyContent = getStoryContent();

  // Auto-play TTS
  useEffect(() => {
    if (appState === 'story' && storyContent) {
      const sequence = storyContent.items.map(d => ({
        text: d.text,
        pitch: d.voiceParams?.pitch,
        rate: d.voiceParams?.rate,
        voiceIndex: d.voiceParams?.voiceIndex,
      }));
      const timer = setTimeout(() => {
        speakSequence(sequence);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stop();
    }
  }, [appState, screenIndex, speakSequence, stop]);

  const handleStart = () => {
    setAppState('story');
    setScreenIndex(0);
  };

  const handleNextScreen = () => {
    stop();
    if (screenIndex < totalStoryScreens - 1) {
      setScreenIndex(screenIndex + 1);
    } else {
      setShuffledHint2([...scenario1.hints.level2].sort(() => Math.random() - 0.5));
      setAppState('decision');
    }
  };

  const handleDecision = (choice: 'move' | 'settle') => {
    setDecision(choice);
    const success = Math.random() < 0.7;
    setIsSuccess(success);
    setAppState('result');
  };

  const reset = () => {
    setAppState('intro');
    setScreenIndex(0);
    setDecision(null);
    setIsSuccess(null);
    setShowHint1(false);
    setShowHint2(false);
    stop();
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#1A1A1A] font-sans flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 border-[8px] md:border-[16px] border-[#1A1A1A] select-none">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 text-center flex flex-col items-center">
          <div className="text-[10px] tracking-[0.3em] font-black uppercase text-[#1A1A1A]/40 mb-2 font-mono">SCENARIO 01</div>
          <h1 className="text-4xl md:text-5xl font-black leading-[0.85] tracking-tighter italic font-serif text-[#1A1A1A] uppercase">
             {scenario1.background}<br/>DEBATE
          </h1>
          <p className="text-[#1A1A1A]/80 mt-6 font-mono text-[10px] md:text-xs tracking-widest uppercase border-[2px] border-[#1A1A1A] px-3 py-1.5 bg-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] leading-tight max-w-[80%]">
             {scenario1.title}
          </p>
        </header>

        <AnimatePresence mode="wait">
          
          {appState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-[3px] border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] overflow-hidden text-center p-8 md:p-12 mt-12 relative flex flex-col items-center"
            >
              <div className="absolute top-0 left-0 p-4 w-full flex justify-between tracking-[0.3em] uppercase font-mono text-[10px] text-[#1A1A1A]/40 font-black">
                <span>START SYSTEM</span><span>00:00:00</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-[0.85] tracking-tighter italic font-serif mt-6 mb-8 text-[#1A1A1A]">
                역사 속으로<br/>떠날 준비가 되었나요?
              </h2>
              <p className="text-[#1A1A1A] mb-12 max-w-lg mx-auto leading-relaxed font-serif text-lg">
                사진을 보고, 사람들의 이야기를 들으며 우리 부족이 나아가야 할 길을 직접 선택해보세요. 
                여러분의 선택이 역사를 만듭니다!
              </p>
              <button
                onClick={handleStart}
                className="bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] transition-all px-8 md:px-12 py-4 font-black uppercase tracking-[0.3em] text-[12px] flex items-center gap-2 border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
              >
                <Play className="w-5 h-5 fill-current" /> 시작하기
              </button>
            </motion.div>
          )}

          {appState === 'story' && storyContent && (
            <motion.div
              key={`story-${screenIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border-[3px] border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] overflow-hidden flex flex-col h-[85vh] md:h-[70vh] min-h-[600px] relative"
            >
              <div className="absolute top-0 left-0 p-4 w-full flex justify-between tracking-[0.3em] uppercase font-mono text-[10px] text-[#1A1A1A]/80 font-black z-10 pointer-events-none bg-white/50 backdrop-blur-sm border-b-[3px] border-[#1A1A1A]">
                <span>SEQ 0{screenIndex + 1}</span><span>{storyContent.label}</span>
              </div>

              {/* Layout: Image Left, Text Right on MD+ screens */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden pt-14">
                
                {/* Image Side */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-[#EAEAEA] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#1A1A1A] p-4 flex items-center justify-center">
                  <img 
                    src={storyContent.image} 
                    alt={storyContent.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover border-[3px] border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]"
                  />
                  <div className="absolute bottom-4 right-4 bg-[#1A1A1A] text-white px-2 py-1 text-[8px] font-mono uppercase tracking-widest border border-white">
                     {storyContent.image.startsWith('http') ? 'SOURCE: REMOTE_STAGING' : `SRC: ${storyContent.image.replace('.png', '').toUpperCase()}`}
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto p-6 sm:p-8">
                  <div className="flex-1 space-y-4">
                    {storyContent.items.map((item: any, idx) => (
                      <div key={idx} className="bg-[#F8F8F8] p-5 border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] relative">
                        <div className="text-[10px] tracking-[0.3em] font-mono font-black uppercase text-[#1A1A1A] mb-2 border-b-[2px] border-[#1A1A1A] pb-1 inline-block">
                          {item.character} {item.role ? `(${item.role})` : ''}
                        </div>
                        <p className="text-[#1A1A1A] text-lg font-serif italic leading-snug">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons Bottom */}
              <div className="p-4 sm:p-6 border-t-[3px] border-[#1A1A1A] bg-[#F8F8F8] flex flex-col sm:flex-row gap-4 justify-between items-center text-[10px] font-mono uppercase tracking-[0.3em]">
                <button 
                  onClick={() => {
                      if (isPlaying) stop();
                      else {
                         const sequence = storyContent.items.map((d: any) => ({
                              text: d.text, 
                              pitch: d.voiceParams?.pitch, 
                              rate: d.voiceParams?.rate,
                              voiceIndex: d.voiceParams?.voiceIndex
                         }));
                         speakSequence(sequence);
                      }
                  }}
                  className="flex items-center gap-2 px-6 py-3 border-[2px] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors font-bold shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none bg-white text-[#1A1A1A] w-full sm:w-auto justify-center"
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  {isPlaying ? '소리 중지' : '소리 재생'}
                </button>

                <button
                  onClick={handleNextScreen}
                  className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#1A1A1A] text-white px-8 py-4 font-black transition-transform hover:translate-y-1 hover:translate-x-1 border-[2px] border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:shadow-none"
                >
                  {screenIndex < totalStoryScreens - 1 ? '다음 화면' : '선택하기'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {appState === 'decision' && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white border-[3px] border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] overflow-hidden p-6 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-black leading-[0.85] tracking-tighter italic font-serif border-b-[3px] border-[#1A1A1A] pb-6 mb-8 text-center uppercase text-[#1A1A1A]">
                  THE CHOICE
                </h2>

                <div className="mb-10 space-y-4">
                  <div className="bg-[#EAEAEA] border-[3px] border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                    <button 
                      onClick={() => setShowHint1(!showHint1)}
                      className="flex items-center justify-between w-full text-left font-black tracking-widest uppercase text-[10px] sm:text-sm font-mono text-[#1A1A1A]"
                    >
                      <span className="flex items-center gap-2"><Lightbulb className="w-5 h-5" /> HINT 01: KEYWORDS</span>
                      <ChevronRight className={`w-5 h-5 transition-transform ${showHint1 ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showHint1 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{opacity: 0, height: 0}} className="overflow-hidden">
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                            <div className="bg-white p-4 border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                              <div className="text-[10px] text-[#1A1A1A]/60 font-black uppercase tracking-widest mb-3 font-mono border-b-[1px] border-[#1A1A1A] pb-1">MOVE PATH</div>
                              <div className="flex flex-wrap gap-2">
                                {scenario1.hints.level1.teamMove.map(kw => <span key={kw} className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-mono">{kw}</span>)}
                              </div>
                            </div>
                            <div className="bg-[#F8F8F8] p-4 border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                              <div className="text-[10px] text-[#1A1A1A]/60 font-black uppercase tracking-widest mb-3 font-mono border-b-[1px] border-[#1A1A1A] pb-1">SETTLE PATH</div>
                              <div className="flex flex-wrap gap-2">
                                 {scenario1.hints.level1.teamSettle.map(kw => <span key={kw} className="px-2 py-1 bg-white text-[#1A1A1A] border border-[#1A1A1A] text-[10px] font-mono">{kw}</span>)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="bg-[#2A2A2A] text-white border-[3px] border-[#1A1A1A] p-4 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                    <button 
                      onClick={() => setShowHint2(!showHint2)}
                      className="flex items-center justify-between w-full text-left font-black tracking-widest uppercase text-[10px] sm:text-sm font-mono text-white"
                    >
                      <span className="flex items-center gap-2"><HelpCircle className="w-5 h-5" /> HINT 02: GUIDANCE</span>
                      <ChevronRight className={`w-5 h-5 transition-transform ${showHint2 ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showHint2 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{opacity: 0, height: 0}} className="overflow-hidden">
                          <div className="mt-4 flex flex-col gap-3 pb-2">
                            {shuffledHint2.map((hint, idx) => (
                               <div key={idx} className="bg-[#1A1A1A] px-4 py-4 border-[2px] border-white/20 text-white text-sm font-serif italic">
                                 "{hint}"
                               </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <button 
                      onClick={() => handleDecision('move')}
                      className="group bg-[#EAEAEA] border-[3px] border-[#1A1A1A] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:translate-y-1 hover:translate-x-1 transition-all flex flex-col items-center gap-4 text-[#1A1A1A] relative"
                   >
                     <span className="text-[10px] tracking-[0.3em] font-mono font-black uppercase text-[#1A1A1A]/50">Path A</span>
                     <span className="text-4xl font-black italic font-serif leading-none mt-2">이동하자</span>
                     <span className="font-mono text-[10px] tracking-widest uppercase border-t-[2px] border-[#1A1A1A] pt-4 mt-2 w-full text-center">CONTINUE FORAGING</span>
                   </button>
                   
                   <button 
                      onClick={() => handleDecision('settle')}
                      className="group bg-[#2A2A2A] text-white border-[3px] border-[#1A1A1A] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:translate-y-1 hover:translate-x-1 transition-all flex flex-col items-center gap-4 relative"
                   >
                     <span className="text-[10px] tracking-[0.3em] font-mono font-black uppercase text-white/40">Path B</span>
                     <span className="text-4xl font-black italic font-serif leading-none mt-2">정착하자</span>
                     <span className="font-mono text-[10px] tracking-widest uppercase border-t-[2px] border-white/20 pt-4 mt-2 w-full text-center">START FARMING</span>
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {appState === 'result' && decision && isSuccess !== null && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-[3px] border-[#1A1A1A] shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] overflow-hidden p-8 flex flex-col items-center min-h-[400px] justify-center text-[#1A1A1A]"
            >
              <div className="mb-6">
                {isSuccess ? <CheckCircle2 className="w-24 h-24" /> : <XCircle className="w-24 h-24" />}
              </div>
              
              <h2 className="text-4xl font-black italic font-serif mb-8 uppercase">
                {isSuccess ? 'SUCCESS' : 'FAILURE'}
              </h2>
              
              <div className="bg-[#EAEAEA] p-6 sm:p-8 mb-10 border-[3px] border-[#1A1A1A] text-center shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] w-full max-w-lg">
                <p className="text-lg sm:text-xl leading-relaxed mb-8 font-serif italic font-bold">
                  "{scenario1.outcomes[decision][isSuccess ? 'success' : 'failure'].text}"
                </p>
                <div className="border-t-[3px] border-[#1A1A1A] pt-6">
                  <span className="inline-block bg-[#1A1A1A] text-white px-6 py-2 font-mono text-[12px] tracking-widest font-black uppercase">
                    {scenario1.outcomes[decision][isSuccess ? 'success' : 'failure'].points}
                  </span>
                </div>
              </div>

              <button
                onClick={reset}
                className="bg-white text-[#1A1A1A] border-[3px] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors font-black py-4 px-8 tracking-[0.3em] uppercase text-[12px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]"
              >
                RESTART SYSTEM
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
