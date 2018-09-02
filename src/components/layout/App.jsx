// App.jsx

import m from 'mithril';
import O from 'patchinko/constant'

import NavBar from './NavBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import createConferenceCard from '../../components/cards/ConferenceCard.jsx';
import createCFPCard from '../../components/cards/CFPCard.jsx';
import createEntryForm from '../../components/EntryForm.jsx';
import UIButton from '../../components/ui/UIButton.jsx';

// Mock data
import { CONFERENCES } from '../../store/data';

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

const requiresAuth = auth => ({
  navigating: (params, navigate) => {
    if (!auth.isAuthenticated()) {
      navigator.navigateTo("WelcomeView");
    }
    else {
      navigate();
    }
  }
});

const createConferenceView = (navigator, update, auth) => {
  const ConferenceCard = createConferenceCard(update);
  return O({
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Conferences" />,
	    <CardContainer>
		    {
			    model.conferences
				    .map((conference, idx) => <ConferenceCard conference={conference} idx={idx} />)
		    }
	    </CardContainer>
    ]
  }, requiresAuth(auth));
};

const createCFPView = (navigator, update, auth) => {
  const CFPCard = createCFPCard(update);
  return O({
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Call for Papers" />,
	    <CardContainer>
		    {
			    model.conferences
            .map((conference, idx) => conference.CFP && <CFPCard cfp={true} conference={conference} idx={idx} />)
            .filter(x => x)
		    }
	    </CardContainer>
    ]
  }, requiresAuth(auth));
};

const createFormView = (navigator, update, auth) => {
  const EntryForm = createEntryForm(navigator, update);
  return O({
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Add Conference" />,
	    <CardContainer>
		    <EntryForm model={model} />
	    </CardContainer>
    ]
  }, requiresAuth(auth));
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
