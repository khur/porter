export function copy(obj) {
  if (obj === null)             return obj; 
  if (obj === undefined)        return obj;
  if (typeof obj !== 'object')  return obj;
  let newObj;
  if (typeof obj.__proto__.constructor === "function" && obj.__proto__.constructor.call) {
    newObj = new obj.__proto__.constructor();
  } else {
    newObj = new obj.constructor();
  }

  for (var key in obj) {
    newObj[key] = copy(obj[key]);
  }
  return newObj;
}
