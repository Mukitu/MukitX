import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

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

// এখানে আপনার নতুন Gemini API Key বসান
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_NEW_GEMINI_API_KEY_HERE';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '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';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! How can I help you with MukitX today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    
    const currentHistory = [...messages];
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const contents = currentHistory
        .filter(m => m.text !== 'Hello! How can I help you with MukitX today?')
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));
        
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: { systemInstruction: SYSTEM_PROMPT }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error: any) {
      console.warn("Gemini API failed, falling back to Groq...", error);
      try {
        const groqMessages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...currentHistory.map(m => ({ 
            role: m.role === 'ai' ? 'assistant' : 'user', 
            content: m.text 
          })),
          { role: 'user', content: userMessage }
        ];

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant', // Updated to the new working model
            messages: groqMessages
          })
        });

        if (!groqResponse.ok) {
          const errData = await groqResponse.json().catch(() => ({}));
          throw new Error(`Groq Error ${groqResponse.status}: ${errData.error?.message || groqResponse.statusText}`);
        }
        
        const data = await groqResponse.json();
        const reply = data.choices[0]?.message?.content || 'Sorry, I could not process that.';
        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      } catch (groqError: any) {
        console.error("Both APIs failed:", groqError);
        const geminiMsg = error?.message || 'Unknown error';
        const groqMsg = groqError?.message || 'CORS/Network error';
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `Error Details:\nGemini: ${geminiMsg}\nGroq: ${groqMsg}\n\nPlease check browser console for more details.` 
        }]);
      }
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
                <div key={i} className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary/10 ml-auto max-w-[80%]' : 'bg-secondary/10 mr-auto max-w-[80%]'}`}>
                  {m.text}
                </div>
              ))}
              {isLoading && <Loader2 className="animate-spin text-primary" />}
              <div ref={messagesEndRef} />
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
