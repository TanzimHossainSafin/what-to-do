"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useEffect} from "react";
import ChatbotAi from "./components/chatbotAi";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] text-white">
      <div className="w-full max-w-md mx-auto px-4 py-10">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-700 rounded-full p-3 shadow-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-9 w-9 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' /></svg>
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg tracking-tight text-center">Ask with Photo, Get Answers from AI</h1>
          </div>
          <p className="text-lg text-slate-300 text-center max-w-md font-medium tracking-wide mt-2"> Upload a photo, type your question — our intelligent AI gives you instant answers. Experience the future of visual Q&A.</p>
        </div>
        <ChatbotAi />
      </div>
    </div>
  );
}
