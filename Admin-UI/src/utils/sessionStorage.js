const getLocalStorage = (key) => localStorage.getItem(key);

const setLocalStorage = (key, value) => {
  const parsedValue = typeof value === 'object' ? JSON.stringify(value) : value;
  localStorage.setItem(key, parsedValue);
};

const removeLocalStorage = (key) => localStorage.removeItem(key);

export { getLocalStorage, setLocalStorage, removeLocalStorage };
