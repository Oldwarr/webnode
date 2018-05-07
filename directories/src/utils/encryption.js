import CryptoJS from "crypto-js";
import uuidv4 from "uuid/v4";

const parseEightCharsOfFilename = fileName => {
  fileName = fileName + "________";
  fileName = fileName.substr(0, 8);

  return fileName;
};

const getSalt = numChars => {
  let array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  let salt = array[0];

  return salt.toString(36).substr(2, numChars);
};

const getPrimordialHash = () => {
  const entropy = uuidv4();
  return CryptoJS.SHA256(entropy).toString();
};

const obfuscate = hash => CryptoJS.SHA384(hash).toString();

// Returns [obfuscatedHash, nextHash]
const hashChain = hash => {
  const obfuscatedHash = CryptoJS.SHA384(hash).toString();
  const nextHash = CryptoJS.SHA256(hash).toString();

  return [obfuscatedHash, nextHash];
};

// Genesis hash is not yet obfuscated.
const genesisHash = handle => {
  const [_obfuscatedHash, genHash] = hashChain(handle);

  return genHash;
};

const sideChain = address => CryptoJS.SHA512(address).toString();

const encrypt = (text, secretKey) =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

const decrypt = (text, secretKey) => {
  try {
    return CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return "";
  }
};

const decryptTest = (text, secretKey) => {
  //TODO temporary for debugging
  try {
    return CryptoJS.AES.decrypt(text, secretKey).toString();
  } catch (e) {
    return "";
  }
};

export default {
  decrypt,
  decryptTest, //TODO
  encrypt,
  genesisHash,
  getPrimordialHash,
  getSalt,
  hashChain,
  obfuscate,
  parseEightCharsOfFilename,
  sideChain
};
