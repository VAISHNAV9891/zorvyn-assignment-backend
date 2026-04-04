import express from "express";
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    fetchAdminsTransaction
} from "../controllers/transactionControllers.js";
import { tokenVerifier } from "../middlewares/tokenVerifier.js";
import { isValidUser } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post('/create-transaction', tokenVerifier, isValidUser(['Admin']), createTransaction);
router.get('/get-transactions', tokenVerifier, isValidUser(['Admin','Analyst','Viewer']), getTransactions);
router.get('/transaction/:id', tokenVerifier, isValidUser(['Admin','Viewer','Analyst']), fetchAdminsTransaction);
router.patch('/update-transaction/:id', tokenVerifier, isValidUser(['Admin']), updateTransaction);
router.delete('/delete-transaction/:id', tokenVerifier, isValidUser(['Admin']), deleteTransaction);

export default router;