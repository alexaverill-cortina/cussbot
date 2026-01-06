import { useState } from "react";
import { useSelector } from "react-redux";
import "./Footer.css"

function Footer() {

  const config = useSelector(state => state.config);
  const [version,setVersion] = useState("");

  FetchModel();

  
function FetchModel() {
    console.log(config)
    fetch(config.serverEndpoint).then(response => response.text())
    .then(model => { 
        setVersion(model);
    })
  }
  

  return (
     <footer>
         <div className="modelVersion">{version}</div>
     </footer>
  );
}

export default Footer;
