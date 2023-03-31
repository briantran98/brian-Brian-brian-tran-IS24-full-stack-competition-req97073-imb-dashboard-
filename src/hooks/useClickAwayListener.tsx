import { useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";

export default function useClickAwayListener(ref : MutableRefObject<any>, setIsHidden : Dispatch<SetStateAction<boolean>>, scrollListen? : boolean) {
  
  useEffect(() => {
    /**
         * Alert if clicked on outside of element
         */
    function handleClickOutside(event : any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsHidden((prev: boolean) => !prev);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    if (scrollListen) {
      document.addEventListener("scroll", handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, [ref]);
}