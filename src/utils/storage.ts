export function createStorage<T>(key: string, fallback: T) {
  return {
    load: (): T => {
      const rawData = localStorage.getItem(key);
      if (!rawData) return fallback;
      try {
        return JSON.parse(rawData);
      } catch {
        return fallback;
      }
    },
    save: (value: T): void => localStorage.setItem(key, JSON.stringify(value)),
  };
}
