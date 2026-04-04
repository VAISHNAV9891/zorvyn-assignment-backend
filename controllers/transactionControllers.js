import  Transaction  from '../models/transactionSchema.js';


export const createTransaction = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: 'Request body cannot be empty.' });
        }
        const { amount, type, category, notes } = req.body;
        //Important Check
        if(!amount || !type || !category){
            return res.status(400).json({ success : false, message: 'Error : Amount,type and category is needed to proceed with this action.'});
        }

        //Rejecting early we can also implement this using -> zoi input validator module
        if(!isNaN(type)){
            return res.status(400).json({ success: false, message: 'Type cannot be a number.' });
        }

        if(isNaN(amount)){
            return res.status(400).json({ success: false, message: 'Error : Amount Should be a number' });
        }

        if(!isNaN(category)){
            return res.status(400).json({ success: false, message: 'Category cannot a number.' });
        }

        if(!isNaN(notes)){
            return res.status(400).json({ success: false, message: 'Category cannot a number.' });
        }

        

        
        const newTransaction = await Transaction.create({
            user : req.user.id,//As company can have multiple admins so this can be used to track that "This transaction is created by which admin" 
            amount, 
            type: type.toLowerCase(), 
            category: category.trim().toLowerCase(), 
            notes: notes ? notes.trim() : ""
        });

        return res.status(201).json({
            success: true,
            message: 'Transaction created successfully.',
            data: newTransaction
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid data format provided.' });
        }
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getTransactions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor;
        const dbQuery = { isDeleted : false};
        
        if(cursor){
            dbQuery._id = { $lt : cursor };
        }
        
        if (req.query.type) dbQuery.type = req.query.type.toLowerCase();

        
        if (req.query.category) dbQuery.category = { $regex: new RegExp(req.query.category, 'i') }; 

        
        if (req.query.date) {
            dbQuery.date = {
                $gte: new Date(`${req.query.date}T00:00:00.000Z`),
                $lte: new Date(`${req.query.date}T23:59:59.999Z`)
            };
        }

        //Sorting in descending order to get the newest transactions first
        const transactions = await Transaction.find(dbQuery).sort({_id : -1}).limit(limit+1);
        
        if(transactions.length === 0){
            return res.status(200).json({ success : false, message : 'Error (404) : No active transactions found after this cursor.'});
        }

        const nextCursor = (transactions.length == limit + 1)? transactions[transactions.length - 2]._id : null;
        if(transactions.length == limit + 1){
         transactions.pop();   
        } 
        return res.status(200).json({ 
            success: true, 
            nextCursor,
            message: 'Transactions fetched successfully.', 
            count: transactions.length, 
            transactions
        });

    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Data is provided in invalid format.' });
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};


export const updateTransaction = async (req, res) => {
    try {
        //Extract the transaction Id from the URL
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: 'Provide data to update.' });
        }

        if(!req.body.type && !req.body.category && !req.body.amount && !req.body.amount){
            return res.status(400).json({ success : false, message: 'Error : Request body does not contain any valid data to update.'});
        }

        //Some security checks to ensure data integrity
        delete req.body._id;
        delete req.body.isDeleted;
        delete req.body.date;
        delete req.body.user;

        if (req.body.category) {
            req.body.category = req.body.category.toLowerCase();
        }

        

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            {_id : id , isDeleted : false}, 
            req.body, 
            { returnDocument : 'after', runValidators: true } 
        );

        if (!updatedTransaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Transaction updated successfully.',
            data: updatedTransaction
        });

    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: error.message });
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid Transaction ID.' });
        
        
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};


export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTransaction = await Transaction.findOne({_id : id, isDeleted : false});

        if (!deletedTransaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found.' });
        }

        deletedTransaction.isDeleted = true;
        await deletedTransaction.save();

        return res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully.'
        });

    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid Transaction ID.' });
        
        
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};

//Additional useful route for future roles that are higher than admin -> it can be used to monitor admins by CEO OR help admins fetch it's own transactions, in a group of transactions
export const fetchAdminsTransaction = async (req,res) => {
    try{
        const adminId = req.params.id;

        const transactions = await Transaction.find({user : adminId, isDeleted : false});

        return res.status(200).json({ success : true,message : 'Transactions fetched successfully.', transactions});
    }catch(error){
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid Transaction ID.' });
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};