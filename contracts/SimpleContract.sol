// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {GelatoVRFConsumerBase} from "./GelatoVRFConsumerBase.sol";
import {AutomateReady} from "./AutomateReady.sol";

contract SimpleContract is GelatoVRFConsumerBase, AutomateReady {
    uint256 public myNumber;
    uint64 randomnessId;
    bytes32 public latestRandomness;
    address private immutable operatorAddr;

    struct Request {
        uint256 requestTime;
        uint256 requestBlock;
        uint256 fulfilledTime;
        uint256 fulfilledBlock;
        uint256 randomness;
    }

    event RandomnessRequested(uint64 requestId);
    event RandomnessFulfilled(uint256 indexed nonce, Request);

    mapping(uint256 => Request) public requests;

    constructor(
        uint256 _number,
        address operator,
        address _automate,
        address _taskCreator
    ) AutomateReady(_automate, _taskCreator) {
        myNumber = _number;
        operatorAddr = operator;
    }

    receive() external payable {}

    function requestRandomness(bytes memory _data) external {
        randomnessId = uint64(_requestRandomness(_data));
        emit RandomnessRequested(randomnessId);
    }

    function _fulfillRandomness(
        uint256 _randomness,
        uint256 _requestId,
        bytes memory _data
    ) internal override {
        require(
            randomnessId == _requestId,
            "Request ID does not match the last request."
        );
        Request storage request = requests[uint64(_requestId)];
        request.requestTime = block.timestamp;
        request.requestBlock = block.number;
        request.fulfilledTime = block.timestamp;
        request.fulfilledBlock = block.number;
        request.randomness = _randomness;

        latestRandomness = bytes32(_randomness);
        randomnessId = uint64(_requestId);

        (uint256 fee, address feeToken) = _getFeeDetails();
        _transfer(fee, feeToken);

        myNumber = 5;
        emit RandomnessFulfilled(uint64(_requestId), request);
    }

    function _operator() internal view virtual override returns (address) {
        return operatorAddr;
    }
}
