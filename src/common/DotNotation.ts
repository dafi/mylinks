type ValueObject = Record<string, {} | string | number | undefined>;

export function setPropertyFromDotNotation<T extends {} | string | number, O extends ValueObject>(
  dotNotation: string,
  value: T,
  obj: O
): O {
  // trim leading and trailing spaces and dots
  const properties = dotNotation.replaceAll(/^[ .]+|[ .]+$/g, '').split(/\.+/);
  const [propertyName] = properties.splice(-1);

  if (!propertyName) {
    return obj;
  }

  let current: ValueObject = obj;

  for (const objectName of properties) {
    if (current[objectName] === undefined) {
      current[objectName] = {};
    }
    current = current[objectName] as {};
  }
  current[propertyName] = value;

  return obj;
}
