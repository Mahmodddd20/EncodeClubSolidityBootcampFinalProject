// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PiggyBank {
    address private owner;
    address private admin;
    uint256 private feeBalance;

    struct SubPiggyBank {
        uint256 balance;
        uint256 withdrawalTime;
        address owner;
    }

    mapping(bytes32 => SubPiggyBank) private subPiggyBanks;
    mapping(address => bytes32[]) private ownerToSubPiggyBankIds;
    address[] private piggyBankOwnersAddresses;
    mapping(address => bool) private piggyBankOwners;

    constructor() {
        owner = msg.sender;
        admin = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier canWithdraw(bytes32 subPiggyBankId) {
        require(
            block.timestamp >= subPiggyBanks[subPiggyBankId].withdrawalTime,
            "Withdrawals are not yet allowed"
        );
        _;
    }

    modifier canDeposit(bytes32 subPiggyBankId) {
        require(
            block.timestamp < subPiggyBanks[subPiggyBankId].withdrawalTime,
            "Deposits are not allowed anymore"
        );
        _;
    }

    receive() external payable {}

    function setAdmin(address _admin) external onlyOwner {
        admin = _admin;
    }

    function createSubPiggyBank(
        bytes32 subPiggyBankId,
        uint256 _withdrawalTime
    ) external {
        require(
            _withdrawalTime > 0,
            "Withdrawal time must be greater than zero"
        );
        require(
            subPiggyBanks[subPiggyBankId].withdrawalTime == 0,
            "Sub-piggy bank already exists"
        );

        subPiggyBanks[subPiggyBankId].withdrawalTime = _withdrawalTime;
        subPiggyBanks[subPiggyBankId].owner = msg.sender;
        ownerToSubPiggyBankIds[msg.sender].push(subPiggyBankId);

        if (!piggyBankOwners[msg.sender]) {
            piggyBankOwners[msg.sender] = true;
            piggyBankOwnersAddresses.push(msg.sender);
        }
    }

    function deposit(
        bytes32 subPiggyBankId
    ) external payable canDeposit(subPiggyBankId) {
        require(msg.value > 0, "You must deposit some Ether");
        require(
            subPiggyBanks[subPiggyBankId].withdrawalTime > 0,
            "Sub-piggy bank does not exist"
        );
        require(
            subPiggyBanks[subPiggyBankId].owner == msg.sender,
            "You are not the owner of this sub-piggy bank"
        );

        subPiggyBanks[subPiggyBankId].balance += msg.value;
    }

    function withdraw(
        bytes32 subPiggyBankId,
        uint256 amount
    ) external canWithdraw(subPiggyBankId) {
        require(amount > 0, "Amount must be greater than zero");
        require(
            subPiggyBanks[subPiggyBankId].balance >= amount,
            "Insufficient sub-piggy bank balance"
        );
        require(
            subPiggyBanks[subPiggyBankId].owner == msg.sender,
            "You are not the owner of this sub-piggy bank"
        );
        uint256 fee = calculateWithdrawalFee(amount);
        uint256 netAmount = amount - fee;
        require(netAmount > 0, "Withdrawal amount after fee is zero");
        payable(msg.sender).transfer(netAmount);
        subPiggyBanks[subPiggyBankId].balance -= amount;
        feeBalance += fee;
    }

    function getSubPiggyBankData(
        bytes32 subPiggyBankId
    ) external view returns (uint256, uint256, address) {
        require(
            subPiggyBanks[subPiggyBankId].owner == msg.sender,
            "You are not the owner of this sub-piggy bank"
        );
        SubPiggyBank storage subPiggy = subPiggyBanks[subPiggyBankId];
        return (subPiggy.balance, subPiggy.withdrawalTime, subPiggy.owner);
    }

    function getTotalBalance() external view returns (uint256) {
        uint256 total = 0;
        for (
            uint256 i = 0;
            i < ownerToSubPiggyBankIds[msg.sender].length;
            i++
        ) {
            bytes32 subPiggyBankId = ownerToSubPiggyBankIds[msg.sender][i];
            total += subPiggyBanks[subPiggyBankId].balance;
        }
        return total;
    }

    function withdrawAllFromSubPiggy(
        bytes32 subPiggyBankId
    ) external canWithdraw(subPiggyBankId) {
        this.withdraw(subPiggyBankId, subPiggyBanks[subPiggyBankId].balance);
    }

    function getAllSubPiggyBankIds() external view returns (bytes32[] memory) {
        return ownerToSubPiggyBankIds[msg.sender];
    }

    function getAllOwners() external view onlyAdmin returns (address[] memory) {
        return piggyBankOwnersAddresses;
    }

    function getSubPiggyBankDataForAddress(
        address _owner
    )
        external
        view
        onlyAdmin
        returns (bytes32[] memory, uint256[] memory, uint256[] memory)
    {
        bytes32[] memory subPiggyBankIds = ownerToSubPiggyBankIds[_owner];
        uint256 numSubPiggyBanks = subPiggyBankIds.length;
        bytes32[] memory ids = new bytes32[](numSubPiggyBanks);
        uint256[] memory balances = new uint256[](numSubPiggyBanks);
        uint256[] memory withdrawalTimes = new uint256[](numSubPiggyBanks);

        for (uint256 i = 0; i < numSubPiggyBanks; i++) {
            bytes32 subPiggyBankId = subPiggyBankIds[i];
            if (subPiggyBanks[subPiggyBankId].owner == _owner) {
                ids[i] = subPiggyBankId;
                balances[i] = subPiggyBanks[subPiggyBankId].balance;
                withdrawalTimes[i] = subPiggyBanks[subPiggyBankId]
                    .withdrawalTime;
            }
        }
        return (ids, balances, withdrawalTimes);
    }

    function withdrawBalance() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No balance available for withdrawal");
        payable(owner).transfer(contractBalance);
    }

    function checkContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function calculateWithdrawalFee(
        uint256 amount
    ) internal pure returns (uint256) {
        uint256 feePercentage = 2;
        return (amount * feePercentage) / 100;
    }

    function withdrawFee() external onlyOwner {
        uint256 contractFeeBalance = feeBalance;
        require(
            contractFeeBalance > 0,
            "No fee balance available for withdrawal"
        );
        feeBalance = 0;
        payable(owner).transfer(contractFeeBalance);
    }

    function getFeeBalance() external view onlyOwner returns (uint256) {
        return feeBalance;
    }

    function emergencyWithdraw(bytes32 subPiggyBankId) external onlyAdmin {
        SubPiggyBank storage subPiggy = subPiggyBanks[subPiggyBankId];
        require(subPiggy.owner != address(0), "Sub-piggy bank does not exist");

        uint256 balanceToWithdraw = subPiggy.balance;
        uint256 fee = (balanceToWithdraw * 5) / 100;
        uint256 netAmount = balanceToWithdraw - fee;
        require(netAmount > 0, "Withdrawal amount after fee is zero");

        payable(subPiggy.owner).transfer(netAmount);
        feeBalance += fee;
        removeSubPiggyBank(subPiggyBankId);
    }

    function removeSubPiggyBank(bytes32 subPiggyBankId) internal {
        address ownerToRemove = subPiggyBanks[subPiggyBankId].owner;

        for (
            uint256 i = 0;
            i < ownerToSubPiggyBankIds[ownerToRemove].length;
            i++
        ) {
            if (ownerToSubPiggyBankIds[ownerToRemove][i] == subPiggyBankId) {
                ownerToSubPiggyBankIds[ownerToRemove][
                    i
                ] = ownerToSubPiggyBankIds[ownerToRemove][
                    ownerToSubPiggyBankIds[ownerToRemove].length - 1
                ];
                ownerToSubPiggyBankIds[ownerToRemove].pop();
                break;
            }
        }
        delete subPiggyBanks[subPiggyBankId];
    }
}
