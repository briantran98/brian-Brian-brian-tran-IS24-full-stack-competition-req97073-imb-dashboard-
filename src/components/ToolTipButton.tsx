import { MouseEvent, useState, useRef } from "react";
import useClickAwayListener from "@/hooks/useClickAwayListener";
import toolTipButtonStyle from "@/styles/ToolTipButton.module.css";
import homeStyle from "@/styles/Home.module.css";

export default function ToolTipButton(props: {children?: any, onEditHanlder : (event : MouseEvent<HTMLButtonElement>) => void}) {
  const [isHidden, setIsHidden] = useState(true);
  const wrapperRef = useRef(null);
  useClickAwayListener(wrapperRef, setIsHidden, true);

  const handleButtonPress = (e : MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsHidden(prev => !prev);
  };

  return(
    <div>
      <button id={toolTipButtonStyle["tool-tip-menu"]} className={toolTipButtonStyle["tool-button"]} onClick={handleButtonPress}>{props.children}</button>
      <div ref={isHidden ? null : wrapperRef} className={`${toolTipButtonStyle["tool-tip-window"]} ${isHidden ? homeStyle["hidden"] : ""}`}>
        <button className={`${toolTipButtonStyle["tool-button"]} ${toolTipButtonStyle["edit"]}`} onClick={props.onEditHanlder}>Edit</button>
        <button className={`${toolTipButtonStyle["tool-button"]} ${toolTipButtonStyle["delete"]}`}>Delete</button>
      </div>
    </div>
  );
}