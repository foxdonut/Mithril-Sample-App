// EntryForm.jsx

import m from 'mithril';
import O from "patchinko/constant"
import UIButton from './ui/UIButton.jsx';

const createEntryForm = (navigator, update) => {
  const setText = field => evt => update({ entryForm: O({[field]: evt.target.value}) });
  const setCFP = value => evt => update({ entryForm: O({CFP: value}) });
  const entryFormHandler = newEntry => {
    newEntry["favorite"] = false;
    newEntry["CFPCompleted"] = newEntry.CFP ? false : "null";

    update({ conferences: O(conferences => conferences.concat([ newEntry ])), entryForm: {} });
    navigator.navigateTo("ConferenceView");
  };

  return {
    view: ({ attrs: { model } }) =>
      <form name="entry-form" id="entry-form">
        <label for="conf-name">Conference Name</label>
        <input id="conf-name" type="text" value={model.entryForm.name} oninput={setText("name")} />
        <label for="location">Location</label>
        <input id="location" type="text" value={model.entryForm.location} oninput={setText("location")} />
        <label for="date">Date</label>
        <input id="date" type="text" value={model.entryForm.date} oninput={setText("date")} />
        <label class="form-question">
          {`Submitting paper?`}
          <label for="yes-cfp">Yes</label>
          <input id="yes-cfp" value={true} type="radio" name="CFP"
            checked={model.entryForm.CFP} onclick={setCFP(true)} />
          <label for="no-cfp">No</label>
          <input id="no-cfp" value={false} type="radio" name="CFP"
            checked={!model.entryForm.CFP} onclick={setCFP(false)} />
        </label>
        {
          model.entryForm.CFP ?
            [
              <label for="cfp">Call for Papers Deadline</label>,
              <input id="cfp" type="text" value={model.entryForm.CFPDate} oninput={setText("CFPDate")} />
            ] :
            null
        }
        <UIButton action={() => entryFormHandler(model.entryForm)} buttonName="SAVE" />
      </form>
  };
};

export default createEntryForm;

