/// <reference types="vite/client" />

interface Window {
  requestIdleCallback: ((callback: IdleRequestCallback, options?: IdleRequestOptions) => number) | undefined;
  cancelIdleCallback: ((handle: number) => void) | undefined;
}
