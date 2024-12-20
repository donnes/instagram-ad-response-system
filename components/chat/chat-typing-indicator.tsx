import { MessageSquareMore } from 'lucide-react';

interface Props {
  isTyping: boolean;
  userName: string;
}

export function ChatTypingIndicator({ isTyping, userName }: Props) {
  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-x-1 absolute -top-6 left-3">
      <MessageSquareMore className="size-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {userName} is typing...
      </span>
    </div>
  );
}
