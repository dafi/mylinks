import { Link } from '../model/MyLinks-interface';

const DEFAULT_FAVICON_WIDTH = 16;
const DEFAULT_FAVICON_HEIGHT = 16;

export function faviconUrlByLink(
  link: Link,
  faviconUrlBuilder: string | null | undefined
): string | null {
  const faviconUrl = link.favicon;

  if (faviconUrl) {
    // url contains protocol
    if (/^.*:\/\//.test(faviconUrl)) {
      return faviconUrl;
    }
    return faviconUrlBuilder?.replace('$1', faviconUrl) || null;
  }
  if (faviconUrl?.length === 0) {
    return null;
  }
  return buildFaviconUrl(link.url, faviconUrlBuilder);
}

export function buildFaviconUrl(
  url: string,
  faviconUrlBuilder: string | null | undefined
): string | null {
  if (faviconUrlBuilder) {
    try {
      const host = new URL(url).host;
      if (host) {
        return faviconUrlBuilder.replace('$1', host);
      }
    } catch {
      // eslint-disable-next-line no-empty
    }
  }
  return null;
}

export function applyColorToFavicon(
  color: string,
  options?: Readonly<{ favicon?: HTMLLinkElement; width?: number; height?: number }>
): void {
  if (!color) {
    return;
  }
  const favicon: HTMLLinkElement | null = options?.favicon || document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    return;
  }
  const image = new Image();
  image.src = favicon.href;
  image.onload = (): void => {
    const width = options?.width ?? DEFAULT_FAVICON_WIDTH;
    const height = options?.height ?? DEFAULT_FAVICON_HEIGHT;
    const favImage = createImage(image, width, height, color);
    if (favImage) {
      favicon.type = 'image/x-icon';
      favicon.href = favImage;
    }
  };
}

export function createImage(
  image: HTMLOrSVGImageElement,
  width: number,
  height: number,
  color: string
): string | null {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    context.fill();
    context.globalCompositeOperation = 'destination-atop';
    context.drawImage(image, 0, 0);
    return canvas.toDataURL();
  }
  return null;
}
