# Simple Implementation of how to implement fee payment from contract in case of VRF using W3F.

## Step 1:

Firstly inherit both GelatoVRFConsumerBase and AutomateReady(which will help transaction pay for itself) in your contract.
[Check here](https://github.com/HiteshMittal07/Gelato_VRF_W3F/blob/main/contracts/SimpleContract.sol)
Where constructor will have `_automate` as an address for preferred network [Check here](https://docs.gelato.network/web3-services/web3-functions/contract-addresses)
and `task_creator` will have address of task creator in app.gelato.network

## Step 2:

Now create a typescript function for W3F which will be be automatically executed whenever `RandomnessRequested(uint64 requestId)` event will be triggered, this can be implemented as [Check here](https://github.com/HiteshMittal07/Gelato_VRF_W3F/blob/main/Web3-Functions/index.ts) and to deploy the web3-functions you can use `npx w3f deploy Web3-Functions/index.ts` and make sure .env file is present with `PROVIDER_URLS`.

## Step 3:

Now deploy your contract and create W3F task from app.gelato.network with trigger type On-chain Event, with typescript function as automation type and select transaction pays for itself. [Click here to create task](https://app.gelato.network/functions/create)

# How this work?

Whenever the user will call the `requestRandomness(bytes memory \_data)` in your contract, the event will be triggered, which will be picked by W3F which will further call the `fulfillRandomness(uint256 randomness,bytes calldata dataWithRound)` function automatically, and then `_fullfillRandomness()` will be called which will have your logic.

Add this to your `_fullfillRandomness()` function. This will transfer the fee from your contract.

```
(uint256 fee, address feeToken) = _getFeeDetails();

        _transfer(fee, feeToken);
```

# How you can test?

Whenever the event is emitted you can store the log of event in the `log.json` (look at schema in `Web3-Functions/log.json`) in the same directory of Web3-Functions.
Then you can test the function by running the command :-

`npx w3f test /path/to/web-funtion/index.ts --logs --chain-id=31337`

or for any URL you pass in PROVIDER_URLS in .env
