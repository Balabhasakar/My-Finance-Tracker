import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TransactionForm = ({ onTransactionAdded, editData, setEditData }) => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense"); 
  const { user } = useAuth();

  useEffect(() => {
    if (editData) {
      setText(editData.text);
      setCategory(editData.category || "Food");
      setAmount(Math.abs(editData.amount)); 
      setType(editData.amount >= 0 ? "income" : "expense");
    }
  }, [editData]);

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    if (selectedType === "income") {
      setCategory("Salary");
    } else {
      setCategory("Food");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const finalAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const method = editData ? "PUT" : "POST";
    const url = editData 
      ? `${import.meta.env.VITE_API_URL}/transactions/${editData.id}` 
      : `${import.meta.env.VITE_API_URL}/transactions`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          text,
          amount: finalAmount,
          category,
        }),
      });

      if (response.ok) {
        setText(""); 
        setAmount(""); 
        setCategory("Food"); 
        setType("expense");
        if (editData) setEditData(null);
        if (onTransactionAdded) onTransactionAdded();
      }
    } catch (err) { console.error("Form error:", err); }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button 
          type="button"
          onClick={() => handleTypeChange("income")}
          style={{ 
            flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', 
            background: type === 'income' ? '#38a169' : '#ddd', 
            color: 'white', fontWeight: 'bold', transition: '0.3s' 
          }}
        >
          Income (+)
        </button>
        <button 
          type="button"
          onClick={() => handleTypeChange("expense")}
          style={{ 
            flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', 
            background: type === 'expense' ? '#e53e3e' : '#ddd', 
            color: 'white', fontWeight: 'bold', transition: '0.3s' 
          }}
        >
          Expense (-)
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" placeholder="What is this for?" value={text} 
            onChange={(e) => setText(e.target.value)} 
            style={{ flex: 2, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} 
          />
          <input 
            type="number" placeholder="Amount" value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} 
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
          >
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Dairy">Dairy</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
          
          <button 
            type="submit" 
            style={{ 
              flex: 1, backgroundColor: "#3182ce", color: "white", border: "none", 
              padding: "12px", borderRadius: "10px", fontWeight: 'bold', cursor: "pointer" 
            }}
          >
            {editData ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;