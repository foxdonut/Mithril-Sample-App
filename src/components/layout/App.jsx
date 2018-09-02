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
const auth = new Auth();

import { createNavigator } from "../../services/navigator"

const createWelcomeView = (navigator, update) => {
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

const createConferenceView = (navigator, update) => {
  return {
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

const createCFPView = (navigator, update) => {
  return {
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

const createFormView = (navigator, update) => {
  const EntryForm = createEntryForm(navigator, update);
  return {
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => auth.logout()} title="Add Conference" />,
	    <CardContainer>
		    <EntryForm model={model} />
	    </CardContainer>
    ]
  };
};

const createApp = update => {
  const navigator = createNavigator(update);

  navigator.register([
    { key: "WelcomeView", component: createWelcomeView(navigator, update),
      route: "/auth" },

    { key: "ConferenceView", component: createConferenceView(navigator, update),
      route: "/conferences" },

    { key: "CFPView", component: createCFPView(navigator, update),
      route: "/cfp" },

    { key: "FormView", component: createFormView(navigator, update),
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

  /*
	oncreate: (vnode) => {
		const mainStage = vnode.dom.querySelector(".main-stage");

		auth.handleAuthentication();

		m.route(mainStage, "/auth", {
			"/auth": {
				view: () => WelcomeView()
			},
			"/conferences": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => ConferenceView(CONFERENCES)}) :
						m.route.set("/auth")

			},
			"/cfp": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => CFPView(CONFERENCES)}) :
						m.route.set("/auth")
			},
			"/entry": {
				onmatch: () =>
					auth.isAuthenticated() ?
						({view: () => FormView()}) :
						m.route.set("/auth")
			}
		});
	},
	view: () =>
		<div class="App">
		  <div class="main-stage"></div>
			<NavBar />
		</div>
   */
};

export default createApp;
