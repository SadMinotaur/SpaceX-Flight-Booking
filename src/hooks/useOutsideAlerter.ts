import React from "react";

export default function useOutsideAlerter(
  ref: React.RefObject<HTMLElement>,
  callBack?: () => void
): void {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) callBack?.();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callBack, ref]);
}
