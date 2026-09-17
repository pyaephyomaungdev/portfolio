if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      return setTimeout(() => callback(Date.now()), 0) as unknown as number;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id: number): void => {
      clearTimeout(id);
    };
  }
}
