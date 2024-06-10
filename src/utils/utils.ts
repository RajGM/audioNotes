import { toast } from '@/components/ui/use-toast';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const errorToast = (description: string, title?: string) =>
  toast({ title, description, variant: 'destructive' });

// Function: cn (Class Name)
// This utility function combines and deduplicates class names using clsx and twMerge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatTime is a utility function that takes a recording time in seconds and returns a formatted time string.
export const formatTime = (recordingTime: number): string => {
  // Convert recordingTime to minutes and seconds
  const minutes = Math.floor(recordingTime / 60);
  const seconds = recordingTime % 60;

  // Pad the minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
};
