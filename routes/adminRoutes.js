import express from "express";
import {
  createUser,
  updateUserRole,
  updateAccountStatus,
  deleteUserAccount,
  getAllUsers
} from "../controllers/adminControllers.js"
import {tokenVerifier} from '../middlewares/tokenVerifier.js';
import { isValidUser } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post('/create-user', tokenVerifier, isValidUser(['Admin']), createUser);
router.patch('/update-user-role', tokenVerifier, isValidUser(['Admin']), updateUserRole);
router.get('/get-all-users', tokenVerifier, isValidUser(['Admin']), getAllUsers);
router.patch('/update-status', tokenVerifier, isValidUser(['Admin']), updateAccountStatus);
router.delete('/delete-user/:id', tokenVerifier, isValidUser(['Admin']), deleteUserAccount);

export default router;