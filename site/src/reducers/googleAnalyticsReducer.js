import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

const INIT_GA = 'INIT_GA';
const SET_GA_TRACKING_ID = 'SET_GA_TRACKING_ID';
const REPORT_EVENT = 'REPORT_EVENT';

const defaultState = {
    trackingID: "",
    history:null
};

export const initGoogleAnalytics = data => {
  return {
    type: INIT_GA,
    payload: data,
  };
};

export const setTrackingID = data => {
  return {
    type: SET_GA_TRACKING_ID,
    payload: data,
  };
};

export const reportEvent = data => {
  return {
    type: REPORT_EVENT,
    payload: data,
  };
};

const googleAnalyticsReducer = (state = defaultState, action) => {
    switch (action.type) {
      case SET_GA_TRACKING_ID:
          state.trackingID = action.payload.trackingID;
          ReactGA.initialize(action.payload.trackingID);
        return { ...state }
      case INIT_GA:

        if (action.payload) {
          console.log("INITIALIZING GA - ", action.payload)
          state.trackingID = action.payload.trackingID;
          ReactGA.initialize(action.payload.trackingID);

          ReactGA.set({
            userId: "visitor",
            // any data that is relevant to the user session
            // that you would like to track with google analytics
          });
        
          state.history = createBrowserHistory({
            basename: process.env.PUBLIC_URL || '/'
          });

          const trackPageView = location => {
            console.log("GA - ", location.pathname);
            ReactGA.set({ page: location.pathname }); // Update the user's current page
            ReactGA.pageview(location.pathname); // Record a pageview for the given page
          };
          
          state.history.listen(trackPageView);
          trackPageView(state.history.location);
        }

        return { ...state }
      
      case REPORT_EVENT:
        console.log("GA - ", action.payload.category, " | ", action.payload.action)
        ReactGA.event({
          category: action.payload.category,
          action: action.payload.action
        });
        return {...state }
      default:
        return state;
    }
  };
  


export default googleAnalyticsReducer;
