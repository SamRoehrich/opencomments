export function getXPath(element: EventTarget) {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const paths = [];
  for (; element && element.nodeType === 1; element = element.parentNode) {
    let index = 0;
    for (
      let sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.tagName === element.tagName
      ) {
        index++;
      }
    }
    const tagName = element.tagName.toLowerCase();
    const pathIndex = index ? `[${index + 1}]` : "";
    paths.unshift(`${tagName}${pathIndex}`);
  }

  return paths.length ? `/${paths.join("/")}` : null;
}
