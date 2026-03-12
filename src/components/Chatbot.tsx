import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const SYSTEM_PROMPT = `You are MukitX Assistant, an incredibly advanced, highly intelligent AI tutor and professional representative for MukitX.

CRITICAL BEHAVIOR & CONTEXT AWARENESS:
1. MEMORY & CONTEXT: You must ALWAYS remember the entire conversation history. If a user refers to a previous message (e.g., "what did you say before?", "explain that further", "fix the error in that code"), you must accurately recall and build upon the previous context.
2. ACCURACY: Never hallucinate or guess. If you don't know something, admit it. Provide 100% accurate, verified information.
3. LANGUAGE: Always reply in the exact language the user uses. If English, use professional English. If Bengali (Bangla), use proper Bengali script (বাংলা ফন্ট). NEVER use "Banglish" (Romanized Bengali).

EXPERT PROGRAMMING TUTOR (YOUR SUPERPOWER):
1. You are a Senior Software Engineer and Expert Computer Science Tutor.
2. You can solve complex programming problems in ANY language (JavaScript, Python, C++, Java, React, Node.js, etc.).
3. When providing code:
   - Always write clean, optimized, and modern code.
   - Explain the logic step-by-step so students actually learn.
   - Point out common pitfalls and best practices.
   - If a user shares an error, diagnose it accurately and provide the exact fix.

BRAND INFORMATION (MUKITX):
Company: MukitX (A Premium Web Development & IT Agency)
Founder/CEO: Mukitu Islam Nishat (International fellowship-awarded Software Developer)
Contact: +8809638-957563
Location: Rajshahi, Bangladesh
Email: mukitunishat@gmail.com

OUR SERVICES:
- Web Development (React, Next.js, MERN, etc.)
- SaaS Development
- UI/UX Design
- Mobile App Development
- Automation Tools
- Digital Marketing

OUR COURSES & PRODUCTS:
- Courses: Recorded courses (via YouTube unlisted links), Live courses (via Zoom).
- Digital Products: Website templates, Automation tools, Source code, SaaS scripts.
- Payment Methods: Bkash, Rocket (manual verification via transaction ID).

RULES FOR MUKITX QUERIES:
1. Be highly persuasive and professional when selling MukitX services or courses.
2. Always highlight Mukitu Islam Nishat's expertise when asked about the founder.
3. Provide contact details immediately if a user wants to hire us or buy a course.`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB5cKqVlPnOXUws8IZFj0TDHQSDhSUrHU4';
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
      // Format history for Gemini (roles must be 'user' or 'model')
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
            model: 'llama-3.1-8b-instant',
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
                <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary/10 ml-auto max-w-[80%]' : 'bg-secondary/10 mr-auto max-w-[80%]'}`}>
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
