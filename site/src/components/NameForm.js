import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import "./NameForm.css"

function NameForm() {

  const [result, setResult] = useState(null)
  const config = useSelector(state => state.config);

  const profaneHighResponses = ["What a potty mouth!", "I hope there are no kids watching!", "My goodness, who talks like that?!"]
  const profaneLowResponses = ["I'm fairly certain that's sailor talk.", "My sensors indicate that's slightly offensive.", "That's pretty bad, but I've heard worse!"]
  const cleanHighResponses = ["My sensors indicate that name is perfectly acceptable!", "Wow, that's a good name!"]
  const cleanLowResponses = ["That name is a little questionable, but I'll allow it.", "Your name is almost offensive, but I'll let it pass."]

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log("submit");
    
    const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData( e.currentTarget );

    // Define what happens on successful data submission
    XHR.addEventListener( "load", function(event) {
      var response = JSON.parse(event.target.responseText);
      
      if(response.error){
        alert(response.error);
        return;
      }

      setResult(response)
      console.log(response);
  
    } );

    // Define what happens in case of error
    XHR.addEventListener( "error", function( event ) {
      alert( 'Oops! Something went wrong.' );
    } );

    // Set up our request
    XHR.open( "POST", config.serverEndpoint + "/api/predict" );

    // The data sent is what the user provided in the form
    XHR.send( FD );
  }

  const handleIncorrect = () =>{

    fetch( config.serverEndpoint + "/api/add", {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    });
    
    setResult(null);
  }

  const handleCorrect = () =>{
     setResult(null);
  }

  const getProfaneResponse = (probability) =>{
    var index;
    console.log("Confidence:"+probability)
    if(probability > 0.7){
      index = Math.floor(Math.random() * profaneHighResponses.length);  
      return profaneHighResponses[index];
    }else{
      index = Math.floor(Math.random() * profaneLowResponses.length);  
      return profaneLowResponses[index];
    }
   
  }

  const getCleanResponse = (probability) =>{
    var index;
    console.log("Confidence:"+probability)
    if(probability > 0.7){
      index = Math.floor(Math.random() * cleanHighResponses.length);  
      return cleanHighResponses[index];
    }else{
      index = Math.floor(Math.random() * cleanLowResponses.length);  
      return cleanLowResponses[index];
    }
}

  return (
    
      <div className="nameForm">

        {result ? 
          <div>
              {result.isProfane ? 
                  <div>
                    <h3>Profane!</h3>
                    <h5>{getProfaneResponse(result.confidence)}</h5>
                    <button onClick={handleIncorrect}>That shouldn't be profane</button>
                    <button onClick={handleCorrect}>Try again</button>
                  </div>
                :
                  <div>
                    <h3>Not profane!</h3>
                    <h5>{getCleanResponse(result.confidence)}</h5>
                    <button onClick={handleIncorrect}>That should be profane</button>
                    <button onClick={handleCorrect}>Try again</button>
                  </div>
              }
          </div>
        :
          <div>
            <div className="instruction">Enter a name below — I dare you!</div>
          <form onSubmit={handleSubmit} method="post"> 
            <input name="firstname" type="text" placeholder="First Name" required/>
            <input name="lastname" type="text" placeholder="Last Name (optional)"/>            
            <div>
              <button type="submit">Submit</button>
            </div>   
          </form>
         </div>
      }
      </div>

  );
}

export default NameForm;
