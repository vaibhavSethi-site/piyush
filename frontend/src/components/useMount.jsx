import { useEffect } from 'react';

const useMountEffect = (effect) => {
  useEffect(() => {
    effect();
  }, []); // Empty dependency array ensures the effect runs only once on mount
};

export default useMountEffect;
