"use client";

import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DocsFeedback() {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(
    null,
  );

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    // Analytics can be sent here
    console.log(`[v0] User feedback: ${type}`);
  };

  if (feedback) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
        <Check className="h-4 w-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Thanks for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/50 px-4 py-3">
      <p className="text-sm text-muted-foreground">Was this page helpful?</p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback("positive")}
          className="h-8 gap-2 hover:bg-background"
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback("negative")}
          className="h-8 gap-2 hover:bg-background"
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </Button>
      </div>
    </div>
  );
}
