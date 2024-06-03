const { Bid, Item, User, Notification } = require('../models');

exports.getBidsByItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const bids = await Bid.findAll({
            where: { item_id: itemId },
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.placeBid = async (req, res) => {
    const { itemId } = req.params;
    const { bid_amount } = req.body;
    const userId = req.user.id;

    try {
        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (bid_amount <= item.current_price) {
            return res.status(400).json({ error: 'Bid amount must be higher than the current price' });
        }

        item.current_price = bid_amount;
        await item.save();

        const bid = await Bid.create({
            item_id: itemId,
            user_id: userId,
            bid_amount,
        });

        const notification = await Notification.create({
            user_id: item.user_id,
            message: `Your item "${item.name}" has received a new bid of ${bid_amount}.`,
        });

        res.json({ message: 'Bid placed successfully', bid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
