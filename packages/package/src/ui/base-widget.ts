import { createCommentIcon } from "./comment-icon";

export const createBaseWidget = () => {
  const reviewButton = document.createElement("button");
  reviewButton.className =
    "opencomments-widget-button opencomments-widget-button--comment";

  const reviewIcon = createCommentIcon();
  reviewIcon.setAttribute("class", "opencomments-widget-icon");
  reviewButton.appendChild(reviewIcon);

  document.body.appendChild(reviewButton);
};
