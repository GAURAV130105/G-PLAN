import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageSquare, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

const suggestedQuestions = [
  "How do I use the diary?",
  "How do I add a new goal?",
  "How can I track my expenses?",
  "Tell me about the study tracker.",
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([
    { type: 'bot', text: "Hello! I'm G-bot. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const userMessage = { type: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setUserInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the bot.');
      }

      const data = await response.json();
      const botMessage = { type: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { type: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }
        }, 100);
    }
  }, [messages]);


  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
        style={{ backgroundColor: '#38bdf8' }}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[450px] flex flex-col shadow-2xl rounded-2xl border-2 border-sky-200/50 animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between p-4" style={{ backgroundColor: '#38bdf8' }}>
        <CardTitle className="text-white text-lg font-bold">G-bot</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-sky-600/50">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <CardContent className="p-4">
            <div className="space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.type === 'bot' && <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">G</div>}
                    <div className={`max-w-[75%] p-3 rounded-2xl ${msg.type === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">G</div>
                    <div className="max-w-[75%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                        <p className="text-sm">Thinking...</p>
                    </div>
                </div>
            )}
            </div>
        </CardContent>
    </ScrollArea>
    <div className="p-4 border-t bg-gray-50/50 rounded-b-2xl">
        <div className="relative">
            <Input 
                placeholder="Ask a question..."
                className="pr-10"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
            />
            <Button 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-sky-500 hover:bg-sky-600"
                onClick={handleSendMessage}
                disabled={isLoading}
            >
                <Send className="h-4 w-4 text-white" />
            </Button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">
            Need help? Try asking:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-sky-500 hover:underline focus:outline-none"
                onClick={() => setUserInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
