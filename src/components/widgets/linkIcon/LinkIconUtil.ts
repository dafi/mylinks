import { CSSProperties } from 'react';
import { Link as MLLink } from '../../../model/MyLinks-interface';

const colors = [
  '#FF5666', '#A9714B', '#531CB3', '#28C2FF', '#3066BE', '#963484',
  '#729B79', '#44CF6C', '#3498DB', '#AAAAAA', '#0074D9', '#3D9970',
  '#2ECC40', '#B10DC9', '#0000FF', '#00FFFF', '#008080', '#00FF00',
  '#FF851B', '#FFA500', '#FF0000', '#F012BE', '#FF00FF',
];

function hash(str: string): number {
  // the worst way to compute a hash value, but we only need that it is deterministic
  return Array
    .from(str)
    .reduce((p, c) => p + c.charCodeAt(0), str.length);
}

export function getStyleForMissingFavicon({ label }: MLLink): { label: string; style: CSSProperties } {
  return {
    label: label.charAt(0),
    style: {
      color: '#fff',
      backgroundColor: colors[hash(label) % colors.length]
    },
  };
}

