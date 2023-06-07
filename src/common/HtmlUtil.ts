export function highlight(
  text: string,
  indices: ReadonlyArray<[number, number]>
): string {
  let result = '';
  let pos = 0;
  for (const [start, end] of indices) {
    result = result.concat(
      text.substring(pos, start),
      '<mark>',
      text.substring(start, end + 1),
      '</mark>');
    pos = end + 1;
  }
  result += text.substring(pos);

  return result;
}
