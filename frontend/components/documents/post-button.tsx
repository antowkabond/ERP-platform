"use client";

import { Button } from "@/components/ui/button";
import { DocumentState } from "@/lib/types/common.types";

interface PostButtonProps {
  state: DocumentState | string;
  onPost: () => void;
  onUnpost: () => void;
  isLoading?: boolean;
}

export function PostButton({ state, onPost, onUnpost, isLoading }: PostButtonProps) {
  const isPosted = state === DocumentState.POSTED || state === 'POSTED';

  if (isPosted) {
    return (
      <Button 
        onClick={onUnpost} 
        variant="outline" 
        disabled={isLoading}
      >
        {isLoading ? 'Unposting...' : 'Unpost Document'}
      </Button>
    );
  }

  return (
    <Button 
      onClick={onPost} 
      disabled={isLoading}
    >
      {isLoading ? 'Posting...' : 'Post Document'}
    </Button>
  );
}
