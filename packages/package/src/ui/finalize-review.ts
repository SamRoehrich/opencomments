import { getActiveReview, setActiveReview } from "./review-dialog";
import { removeCreateCommentFormListener } from "../lib/globals";

export const finalizeReview = () => {
  const activeReview = getActiveReview();
  
  if (!activeReview) {
    console.warn("No active review to finalize");
    return;
  }

  // Disable comment mode if it's active (reset cursor)
  removeCreateCommentFormListener();

  // Clear active review from localStorage
  setActiveReview(null);

  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent("review-finalized", { detail: activeReview }));

  // Optionally show a confirmation message
  console.log(`Review "${activeReview.name}" has been finalized`);
};

