// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BattleArena {
    struct BattleRecord {
        address player;
        uint256 wins;
        uint256 losses;
        uint256 totalBattles;
        uint256 lastBattleTime;
        uint256 winStreak;
        uint256 highestWinStreak;
    }

    struct Battle {
        address player1;
        address player2;
        address winner;
        uint256 timestamp;
        uint256 player1Score;
        uint256 player2Score;
    }

    mapping(address => BattleRecord) public playerRecords;
    mapping(uint256 => Battle) public battles;

    uint256 public totalBattles;
    uint256 public constant BATTLE_COOLDOWN = 60; // 60 seconds cooldown

    address[] public leaderboard;

    event BattleStarted(uint256 indexed battleId, address indexed player1, address indexed player2);
    event BattleEnded(uint256 indexed battleId, address indexed winner, address indexed loser, uint256 winnerScore, uint256 loserScore);
    event NewHighStreak(address indexed player, uint256 streak);
    event LeaderboardUpdated(address indexed player, uint256 wins);

    modifier canBattle() {
        require(
            block.timestamp >= playerRecords[msg.sender].lastBattleTime + BATTLE_COOLDOWN,
            "Battle cooldown active"
        );
        _;
    }

    function recordBattleResult(
        address opponent,
        bool playerWon,
        uint256 playerScore,
        uint256 opponentScore
    ) external canBattle {
        require(opponent != address(0), "Invalid opponent");
        require(opponent != msg.sender, "Cannot battle yourself");

        totalBattles++;
        uint256 battleId = totalBattles;

        address winner = playerWon ? msg.sender : opponent;
        address loser = playerWon ? opponent : msg.sender;

        // Create battle record
        battles[battleId] = Battle({
            player1: msg.sender,
            player2: opponent,
            winner: winner,
            timestamp: block.timestamp,
            player1Score: playerScore,
            player2Score: opponentScore
        });

        // Update winner's record
        playerRecords[winner].wins++;
        playerRecords[winner].totalBattles++;
        playerRecords[winner].lastBattleTime = block.timestamp;
        playerRecords[winner].winStreak++;

        if (playerRecords[winner].winStreak > playerRecords[winner].highestWinStreak) {
            playerRecords[winner].highestWinStreak = playerRecords[winner].winStreak;
            emit NewHighStreak(winner, playerRecords[winner].winStreak);
        }

        // Update loser's record
        playerRecords[loser].losses++;
        playerRecords[loser].totalBattles++;
        playerRecords[loser].lastBattleTime = block.timestamp;
        playerRecords[loser].winStreak = 0;

        // Update leaderboard
        _updateLeaderboard(winner);

        emit BattleStarted(battleId, msg.sender, opponent);
        emit BattleEnded(battleId, winner, loser, playerScore, opponentScore);
    }

    function _updateLeaderboard(address player) private {
        bool exists = false;
        uint256 playerIndex = 0;

        // Check if player exists in leaderboard
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == player) {
                exists = true;
                playerIndex = i;
                break;
            }
        }

        // Add to leaderboard if not exists and limit to top 100
        if (!exists && leaderboard.length < 100) {
            leaderboard.push(player);
            playerIndex = leaderboard.length - 1;
            exists = true;
        }

        // Sort leaderboard by wins (bubble sort for simplicity)
        if (exists) {
            for (uint256 i = playerIndex; i > 0; i--) {
                if (playerRecords[leaderboard[i]].wins > playerRecords[leaderboard[i-1]].wins) {
                    address temp = leaderboard[i];
                    leaderboard[i] = leaderboard[i-1];
                    leaderboard[i-1] = temp;
                } else {
                    break;
                }
            }
        }

        emit LeaderboardUpdated(player, playerRecords[player].wins);
    }

    function getPlayerRecord(address player) external view returns (BattleRecord memory) {
        return playerRecords[player];
    }

    function getLeaderboard(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        uint256 size = limit > leaderboard.length ? leaderboard.length : limit;
        address[] memory players = new address[](size);
        uint256[] memory wins = new uint256[](size);

        for (uint256 i = 0; i < size; i++) {
            players[i] = leaderboard[i];
            wins[i] = playerRecords[leaderboard[i]].wins;
        }

        return (players, wins);
    }

    function getBattle(uint256 battleId) external view returns (Battle memory) {
        return battles[battleId];
    }

    function getWinRate(address player) external view returns (uint256) {
        if (playerRecords[player].totalBattles == 0) return 0;
        return (playerRecords[player].wins * 100) / playerRecords[player].totalBattles;
    }

    function canPlayerBattle(address player) external view returns (bool) {
        return block.timestamp >= playerRecords[player].lastBattleTime + BATTLE_COOLDOWN;
    }

    function getTimeUntilNextBattle(address player) external view returns (uint256) {
        uint256 nextBattleTime = playerRecords[player].lastBattleTime + BATTLE_COOLDOWN;
        if (block.timestamp >= nextBattleTime) return 0;
        return nextBattleTime - block.timestamp;
    }
}