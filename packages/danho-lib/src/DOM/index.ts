export * from './dquery';
export * from './Events';
export * from './Injections';

export function observeAppMountFor<T>(callback: () => T, timeout?: number, rejectMessage?: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes.length) return;

        const result = callback();
        if (result) {
          observer.disconnect();
          resolve(result);
        }
      });
    });

    observer.observe(document.querySelector('#app-mount'), { childList: true, subtree: true });

    if (timeout) setTimeout(() => reject(rejectMessage ?? 'Timeout'), timeout);
  });
}