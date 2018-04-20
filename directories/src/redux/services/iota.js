import IOTA from "iota.lib.js";
import { IOTA_API_PROVIDER, IOTA_ADDRESS_LENGTH } from "../../config";
import curl from "curl.lib.js";
import _ from "lodash";
import moment from "moment";

const iota = new IOTA();

const iotaProvider = new IOTA({
  provider: IOTA_API_PROVIDER
});

curl.init();
const MAX_TIMESTAMP_VALUE = (Math.pow(3, 27) - 1) / 2;

const checkIfClaimed = address =>
  findTransactionObjects([address]).then(transactions => {
    if (!transactions.length) return false;

    const latestTransaction = _.maxBy(transactions, "attachmentTimestamp");
    const attachedAt = latestTransaction.attachmentTimestamp;
    const lastEpoch = moment()
      .subtract(1, "year")
      .valueOf();
    return lastEpoch > attachedAt;
  });

const toAddress = string => string.substr(0, IOTA_ADDRESS_LENGTH);

const findTransactionObjects = addresses =>
  new Promise((resolve, reject) => {
    iotaProvider.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        const uniqTransactions = _.uniqBy(settledTransactions, "address");
        resolve(uniqTransactions);
      }
    );
  });

const prepareTransfers = data => {
  return new Promise((resolve, reject) => {
    iotaProvider.api.prepareTransfers(
      data.seed,
      [
        {
          address: data.address,
          value: data.value,
          message: data.message,
          tag: data.tag
        }
      ],
      (error, arrayOfTrytes) => {
        if (error) {
          console.log("IOTA prepareTransfers error ", error);
          reject(error);
        } else {
          console.log("IOTA prepareTransfers data ", arrayOfTrytes);
          resolve(arrayOfTrytes);
        }
      }
    );
  });
};

export const attachToTangleCurl = data => {
  const trunkTransaction = data.trunkTx;
  const branchTransaction = data.branchTx;
  const minWeightMagnitude = data.mwm;
  const trytes = data.trytes;
  const callback = data.callback;

  const curlHashing = (
    trunkTransaction,
    branchTransaction,
    minWeightMagnitude,
    trytes,
    callback
  ) => {
    if (!iota.valid.isHash(trunkTransaction)) {
      return callback(new Error("Invalid trunkTransaction"));
    }
    if (!iota.valid.isHash(branchTransaction)) {
      return callback(new Error("Invalid branchTransaction"));
    }
    if (!iota.valid.isValue(minWeightMagnitude)) {
      return callback(new Error("Invalid minWeightMagnitude"));
    }
    let finalBundleTrytes = [];
    let previousTxHash;
    let i = 0;

    function loopTrytes() {
      getBundleTrytes(trytes[i], function(error) {
        if (error) {
          return callback(error);
        } else {
          i++;
          if (i < trytes.length) {
            loopTrytes();
          } else {
            return callback(null, finalBundleTrytes.reverse());
          }
        }
      });
    }

    function getBundleTrytes(thisTrytes, callback) {
      let txObject = iota.utils.transactionObject(thisTrytes);

      /*Commenting this out.  We potentially want to be able to search
            using tags, at least until mainnet comes out.*/

      //txObject.tag = txObject.obsoleteTag;

      txObject.attachmentTimestamp = Date.now();
      txObject.attachmentTimestampLowerBound = 0;
      txObject.attachmentTimestampUpperBound = MAX_TIMESTAMP_VALUE;
      if (!previousTxHash) {
        if (txObject.lastIndex !== txObject.currentIndex) {
          return callback(
            new Error(
              "Wrong bundle order. The bundle should be ordered in descending order from currentIndex"
            )
          );
        }
        txObject.trunkTransaction = trunkTransaction;
        txObject.branchTransaction = branchTransaction;
      } else {
        txObject.trunkTransaction = previousTxHash;
        txObject.branchTransaction = trunkTransaction;
      }
      let newTrytes = iota.utils.transactionTrytes(txObject);
      curl
        .pow({ trytes: newTrytes, minWeight: minWeightMagnitude })
        .then(nonce => {
          let returnedTrytes = newTrytes.substr(0, 2673 - 81).concat(nonce);
          let newTxObject = iota.utils.transactionObject(returnedTrytes);
          let txHash = newTxObject.hash;
          previousTxHash = txHash;
          finalBundleTrytes.push(returnedTrytes);
          callback(null);
        })
        .catch(callback);
    }

    loopTrytes();
  };
  return new Promise((resolve, reject) => {
    curlHashing(
      trunkTransaction,
      branchTransaction,
      minWeightMagnitude,
      trytes,
      (error, powResults) => {
        if (error) {
          return reject(error);
        } else {
          resolve(powResults);
        }
      }
    );
  });
};

iota.api.attachToTangle = attachToTangleCurl;

export const attachToTangle = data => {
  return new Promise((resolve, reject) => {
    iota.api
      .attachToTangle(
        data.trunkTransaction,
        data.branchTransaction,
        data.minWeight,
        data.trytes,
        (error, attachToTangle) => {
          if (error) {
            console.log("IOTA attachToTangle error ", error);
          } else {
            console.log("IOTA attachToTangle data ", attachToTangle);
            resolve(attachToTangle);
          }
        }
      )
      .then(nonce => {
        console.log(
          "attachToTangle nonce ",
          data.tryte.substr(0, 2187 - 81).concat(nonce)
        );
      })
      .catch(error => {
        console.log("attachToTangle error ", error);
      });
  });
};

const attachToTangleOnTask = data => {
  return new Promise((resolve, reject) => {
    curl
      .pow({
        trunkTransaction: data.trunkTransaction,
        branchTransaction: data.branchTransaction,
        minWeight: data.minWeight,
        trytes: data.trytes
      })
      .then(nonce => {
        console.log(
          "attachToTangle nonce ",
          data.tryte.substr(0, 2187 - 81).concat(nonce)
        );
      })
      .catch(error => {
        console.log("attachToTangle error ", error);
      });
  });
};

export default {
  prepareTransfers,
  attachToTangleCurl,
  checkIfClaimed,
  utils: iota.utils,
  toAddress: toAddress
};
