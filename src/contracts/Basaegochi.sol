// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Basaegochi
 * @dev A simple contract to track battle results and pet stats for Basaegochi game.
 * Note: This is an example contract.
 */
contract Basaegochi {
    // Mapping from user address to their total battle points
    mapping(address => uint256) public battlePoints;

    // Struct to hold simple on-chain stats
    struct PetStats {
        uint8 petType;
        uint8 level;
        uint256 wins;
        uint256 losses;
        uint256 lastBattleTime;
    }

    // Mapping from user address to their pet stats
    mapping(address => PetStats) public registeredPets;

    // Events
    event BattleResult(address indexed winner, address indexed loser, uint256 wins, uint256 losses);
    event PetRegistered(address indexed owner, uint8 petType);

    /**
     * @dev Registers a pet on-chain.
     * @param _petType The type of pet (0-4).
     */
    function registerPet(uint8 _petType) external {
        registeredPets[msg.sender].petType = _petType;
        registeredPets[msg.sender].level = 1;
        emit PetRegistered(msg.sender, _petType);
    }

    /**
     * @dev Records a battle result.
     * In a real game, this would be called by the game server or via a commit-reveal scheme
     * to prevent cheating. For this demo, we allow direct calling for simplicity,
     * or it could be restricted to an 'owner' or 'oracle'.
     */
    function recordBattleResult(address _winner, address _loser) external {
        // Update winner
        battlePoints[_winner] += 10;
        registeredPets[_winner].wins += 1;
        registeredPets[_winner].level += 1; // Simple level up on win
        registeredPets[_winner].lastBattleTime = block.timestamp;

        // Update loser
        if (battlePoints[_loser] >= 5) {
            battlePoints[_loser] -= 5;
        } else {
            battlePoints[_loser] = 0;
        }
        registeredPets[_loser].losses += 1;
        registeredPets[_loser].lastBattleTime = block.timestamp;

        emit BattleResult(_winner, _loser, registeredPets[_winner].wins, registeredPets[_loser].losses);
    }

    /**
     * @dev Get pet stats for a user
     */
    function getPetStats(address _owner) external view returns (PetStats memory) {
        return registeredPets[_owner];
    }
}
