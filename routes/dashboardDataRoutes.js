import express from 'express';
import { 
    getDashboardTotals, 
    getDashboardCategories, 
    getDashboardMonthlyTrends, 
    getDashboardRecent,
    getDashboardWeeklyTrends
} from '../controllers/dashboardDataControllers.js';

import { tokenVerifier } from '../middlewares/tokenVerifier.js';
import { isValidUser } from '../middlewares/authorizeRoles.js';

const router = express.Router();


router.get('/totals', tokenVerifier, isValidUser(['Admin', 'Analyst', 'Viewer']), getDashboardTotals);
router.get('/categories', tokenVerifier, isValidUser(['Admin', 'Analyst', 'Viewer']), getDashboardCategories);
router.get('/trends/monthly', tokenVerifier, isValidUser(['Admin', 'Analyst', 'Viewer']), getDashboardMonthlyTrends);
router.get('/recent', tokenVerifier, isValidUser(['Admin', 'Analyst', 'Viewer']), getDashboardRecent);
router.get('/trends/weekly', tokenVerifier, isValidUser(['Admin', 'Analyst', 'Viewer']), getDashboardWeeklyTrends);


export default router;