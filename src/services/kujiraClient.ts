import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Coin } from "@cosmjs/stargate";
import { CONTRACT_CONFIG } from "../config/contract";
import type { Outcome, GameResponse } from "../config/contract";

// define types and interface
interface CreateGameMsg {
  create_game: {
    id: string;
  };
}

interface UpdateGameOutcomeMsg {
  update_game_outcome: {
    game_id: string;
    outcome: Outcome;
  };
}

// initialize the client

let client: SigningCosmWasmClient | null = null;
let account: any = null;

const getClient = () => {
  if (!client) throw new Error("Client not initialized");
  return client;
};

const isClientInitialized = () => {
  return client !== null && account !== null;
};

const gas: any = "0.025";

// here for wallet sigining functionalities
const initialize = async () => {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      CONTRACT_CONFIG.mnemonic,
      { prefix: "kujira" }
    );

    [account] = await wallet.getAccounts();

    client = await SigningCosmWasmClient.connectWithSigner(
      CONTRACT_CONFIG.rpcEndpoint,
      wallet,
      {
        gasPrice: {
          amount: gas,
          denom: CONTRACT_CONFIG.denom,
        },
      }
    );

    console.log("Kujira client initialized with address:", account.address);
    return true;
  } catch (error) {
    console.error("Failed to initialize Kujira client:", error);
    return false;
  }
};

const executeMsg = async (msg: any, funds?: Coin[]) => {
  if (!isClientInitialized()) {
    throw new Error("Client not initialized");
  }

  try {
    const fee = {
      amount: [
        {
          denom: CONTRACT_CONFIG.denom,
          amount: CONTRACT_CONFIG.fee.amount,
        },
      ],
      gas: CONTRACT_CONFIG.fee.gas,
    };

    console.log("Executing transaction:", {
      sender: account.address,
      contract: CONTRACT_CONFIG.contractAddress,
      msg,
      fee,
      funds,
    });

    const result = await getClient().execute(
      account.address,
      CONTRACT_CONFIG.contractAddress,
      msg,
      fee,
      "",
      funds || []
    );

    console.log("Transaction result:", result);
    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Transaction failed"
    );
  }
};

const queryGame = async (gameId: string): Promise<GameResponse> => {
  if (!isClientInitialized()) {
    throw new Error("Client not initialized");
  }

  try {
    console.log("Querying game:", gameId);
    const response = await getClient().queryContractSmart(
      CONTRACT_CONFIG.contractAddress,
      {
        get_game: { game_id: gameId },
      }
    );
    console.log("Game data:", response);
    return response;
  } catch (error) {
    console.error("Query game failed:", error);
    throw new Error(`Failed to query game: ${error}`);
  }
};

const queryBet = async (gameId: string, player: string) => {
  if (!isClientInitialized()) {
    throw new Error("Client not initialized");
  }

  try {
    console.log("Querying bet:", { gameId, player });
    const response = await getClient().queryContractSmart(
      CONTRACT_CONFIG.contractAddress,
      {
        get_bet: {
          game_id: gameId,
          user: player,
        },
      }
    );
    console.log("Bet data:", response);
    return response;
  } catch (error) {
    console.error("Query bet failed:", error);
    throw new Error(`Failed to query bet: ${error}`);
  }
};

const createGame = async (gameId: string) => {
  const msg: CreateGameMsg = {
    create_game: {
      id: gameId,
    },
  };
  console.log("Creating game:", { gameId });
  return executeMsg(msg);
};

const updateGameOutcome = async (gameId: string, outcome: Outcome) => {
  const msg: UpdateGameOutcomeMsg = {
    update_game_outcome: {
      game_id: gameId,
      outcome,
    },
  };
  console.log("Updating game outcome:", { gameId, outcome });
  return executeMsg(msg);
};

const manualUpdateGameOutcome = async (gameId: string, outcome: Outcome) => {
  const msg = {
    manual_update_game_outcome: {
      game_id: gameId,
      outcome,
    },
  };
  console.log("Manual update game outcome:", { gameId, outcome });
  return executeMsg(msg);
};

export {
  initialize,
  createGame,
  queryGame,
  queryBet,
  updateGameOutcome,
  manualUpdateGameOutcome,
  isClientInitialized,
};
