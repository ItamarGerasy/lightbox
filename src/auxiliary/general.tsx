type AnyObject = Record<string, any>;

function updateObject(key: string, value: any, obj: AnyObject): AnyObject {
  return {
    ...obj,
    [key]: value,
  };
}

export { updateObject }