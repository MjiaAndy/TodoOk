'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import {ChatMessageProps} from '@/types'

export function ChatMessage({ sender, children }: ChatMessageProps) {
  const isBot = sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-3 max-w-[80%]',
        isBot ? 'self-start' : 'self-end flex-row-reverse'
      )}
    >
      <div className={cn(
        'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
        isBot ? 'bg-primary' : 'bg-accent'
      )}>
        {isBot ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
      </div>
      <div className={cn(
        'p-3 rounded-xl',
        isBot ? 'bg-background-alt rounded-tl-none' : 'bg-primary/20 rounded-tr-none'
      )}>
        {children}
      </div>
    </motion.div>
  );
}