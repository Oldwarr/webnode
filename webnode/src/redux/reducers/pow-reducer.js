import { IOTA_POW, IOTA_POW_SUCCESS } from "../actions/pow-actions";

import nodeActions from "../actions/node-actions";
import consentActions from "../actions/consent-actions";

const initState = {
  powResults: [],
  statuses: ["Initializing"]
};

export default (state = initState, action) => {
  switch (action.type) {
    case nodeActions.NODE_REQUEST_BROKER_NODES:
      return {
        ...state,
        statuses: [...state.statuses, "Doing proof of work"]
      };
    case nodeActions.NODE_ADD_BROKER_NODE:
      return {
        ...state,
        statuses: [...state.statuses, "Complete"]
      };

    default:
      return state;
  }
};
