import { MouseEvent, useState, useRef } from "react";
import useClickAwayListener from "@/hooks/useClickAwayListener";
import toolTipButtonStyle from "@/styles/ToolTipButton.module.css";
import homeStyle from "@/styles/Home.module.css";

/**
 * ToolTipButton Component that will hide away actions that can be performed. Currently only edit button available but scalable to add more buttons in the future
 * @param props.children
 * @param props.onEditHandler
 * @returns
 */
export default function ToolTipButton(props: {
  children?: any;
  onEditHandler: (event: MouseEvent<HTMLButtonElement>) => void;
}): JSX.Element {
  // Initializing states and refs
  const [isHidden, setIsHidden] = useState(true);
  const wrapperRef = useRef(null);

  useClickAwayListener(wrapperRef, setIsHidden, true);

  const handleButtonPress = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHidden((prev) => !prev);
  };

  return (
    <div>
      <button
        id={toolTipButtonStyle["tool-tip-menu"]}
        className={toolTipButtonStyle["tool-button"]}
        onClick={handleButtonPress}
      >
        {props.children}
      </button>
      <div
        ref={isHidden ? null : wrapperRef}
        className={`${toolTipButtonStyle["tool-tip-window"]} ${
          isHidden ? homeStyle["hidden"] : ""
        }`}
      >
        <button
          className={`${toolTipButtonStyle["tool-button"]} ${toolTipButtonStyle["edit"]}`}
          onClick={props.onEditHandler}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
