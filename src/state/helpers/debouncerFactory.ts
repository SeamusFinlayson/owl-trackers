export const debouncerFactory = (timeoutInterval: number) => {
  const debouncer: {
    timeoutInterval: number;
    lastUpdateTime: number;
    timeoutId: ReturnType<typeof setTimeout> | undefined;
    debounce: (update: () => void) => void;
  } = {
    timeoutInterval,
    lastUpdateTime: 0,
    timeoutId: undefined,
    debounce: (update) => {
      clearTimeout(debouncer.timeoutId);
      const currentTime = Date.now();
      if (currentTime - debouncer.lastUpdateTime > debouncer.timeoutInterval) {
        update();
      } else {
        debouncer.timeoutId = setTimeout(update, debouncer.timeoutInterval);
      }
      debouncer.lastUpdateTime = currentTime;
    },
  };

  return debouncer;
};
