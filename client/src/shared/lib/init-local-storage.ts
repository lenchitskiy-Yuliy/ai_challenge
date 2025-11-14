export function initLocalStorage<Value extends boolean | string | number | object>({
  key,
}: {
  key: string;
}) {
  return {
    get() {
      try {
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as Value) : null;
      } catch {
        return null;
      }
    },
    set(value: Value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        //
      }
    },
    clear() {
      try {
        localStorage.removeItem(key);
      } catch {
        //
      }
    },
  };
}
