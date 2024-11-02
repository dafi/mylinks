import { expect, test } from 'vitest';
import { setPropertyFromDotNotation } from '../src/common/DotNotation';

type TestType = {
  background?: {
    image?: string | URL;
    color?: string;
  };
  address?: {
    city: {
      name: string;
      code: string;
    };
  };
};

test('check not existing property', () => {
  const obj: TestType = {};

  setPropertyFromDotNotation('background.image', 'https://localhost', obj);

  expect(obj.background?.image).toEqual('https://localhost');
});

test('check not existing deep property', () => {
  const obj: TestType = {};

  setPropertyFromDotNotation('address.city.code', '00100', obj);

  expect(obj.address?.city.code).toEqual('00100');
});

test('check with empty dot notation', () => {
  const obj: TestType = {};

  setPropertyFromDotNotation('', '00100', obj);

  expect(Object.keys(obj).length).equals(0);
});

test('check property name present but value is undefined', () => {
  const obj: TestType = {
    background: undefined
  };

  setPropertyFromDotNotation('background.color', '#ff0000', obj);

  expect(obj.background?.color).toEqual('#ff0000');
});
