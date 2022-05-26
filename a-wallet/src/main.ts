import { ethers } from "ethers";
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

const YOUR_URL = "http://localhost:3001";
const APP_NAME = "Pineapple Inc.";
const DEEP_LINK = "coinbase://wallet/";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

function isAndroid() {
  const isAndroidUserAgent = /(android)/i.test(navigator.userAgent);
  return isAndroidUserAgent;
}

async function signEthereum() {
  console.log("signEthereum");

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    await signer.signMessage(
      `Verify by signing below to authenticate ${APP_NAME}`
    );

    // TODO: Sign message with token

    app.innerHTML = `Connected! Redirecting back...`;

    // Redirect URL with callback info
    if (isAndroid()) {
      window.location.href = `${DEEP_LINK}?address=${address}`;
    } else {
      window.location.href = `${YOUR_URL}/?address=${address}`;
    }
  } catch (err) {
    // Display error state
    console.log(err);
  }
}

async function handleEthereum() {
  console.log("handleEthereum");
  try {
    await window.ethereum.enable();
    console.log("enabled");

    setTimeout(signEthereum, 500);
  } catch (err) {
    console.log(err);
  }
}

function initListener() {
  console.log("initListener");
  window.addEventListener("ethereum#intialized", handleEthereum, {
    once: true
  });

  setTimeout(handleEthereum, 5000); // 5 seconds
}

window.ethereum ? handleEthereum() : initListener();
