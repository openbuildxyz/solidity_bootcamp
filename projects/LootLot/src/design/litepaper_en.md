# LotLoot Product Design

## I. Introduction

### 1.1 Purpose of Writing

- The purpose is to:
  1. Provide guidance for developers.
  2. Establish a basis for modifications and maintenance.
  3. Aid the project manager in organizing and overseeing the development process as per the project plan.
  4. Enable the project quality assurance team to conduct phase-wise and summative quality verification and validation as outlined in this plan.
- Intended Readers:
  1. Project developers.
  2. Software maintenance personnel.
  3. Stakeholders involved in validation, confirmation at various development stages, and reporting for final project acceptance and evaluation.
  4. The Ethereum Hangzhou Hackathon team and judges.

### 1.2 Background

- System Name: LotLoot
- Developer: WeDao Team

### 1.3 Definition

- A social parking space battle game based on blockchain technology

## II. System Architecture

### 2.1 System Architecture

- User Interface (UI): This is the interface through which players interact with the game. It should include a homepage displaying an overview of the game, personal parking spaces, and nearby parking spaces. Additionally, there should be a menu allowing players to log in/register, start the game, view rankings, etc.
- User Interface (UI) and Game Logic Interface: This part handles the interaction between the UI and the core game logic. It receives player inputs, passes them to the game logic for processing, and returns results to be displayed by the UI.
- Game Logic: This is the core part of the game, including but not limited to parking, battling for parking spaces, upgrading vehicles, earning rewards, and other core functionalities.
- Database: This part is responsible for storing all persistent game data, including player information (levels, scores, vehicles, etc.), parking space information (location, level, rewards, etc.), and game events.
- Server: This part is responsible for handling all game operations, such as vehicle movement, collision detection, scoring, and more. A parking space battle game may require a real-time updating server to allow players to participate from anywhere.
- Network Interface: This part handles connections with other players, enabling them to interact in the game. It may require the use of network libraries or protocols to implement this.

### 2.2 System Processes

- User Login: Users enter their details (e.g., username and password), and the system verifies the information's correctness. If it's correct, the user gains access to the game.
- Game Initialization: At the beginning of each game, the system creates a new parking space for the player and initializes other game elements like other players' vehicles.
- Player Actions: Players can control their vehicles to move in the game, search for parking spaces, and attempt to occupy them.
- Parking Space Evaluation: When a player attempts to occupy a parking space, the system assesses the situation. If the parking space is empty or the player has enough space to park their vehicle (based on game-specific rules), they will successfully occupy the parking space. Otherwise, they will fail and need to find another parking space.
- Game Updates: At specific intervals (e.g., every minute), the system updates the game state. This may include adding new parking spaces, rewards, or scoring player actions.
- Scoring and Ranking: Based on player actions (e.g., the number of occupied parking spaces or rewards collected), the system calculates scores for players, which can be displayed on in-game leaderboards.
- Player Exit: If a player decides to exit the game, they can choose to exit, and the system will save their game state for their next play.

### 2.3 User Role Descriptions

#### 2.3.1 Parking

- Users can select parking locations for their vehicles, and earnings depend on the quality of the vehicle and parking space.
- Vehicles generate earnings only when parked in a space.

#### 2.3.2 Parking Fees

- When a user discovers other vehicles parked in their parking spaces, they can issue parking fines, gaining a share of the earnings from those vehicles.

### 2.4 System Function Descriptions

#### 2.4.1 Parking Space Competition

- Users choose parking spaces based on the number of minted vehicles. Each user can park one vehicle in their own parking space to generate earnings, and extra vehicles need to occupy other users' parking spaces.
- Vehicles can only generate earnings when parked in a space. Users can issue parking fines to other vehicles in their parking spaces, gaining a share of the earnings.

#### 2.4.2 Token Earnings

- User assets in LotLoot include vehicle value, parking space value, and vehicle parking earnings.
- The in-game token, LLT (LotLoot Token), serves as an on-chain asset, connecting to the Ethereum ecosystem, allowing users to withdraw at any time.
- Parking generates earnings for a maximum of 24 hours, and users need to re-park after the time limit.

#### 2.4.3 Asset Upgrades

- Vehicle and parking space earnings depend on NFT and consumption based on usage time.
- LLT (LotLoot circulation token) can be used to upgrade vehicles and parking spaces, involving token destruction, enhancing gameplay diversity.

