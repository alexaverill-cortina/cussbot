import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./Intro.css"

function Intro() {

    let history = useHistory();

    const handleClick = () =>{
        history.push("/form");
    }

  return (
      
     <div className="intro">
         <h1>AHOY!</h1>
         <div>Intro text here.</div>
         <button onClick={handleClick}>I CAN STUMP CUSSBOT!</button>
     </div>
  );
}

export default Intro;
