import { Link } from '../model/MyLinks-interface';
import { isNotEmptyString } from './StringUtil';

const DEFAULT_FAVICON_WIDTH = 16;
const DEFAULT_FAVICON_HEIGHT = 16;

export function faviconUrlByLink(
  link: Link,
  faviconUrlBuilder: string | undefined
): string | undefined {
  const faviconUrl = link.favicon;

  if (faviconUrl === undefined) {
    return buildFaviconUrl(link.urls[0], faviconUrlBuilder);
  }
  if (faviconUrl.length === 0) {
    return undefined;
  }
  // url contains protocol
  if (/^.*:\/\//.test(faviconUrl)) {
    return faviconUrl;
  }
  return faviconUrlBuilder?.replace('$1', faviconUrl);
}

export function buildFaviconUrl(
  url: string,
  faviconUrlBuilder: string | undefined
): string | undefined {
  if (isNotEmptyString(faviconUrlBuilder)) {
    try {
      const host = new URL(url).host;
      if (host) {
        return faviconUrlBuilder.replace('$1', host);
      }
    } catch {
      // eslint-disable-next-line no-empty
    }
  }
  return undefined;
}

// protect against concurrent 'load' listeners, only the last call can change the color
let cancelFaviconLoading: (() => void) | undefined;

export function applyColorToFavicon(
  color: string | undefined,
  options?: Readonly<{ favicon?: HTMLLinkElement; width?: number; height?: number }>
): void {
  if (color === undefined) {
    return;
  }
  const favicon: HTMLLinkElement | null = options?.favicon ?? document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    return;
  }
  if (cancelFaviconLoading) {
    cancelFaviconLoading();
  }
  const image = new Image();

  const onLoad = (): void => {
    const width = options?.width ?? DEFAULT_FAVICON_WIDTH;
    const height = options?.height ?? DEFAULT_FAVICON_HEIGHT;
    const favImage = createImage(image, width, height, color);
    if (isNotEmptyString(favImage)) {
      favicon.type = 'image/x-icon';
      favicon.href = favImage;
    }
  };

  cancelFaviconLoading = (): void => image.removeEventListener('load', onLoad);

  image.addEventListener('load', onLoad);
  image.src = favicon.href;
}

export function createImage(
  image: HTMLOrSVGImageElement,
  width: number,
  height: number,
  color: string
): string | undefined {
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
  return undefined;
}
