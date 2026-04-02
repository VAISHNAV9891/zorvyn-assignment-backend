import express from "express";
import {
  createUser,
  updateUserRole,
  updateAccountStatus
} from "../controllers/adminControllers.js"
import {tokenVerifier} from '../middlewares/tokenVerifier.js';
import { isValidUser } from "../middlewares/authorizeRoles.js";
const router = express.Router();



router.post('/create-user', tokenVerifier, isValidUser(['Admin']), createUser);
router.post('/update-user-role', tokenVerifier, isValidUser(['Admin']), updateUserRole);
router.post('/update-status', tokenVerifier, isValidUser(['Admin']), updateAccountStatus);

export default router;