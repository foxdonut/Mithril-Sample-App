// App.jsx

const m = require('mithril');

import NavBar from './NavBar.jsx';

// Components
import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import ConferenceCard from '../../components/cards/ConferenceCard.jsx';
import CFPCard from '../../components/cards/CFPCard.jsx';
import createEntryForm from '../../components/EntryForm.jsx';

// Mock data
import { CONFERENCES } from '../../store/data';

import { createNavigator } from "../../services/navigator"

const createConferenceView = (navigator, update) => {
  return {
    view: ({attrs:{model}}) => [
	    <StageBanner action={() => console.log(`Logging out!`)} title="Conferences" />,
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
	    <StageBanner action={() => console.log(`Logging out!`)} title="Call for Papers" />,
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
	    <StageBanner action={() => console.log(`Logging out!`)} title="Add Conference" />,
	    <CardContainer>
		    <EntryForm model={model} />
	    </CardContainer>
    ]
  };
};

const createApp = update => {
  const navigator = createNavigator(update);
  navigator.register([
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
};

export default createApp;
