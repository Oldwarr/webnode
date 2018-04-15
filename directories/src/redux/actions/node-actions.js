export const NODE_DETERMINE_REQUEST = "directories/node/determine_request";
export const NODE_REQUEST_BROKER_NODES =
  "directories/node/request_broker_nodes";
export const NODE_REQUEST_GENESIS_HASHES =
  "directories/node/request_genesis_hashes";

export const NODE_ADD_BROKER_NODE = "directories/node/add_broker_node";
export const NODE_ADD_GENESIS_HASH = "directories/node/add_genesis_hash";
export const NODE_RESET = "directories/node/reset";

const ACTIONS = Object.freeze({
  // actions
  NODE_DETERMINE_REQUEST,
  NODE_REQUEST_BROKER_NODES,
  NODE_ADD_BROKER_NODE,
  NODE_REQUEST_GENESIS_HASHES,
  NODE_ADD_GENESIS_HASH,
  NODE_RESET,

  // actionCreators
  determineRequest: () => ({
    type: NODE_DETERMINE_REQUEST
  }),

  requestBrokerNodes: () => ({
    type: NODE_REQUEST_BROKER_NODES
  }),

  addBrokerNode: address => ({
    type: NODE_ADD_BROKER_NODE,
    payload: address
  }),

  requestGenesisHashes: () => ({
    type: NODE_REQUEST_GENESIS_HASHES
  }),

  addGenesisHash: genesisHash => ({
    type: NODE_ADD_GENESIS_HASH,
    payload: genesisHash
  }),

  resetNode: ({ id, lastResetAt }) => ({
    type: NODE_RESET,
    payload: { id, lastResetAt }
  })
});

export default ACTIONS;
