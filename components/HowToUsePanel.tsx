'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Shield, Sword, Scale, Trophy } from 'lucide-react';

export function HowToUsePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[80] flex items-center justify-center h-14 w-14 rounded-full bg-black border border-gold/40 text-gold shadow-[0_0_20px_rgba(243,156,18,0.3)] hover:scale-110 hover:shadow-[0_0_30px_rgba(243,156,18,0.6)] transition-all cursor-none"
      >
        <HelpCircle size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-none"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-gold/30 bg-[#0a0a0f] p-8 shadow-[0_0_50px_rgba(243,156,18,0.15)]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white hover:scale-110 transition-all cursor-none"
              >
                <X size={24} />
              </button>

              <h2 className="font-cinzel text-3xl text-gold mb-6 uppercase tracking-widest text-center">How To Engage in Battle</h2>
              
              <div className="space-y-8 font-sans text-gray-300">
                <section className="space-y-3">
                  <h3 className="font-bebas text-2xl text-white flex items-center gap-2"><Sword className="text-crimson"/> 1. Choose Your Prompts</h3>
                  <p>In the arena, two different prompts are pitched against each other. You can choose to have them perform the exact same task (recommended) by using the shared <strong>Battle Context</strong>, or test entirely distinct requests.</p>
                </section>

                <section className="space-y-3">
                  <h3 className="font-bebas text-2xl text-white flex items-center gap-2"><Scale className="text-steel-light"/> 2. The Llama 3 Judge</h3>
                  <p>Our completely unbiased LLM judge reviews both prompts without seeing which is which. It applies penalty rules for hallucinations and scores them across 5 dimensions: Clarity, Specificity, Quality, Alignment, and Formatting.</p>
                </section>

                <section className="space-y-3">
                  <h3 className="font-bebas text-2xl text-white flex items-center gap-2"><Shield className="text-emerald-500"/> 3. Bias Prevention</h3>
                  <p>To avoid prompt positional bias (where the model favors the first prompt), we run the battle twice by swapping their positions internally, ensuring absolute fairness in the verdict.</p>
                </section>
                
                <div className="bg-black/50 border border-white/10 p-4 rounded-xl mt-6">
                  <p className="font-mono text-sm text-gold-light italic">"A good prompt isn't just long. It's perfectly clear, strictly formatted, and free from contradiction. Enter the arena and refine your skills."</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
