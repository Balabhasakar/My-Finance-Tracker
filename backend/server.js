const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 🚀 SMART DATABASE CONNECTION
// If DATABASE_URL exists (Production/Render), use Postgres. Else, use SQLite.
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Required for Render/Supabase
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite' 
    });

// 🚀 SCHEMA
const Transaction = sequelize.define('Transaction', {
  text: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Other' },
  notes: { type: DataTypes.TEXT, allowNull: true }
});

sequelize.sync().then(() => console.log("✅ Database Synced"));

// --- API ROUTES ---

app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 5; 
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await Transaction.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
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

// 🚀 DYNAMIC PORT FOR DEPLOYMENT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));