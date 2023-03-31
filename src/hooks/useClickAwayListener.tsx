import { useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";

/**
 * Click away or scroll away use hook that can be added to an element to hide it in the case a user unfocuses or clicks else where
 * @param ref type MutableRefObject<any>. Ref to the element that will be listened to
 * @param setIsHidden type Dispatch<SetStateAction<boolean>>. Callback that will be used to change the state of the ref
 * @param scrollListen type boolean. Optional scroll listner that will also hide the element
 */
export default function useClickAwayListener(
  ref: MutableRefObject<any>,
  setIsHidden: Dispatch<SetStateAction<boolean>>,
  scrollListen?: boolean
): void {
  useEffect(() => {
    function handleClickOutside(event: any) {
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
