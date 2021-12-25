import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import EpicNFT from "./utils/EpicNFT.json";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

// Constants
const TWITTER_HANDLE = 'LordHeb';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0xe090F86Ec818ac271690396FBC44F6088a139dbe";

const App = () => {
  // State variable we use to store our user's public wallet
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    // we make sure we have access to window.ethereum
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    // check if we are authorized to access the account user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    // User can have multiple authorized accounts, we grab the first one
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("found an authorized account", account);
      setCurrentUser(account);
      // Setup Listener for the case of a user that already have their wallet connected+authorized
      eventListener();
    } else {
      console.log("No authorized accounts found");
    }
  }

  const checkIfOnCorrectNetwork = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        let chainID = await ethereum.request({
          method: 'eth_chainId'
        });
        console.log("connected to chain " + chainID);
        // string, hex code of the chainID of the Rinkeby network
        const rinkebyChainID = "0x4";
        if (chainID !== rinkebyChainID) {
          alert("You are not connected to the Rinkeby Test Network.");
        }
      } else {
        console.log("We have no ethereum object");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // request access to account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      // print out our public address once we authorize MetaMask
      console.log("Connected", accounts[0]);
      setCurrentUser(accounts[0]);
      // Setup Listener for a new user that connect their wallet for the fist time
      eventListener();
    } catch (error) {
      console.log(error);
    }
  }
  const eventListener = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNFT.abi, signer);
        // capture our smart contract emitted event same as webhooks
        connectedContract.on("NewEpicNFTMinted", (from, tokenID) => {
          console.log(from, tokenID.toNumber());
          setIsLoading(false);
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenID.toNumber()}`)
        });
        console.log("Setup event Listener");
      } else {
        console.log("Ethereum Object does not exist");
      }
    } catch (error) {
      console.log(error);
    }

  }
  const askContractToMintNft = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNFT.abi, signer);
      console.log("time to pay some gas.fee");
      let nftMint= await connectedContract.makeAnEpicNFT();

      console.log("Mining ... Please Wait!");
      await nftMint.wait();
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftMint.hash}`);
      setIsLoading(true);
    } else {
      console.log("ethereum object not found");
    }
  } catch (error) {
    console.log(error);
  }
}

  // run our function when the page loads
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfOnCorrectNetwork();
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick= {connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
       Mint NFT
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentUser === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div
          style={{
            display: isLoading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Loader
            type="Puff"
            color="#60c657"
            height={50}
            width={50}
            // timeout={3000} //3 secs
          />
          <p style={{ color: "#fff" }}>Minting, please wait.</p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
