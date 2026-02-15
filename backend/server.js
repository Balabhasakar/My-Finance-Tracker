const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Log requests to see the limit and offset in action
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' 
});

// 🚀 SCHEMA: text, amount, userId, category, and notes
const Transaction = sequelize.define('Transaction', {
  text: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Other' },
  notes: { type: DataTypes.TEXT, allowNull: true }
});

sequelize.sync().then(() => console.log("✅ Database Synced"));

// 🚀 UPDATED: GET route with Pagination (Limit & Offset)
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Read limit and offset from query parameters (e.g., ?limit=5&offset=0)
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await Transaction.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: limit,   // 🛑 Only fetch this many items
      offset: offset  // ⏩ Skip this many items
    });
    
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  console.log("📥 Backend Received:", req.body);
  try {
    const newTransaction = await Transaction.create(req.body);
    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      await transaction.update(req.body);
      res.json(transaction);
    } else {
      res.status(404).send("Transaction not found");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const result = await Transaction.destroy({ where: { id: req.params.id } });
    if (result) res.json({ message: "Deleted" });
    else res.status(404).json({ message: "ID not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));