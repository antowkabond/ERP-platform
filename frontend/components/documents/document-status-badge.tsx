import { Badge } from "@/components/ui/badge";
import { DocumentState } from "@/lib/types/common.types";

interface DocumentStatusBadgeProps {
  state: DocumentState | string;
}

export function DocumentStatusBadge({ state }: DocumentStatusBadgeProps) {
  if (state === DocumentState.POSTED || state === 'POSTED') {
    return <Badge variant="success">Posted</Badge>;
  }
  return <Badge variant="secondary">Draft</Badge>;
}
