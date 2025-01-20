import React from 'react';

export const getRenderPropValue = (
  propValue
) => {
  if (!propValue) {
    return null;
  }

  const isRenderFunction = typeof propValue === 'function';
  if (isRenderFunction) {
    return propValue();
  }

  return propValue;
};
