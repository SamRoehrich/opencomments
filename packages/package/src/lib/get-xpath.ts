export function getXPath(element: EventTarget | null): string | null {
  if (!element || !(element instanceof Element)) {
    return null;
  }
  
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const paths = [];
  let currentElement: Element | null = element;
  for (; currentElement && currentElement.nodeType === 1; currentElement = currentElement.parentElement) {
    let index = 0;
    for (
      let sibling = currentElement.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling instanceof Element &&
        sibling.tagName === currentElement.tagName
      ) {
        index++;
      }
    }
    const tagName = currentElement.tagName.toLowerCase();
    const pathIndex = index ? `[${index + 1}]` : "";
    paths.unshift(`${tagName}${pathIndex}`);
  }

  return paths.length ? `/${paths.join("/")}` : null;
}
