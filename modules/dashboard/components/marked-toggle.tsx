"use client";

import { Button } from "@/components/ui/button";
import { StarIcon, StarOffIcon } from "lucide-react";
import type React from "react";
import { useState, useEffect, forwardRef } from "react";
import { toast } from "sonner";
import { toggleStarMarked } from "../actions";

interface MarkedToggleButtonProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  markedForRevision: boolean;
  id: string;
  onStarChange?: (id: string, starred: boolean) => void;
}

export const MarkedToggleButton = forwardRef<
  HTMLButtonElement,
  MarkedToggleButtonProps
>(
  (
    {
      markedForRevision,
      id,
      onClick,
      className,
      children,
      onStarChange,
      ...props
    },
    ref,
  ) => {
    const [isMarked, setIsMarked] = useState(markedForRevision);

    useEffect(() => {
      setIsMarked(markedForRevision);
    }, [markedForRevision]);

    const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      const newMarkedState = !isMarked;
      setIsMarked(newMarkedState);
      onStarChange?.(id, newMarkedState);

      try {
        const res = await toggleStarMarked(id, newMarkedState);
        const { success, error, isMarked: resMarked } = res;

        if (resMarked && !error && success) {
          toast.success("Added to Favorites successfully");
        } else {
          toast.success("Removed from Favorites successfully");
        }
      } catch (error) {
        console.error("Failed to toggle mark for revision:", error);
        setIsMarked(!newMarkedState);
        onStarChange?.(id, !newMarkedState);
        toast.error("Failed to update favorite");
      }
    };

    return (
      <Button
        ref={ref}
        variant="ghost"
        className={`flex items-center justify-start w-full px-2 py-1.5 text-sm rounded-md cursor-pointer ${className}`}
        onClick={handleToggle}
        {...props}
      >
        {isMarked ? (
          <StarIcon size={16} className="text-yellow-400 mr-2" />
        ) : (
          <StarOffIcon size={16} className="text-gray-500 mr-2" />
        )}
        {children || (isMarked ? "Remove Favorite" : "Add to Favorite")}
      </Button>
    );
  },
);

MarkedToggleButton.displayName = "MarkedToggleButton";
