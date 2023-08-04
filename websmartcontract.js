'use strict';

const provider = window.ethereum;
const web3 = new Web3(window.ethereum);
let contract = 0;
const btnVerify = document.querySelector('#btnVerify');
const btnCopyright = document.querySelector('#btnCopyright');
const inputVerify = document.querySelector('#songlyricstoverify');
const inputcopyright = document.querySelector('#songlyricstocopyright');
///////////////////////////////////////////////////

if (provider) {
  startApp(provider); // Initialize your app
} else {
  console.log('Please install MetaMask! and uninstall other wallets');
}

function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

const executeit = async function () {
  const chainId = await ethereum.request({ method: 'eth_chainId' });

  handleChainChanged(chainId);

  function handleChainChanged(_chainId) {
    console.log(
      'Connected to chain with id (eg 0x2a is Kovan testnet) ',
      chainId,
      'ethereum.isConnected() ',
      ethereum.isConnected()
    );
  }

  let currentAccount = null;
  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch(err => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });

  // Note that this event is emitted on page load.
  // If the array of accounts is non-empty, you're already
  // connected.
  ethereum.on('accountsChanged', handleAccountsChanged);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Go to wallet and please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      console.log(currentAccount);
    }
  }
  function connect() {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch(error => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
  }
  connect();
  const Abi = [
    {
      constant: true,
      inputs: [{ name: 'lyrics', type: 'string' }],
      name: 'checkLyrics',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'lyrics', type: 'string' }],
      name: 'copyrightLyrics',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  contract = new web3.eth.Contract(
    Abi,
    '0x258e506B54131DF60999774fbf1F455Ff9cBd125'
  );
  console.log('This is contract', contract);
};

executeit();

/*contract.defaultAccount = `0xd9AaCbcdbF452bD80eb610fB5687E4DeEF4A44f1`;
contract.defaultChain = 'kovan';
contract.options.address = contractaddress;
console.log(contract.methods, typeof contract.methods);*/

btnCopyright.addEventListener('click', function () {
  var songlyrics = inputcopyright.value;
  console.log('LYRICS');
  console.log(songlyrics);

  contract.methods
    .copyrightLyrics(songlyrics)
    .send({ from: ethereum.selectedAddress }, (err, result) => {
      if (err) console.log(err);
      else {
        alert(
          'SUCCESS! YOU CAN GET TRANSACTION DETAILS BY VISITING etherscan.io PAGE OF THE CHAIN YOU ARE OPERATING ON'
        );
        console.log('Hash', result);
      }
    });
});

btnVerify.addEventListener('click', async function () {
  var songlyrics = inputVerify.value;
  const value = await contract.methods.checkLyrics(songlyrics).call();
  console.log(value);
  if (value) alert(`TRUE: This song is copyrighted.`);
  else alert(`FALSE: This song is not copyrighted.`);
});
