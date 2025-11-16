import { createButton, createCommentIcon } from "./elements";

export const createBaseWidget = () => {
  const reviewIcon = createCommentIcon({ className: "opencomments-widget-icon" });
  
  const reviewButton = createButton({
    className: ["opencomments-widget-button", "opencomments-widget-button--comment"],
    children: [reviewIcon],
  });

  document.body.appendChild(reviewButton);
};