### 2.5 Asset Integration

- NFT: Players mint NFTs for the game, using them as their in-game vehicles to earn LLT.
- Token: In-game earnings are in LLT, tradable on the blockchain. The main page displays player tokens and ranks players based on holdings in the friend list.

## III. Design Details

### 3.1 Overview

- LotLoot is a social parking space battle game based on blockchain technology. Players can log in with their social accounts, own multiple vehicles, and five parking spaces, and interact with other players to earn token rewards. The game fully leverages the characteristics of blockchain technology, providing a decentralized, transparent, and secure gaming experience for players.

### 3.2 Game Feature Overview:

1. **Interoperability**:
   - By supporting the ERC-6551 standard, the game allows players to bring any NFT (non-fungible token) they own into the game, using it as a driver in the game. This provides players with a unique and personalized gaming experience and extends the value of their assets.
2. **Human Game Theory**:
   - Through garage management and penalty mechanisms, the game guides players to maximize individual profits while making precise decisions about when to issue fines for optimal earnings. This adds strategy and allure to the game.
3. **On-chain Gaming**:
   - The game is based on blockchain technology, creating a perpetual, positive-sum gaming environment, ensuring fairness, transparency, and the possibility of continued development.
4. **Token Economics**:
   - The game's token output primarily depends on player parking earnings, with the main token consumption coming from vehicle upgrades, where the token consumption is exponentially increasing. This creates a sustainable economic system.
5. **Social Attributes**:
   - Through integration with Twitter accounts, players can own their garages and interact with other players on social media, enhancing the game's social and promotional aspects.
6. **Social Sharing**:
   - When a player's vehicle successfully leaves a parking space or receives a penalty, the system provides an option for players to share this news on Twitter, enhancing social sharing and outreach.
7. **Vehicle Part Combinations**:
   - In the future, the game will introduce various vehicle parts (NFTs). Players can enhance their vehicles' attributes and earning capabilities by combining different parts, adding more strategy and playability to the game.
8. **Fleet**:
   - When players bring NFTs from the same collection into the game, the entire fleet of vehicles gains attribute bonuses (e.g., increased earnings), encouraging players to form teams and collaborate, creating a team cooperation mechanism.
9. **Fleet Stake**:
   - The game includes a staking mechanism where 5% of the tokens generated by vehicles flow into the fleet treasury. Players need to stake tokens to receive this portion of earnings, creating an incentive for player participation and investment.

### 3.3 Technical Implementation

1. Blockchain Technology:
   - The LotLoot game is implemented based on blockchain technology, ensuring data's immutability and transparency. All in-game transaction records are stored on the blockchain, available for all players to view. This allows players to verify the fairness of in-game transactions, guaranteeing the game's integrity.
2. Smart Contracts:
   - All interactions and rules within the LotLoot game are implemented through smart contracts. Smart contracts are computer programs running on the blockchain, capable of automatically executing predefined tasks, ensuring the game's rule-based nature and fairness.
3. Social Interaction:
   - The game provides players with opportunities to interact with other players. Players can view other players' vehicles and parking spaces, engage in parking space battles, and enhance the game's fun and interactivity.

### 3.4 Player Rights and Responsibilities

1. Ownership of Vehicles and Parking Spaces:
   - Every player in the game has multiple vehicles and five parking spaces. Players can freely use and manage these vehicles and parking spaces.
2. Interaction and Competition:
   - Players can earn rewards through social interactions with other players. For example, when a player successfully parks their vehicle in another player's parking space, they receive token rewards.
3. Network Maintenance:
   - As part of a blockchain game, players also have a duty to help maintain network security and stability. For example, by participating in the validation and packaging of new blocks to ensure blockchain stability and security.

### 3.5 Security Considerations

- Due to its foundation on blockchain technology, LotLoot has inherently high security. The immutability of data protects players' interests, and the use of smart contracts eliminates the possibility of human errors or cheating. However, players should still be cautious about protecting their accounts and personal information to prevent hacking or fraud by other players.

### 3.6 Future Development Plans

- LotLoot plans to continue expanding and enhancing the game's features. This includes adding more vehicle types, parking space types, and game modes; optimizing user experience to improve game flow and stability; strengthening security measures to protect against increasingly complex network attacks, and regularly hosting competitions and events to increase the game's fun and playability.
