
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {Router, Route} from "react-router-dom";
import './App.css';
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import NameForm from './components/NameForm';
import { initGoogleAnalytics } from "./reducers/googleAnalyticsReducer";


const google_analytics_data = {
  trackingID: "UA-162362955-2"
};

function App() {

  const goggleAnalytics = useSelector(state => state.googleAnalytics);
  const config = useSelector(state => state.config);

  const dispatch = useDispatch();

  if(!goggleAnalytics.history)
  dispatch(initGoogleAnalytics(google_analytics_data));

  return (        
      <div className="App">

        { config.loaded ? 
      
          <>
            <header className="App-header">   
              <a className="cortinaLink" rel="noreferrer" href="https://cortinaproductions.com/" target="_blank">Cortina Productions Logo</a>
            </header>
            <section>
              <div className="panel">
                <Router history={goggleAnalytics.history} basename={'/'}>
                  <Route path='/' exact="true"> 
                    <Intro/>
                  </Route>
                  <Route path='/form' exact="true"> 
                    <NameForm/>
                  </Route>
                </Router>
              </div>
            </section>
            <Footer/>
          </>

        :

          <div className="loadingPrompt">
              <div>Loading...</div>
          </div>

        }

      </div>    
  );
}

export default App;
