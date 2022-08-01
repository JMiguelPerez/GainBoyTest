import React from "react";

function Popup(props)
{

   return ( props.trigger) ? (
    <div className="popUp">
        <div className="popUpInner">
            { props.children }
        </div>
    </div>
   ) : "";
}

export default Popup;