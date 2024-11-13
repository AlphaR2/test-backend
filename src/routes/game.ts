import express from "express";
import {
  initialize,
  createGame,
  queryGame,
  updateGameOutcome,
} from "../services/kujiraClient";

const router = express.Router();

// Initialize the client when server starts
initialize().catch(console.error);

router.post("/games/create", async (req, res) => {
  try {
    const { gameId } = req.body;
    const result = await createGame(gameId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    });
  }
});

router.get("/games/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await queryGame(gameId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    });
  }
});

router.post("/games/:gameId/outcome", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { outcome } = req.body;
    const result = await updateGameOutcome(gameId, outcome);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    });
  }
});

export default router;
