// JavaScript version of flattenDataAttributes for Cypress
export function flattenDataAttributes(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => flattenDataAttributes(item));
  }

  if (obj.hasOwnProperty('data') && Array.isArray(obj.data)) {
    return flattenDataAttributes(obj.data);
  }

  const newObj = {};
  for (const key in obj) {
    if (key === 'attributes') {
      Object.assign(newObj, flattenDataAttributes(obj[key]));
    } else if (key === 'data') {
      Object.assign(newObj, flattenDataAttributes(obj[key]));
    } else {
      newObj[key] = flattenDataAttributes(obj[key]);
    }
  }

  return newObj;
} 