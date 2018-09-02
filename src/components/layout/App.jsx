// App.jsx

const m = require('mithril');

import NavBar from './NavBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';
import CFPCard from '../../components/cards/CFPCard.jsx';
import createEntryForm from '../../components/EntryForm.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

// Mock data
import {getMockData} from '../../store/data';
const CONFERENCES = getMockData();

// Services
import Auth from '../../services/auth.js';

import { createNavigator } from "../../services/navigator"

const createWelcomeView = (navigator, update, auth) => {
  return {
    view: () => [
	    <h1 class="app-title">Conference Tracker</h1>,
	    <h2 class="app-greeting">Welcome</h2>,
	    <span class="app-description">Track conferences and CFP dates.</span>,
	    <div class="login-button">
		    <UIButton action={() => auth.login()} buttonName="LOGIN" />
	    </div>
    ]
  };
};

const createConferenceView = (navigator, update, auth) => {
  return {
    navigating: (params, navigate) => {
      if (!auth.isAuthenticated()) {
        navigator.navigateTo("WelcomeView");
      }
      else {
        navigate();
      }
    },
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Conferences" />,
	    <CardContainer>
		    {
			    model.conferences
				    .map(conference => <ConferenceCard conference={conference} />)
		    }
	    </CardContainer>
    ]
  };
};

const createCFPView = (navigator, update, auth) => {
  return {
    navigating: (params, navigate) => {
      if (!auth.isAuthenticated()) {
        navigator.navigateTo("WelcomeView");
      }
      else {
        navigate();
      }
    },
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Call for Papers" />,
	    <CardContainer>
		    {
			    model.conferences
				    .filter(conference => conference.CFP)
				    .map(conferenceWithCFP => <CFPCard cfp={true} conference={conferenceWithCFP} />)
		    }
	    </CardContainer>
    ]
  };
};

const createFormView = (navigator, update, auth) => {
  const EntryForm = createEntryForm(navigator, update);
  return {
    navigating: (params, navigate) => {
      if (!auth.isAuthenticated()) {
        navigator.navigateTo("WelcomeView");
      }
      else {
        navigate();
      }
    },
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Add Conference" />,
	    <CardContainer>
		    <EntryForm model={model} />
	    </CardContainer>
    ]
  };
};

const createApp = update => {
  const auth = new Auth();
  auth.handleAuthentication();

  const navigator = createNavigator(update);
  navigator.register([
    { key: "WelcomeView", component: createWelcomeView(navigator, update, auth),
      route: "/auth" },

    { key: "ConferenceView", component: createConferenceView(navigator, update, auth),
      route: "/conferences" },

    { key: "CFPView", component: createCFPView(navigator, update, auth),
      route: "/cfp" },

    { key: "FormView", component: createFormView(navigator, update, auth),
      route: "/entry" }
  ]);

  return {
    model: () => ({
      conferences: CONFERENCES,
      entryForm: {
      }
    }),
    navigator,
    view: ({attrs:{model}}) => {
      const Component = navigator.getComponent(model.pageId);
      return (
        <div class="App">
          <div class="main-stage">
            <Component model={model} />
          </div>
          <NavBar />
        </div>
      );
    }
  };
};

export default createApp;
