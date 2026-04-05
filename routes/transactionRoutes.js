import express from "express";
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    fetchAdminsTransaction,
    getTransactionsByDate
} from "../controllers/transactionControllers.js";
import { tokenVerifier } from "../middlewares/tokenVerifier.js";
import { isValidUser } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post('/create-transaction', tokenVerifier, isValidUser(['Admin']), createTransaction);
router.get('/get-transactions', tokenVerifier, isValidUser(['Admin','Analyst']), getTransactions);
router.get('/transaction/:id', tokenVerifier, isValidUser(['Admin','Analyst']), fetchAdminsTransaction);
router.patch('/update-transaction/:id', tokenVerifier, isValidUser(['Admin']), updateTransaction);
router.delete('/delete-transaction/:id', tokenVerifier, isValidUser(['Admin']), deleteTransaction);
router.get('/get-by-date', tokenVerifier, isValidUser(['Admin','Analyst']), getTransactionsByDate);

export default router;