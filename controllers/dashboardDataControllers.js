import Transaction from "../models/transactionSchema.js";

export const getDashboardTotals = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$type", totalAmount: { $sum: "$amount" } } }
        ]);

        let totalIncome = 0; let totalExpense = 0;
        result.forEach(item => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpense = item.totalAmount;
        });

        const netBalance = totalIncome - totalExpense;

        return res.status(200).json({ success: true, data: { totalIncome, totalExpense, netBalance } });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getDashboardCategories = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } } 
        ]);
        return res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getDashboardMonthlyTrends = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = { isDeleted: false };

        if (startDate && endDate) {
            matchStage.date = {
                $gte: new Date(`${startDate}T00:00:00.000Z`),
                $lte: new Date(`${endDate}T23:59:59.999Z`)
            };
        }

        const result = await Transaction.aggregate([
            { $match: matchStage }, 
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getDashboardRecent = async (req, res) => {
    try {
        const result = await Transaction.find({ isDeleted: false })
            .sort({ _id: -1 }) 
            .limit(5); 
            
        return res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getDashboardWeeklyTrends = async (req, res) => {
    try {
        const matchStage = { isDeleted: false };

        
        if (req.query.startDate && req.query.endDate) {
            matchStage.date = {
                $gte: new Date(`${req.query.startDate}T00:00:00.000Z`), 
                $lte: new Date(`${req.query.endDate}T23:59:59.999Z`)
            };
        }

        
        const result = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%G-W%V", date: "$date" } }, 
                    income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id": 1 } } 
        ]);
        
        return res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

