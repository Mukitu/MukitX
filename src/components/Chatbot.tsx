import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const SYSTEM_PROMPT = `You are MukitX AI assistant for the website. 
Help visitors with services, courses, digital products, enrollment, and payment instructions. 
Additionally, act as an intelligent tutor for students. You can help solve programming problems (in any language), explain academic concepts, and guide them through general learning challenges. 
Keep responses professional, friendly, and human-like.

Brand Information:
Company: MukitX
Owner/Founder: Mukitu Islam Nishat (International fellowship-awarded Software Developer)
Contact Number: +8809638-957563
Location: Rajshahi, Bangladesh
Email: mukitunishat@gmail.com

Services: Web Development, SaaS Development, UI/UX Design, Mobile App Development, Automation Tools, Digital Marketing
Courses: Recorded courses via YouTube unlisted links, Live courses via Zoom link
Digital Products: Website templates, Automation tools, Source code, SaaS scripts
Payment: Bkash, Rocket (manual verification via transaction ID)

Rules: 
1. Prioritize MukitX-related information when asked about the company.
2. For student queries (programming, academic, general), provide clear, step-by-step, and easy-to-understand solutions.
3. If asked about the owner, mention Mukitu Islam Nishat, his role as an International fellowship-awarded Software Developer.
4. Always provide the contact number and location when asked about contact information.`;

const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! How can I help you with MukitX today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const chat = useRef(ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: SYSTEM_PROMPT }
  }));

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please check if the API key is configured correctly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-96 bg-white dark:bg-dark-bg rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col overflow-hidden mb-4"
          >
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold">MukitX Assistant</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary/10 ml-auto max-w-[80%]' : 'bg-secondary/10 mr-auto max-w-[80%]'}`}>
                  {m.text}
                </div>
              ))}
              {isLoading && <Loader2 className="animate-spin text-primary" />}
            </div>
            <div className="p-4 border-t dark:border-white/10 flex gap-2">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow p-2 rounded-lg border dark:border-white/10 bg-transparent outline-none"
                placeholder="Ask something..."
              />
              <button onClick={handleSend} className="bg-primary text-white p-2 rounded-lg"><Send size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
