"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  show: boolean;
  toastId: string; // pass candidate id here
};

export default function CandidateLinksToast({ show, toastId }: Props) {
  useEffect(() => {
    if (!show) return;

    toast("Історія даного кандидата містить посилання", {
      id: `candidate-links-${toastId}`, // prevents duplicates
    });
  }, [show, toastId]);

  return null;
}