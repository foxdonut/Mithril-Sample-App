// CFPCard.jsx

import m from "mithril";
import O from "patchinko/constant";

import ConferenceField from './ConferenceField.jsx';
import CountDownField from "./CountDownField.jsx";

const createCFPCard = update => {
  const toggleFavorite = idx => evt => update({
    conferences: O({ [idx]: O({ favorite: O(x => !x) }) })
  });
  return {
    view: ({ attrs: { conference, idx } }) => {
      const fav = <span onclick={toggleFavorite(idx)}>
        <i class={(conference.favorite ? 'icon-star' : 'icon-plus')} />
      </span>

      return <div class="conference-card">
        <div class="conference-fields">
          <ConferenceField fieldValue={`${conference.name} @ ${conference.location}`} />
          <ConferenceField fieldValue={fav} />
        </div>
        <div class="conference-fields">
          <ConferenceField fieldValue={conference.CFPDate} />
          <CountDownField fieldValue={conference.CFPDate} />
        </div>
      </div>
    }
  };
};

export default createCFPCard;
