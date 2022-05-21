import React from "react";

export default function useWindowSize(): Size {
  const [windowSize, setWindowSize] = React.useState<Size>({
    width: undefined,
    height: undefined
  });

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

type UnitsType = number | undefined;
interface Size {
  width: UnitsType;
  height: UnitsType;
}
