import { combineReducers } from 'redux';
import configReducer from './configReducer';
import googleAnalyticsReducer from './googleAnalyticsReducer';


const appReducer = combineReducers({
  googleAnalytics: googleAnalyticsReducer,
  config:configReducer
});

export default appReducer;
