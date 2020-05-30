/* eslint @typescript-eslint/no-unused-vars: "off" */

import { useRef, useEffect } from 'react';

const useEvent = (event, values) => {
  const self = useRef({
    values: values,
    handler: (...args) => {
      return event(...args, self.current.values);
    }
  });

  self.current.values = values;

  return self.current.handler;
};

const useSelf = (values) => {
  const self = useRef(values);

  useEffect(() => {
    self.current = values;
  }, [values]);

  return self.current;
};

export {
  useEvent,
  useSelf,
};

const useHOFCallback = (fn, args) => {
  const resultRef = useRef<Function>();
  const argsRef = useRef<any[]>();

  if (argsRef.current) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== argsRef.current[i]) {
        resultRef.current = fn(...args);
        argsRef.current = args;

        break;
      }
    }
  } else {
    resultRef.current = fn(...args);
    argsRef.current = args;
  }

  return resultRef.current;

  // return useMemo(() => fn(...args), args);
};
