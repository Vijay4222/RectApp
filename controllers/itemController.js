const { Item } = require('../models/item');
const { Op } = require('sequelize');

exports.getAllItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const items = await Item.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        res.json({
            items: items.rows,
            totalItems: items.count,
            totalPages: Math.ceil(items.count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createItem = async (req, res) => {
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const item = await Item.create({
            name,
            description,
            starting_price,
            current_price: starting_price,
            end_time,
            image_url,
            createdAt: new Date()
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (req.user.role !== 'admin' && req.user.id !== item.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { name, description, starting_price, end_time } = req.body;
        item.name = name || item.name;
        item.description = description || item.description;
        item.starting_price = starting_price || item.starting_price;
        item.end_time = end_time || item.end_time;

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (req.user.role !== 'admin' && req.user.id !== item.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await item.destroy();
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
