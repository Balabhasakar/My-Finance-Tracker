import React, { useState } from "react";

const TransactionList = ({ transactions = [], onTransactionDeleted, onEditClick, darkMode, onLoadMore, hasMore }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const getIconName = (category, text) => {
    const cat = category?.toLowerCase() || "";
    const desc = text?.toLowerCase() || "";
    const combined = `${cat} ${desc}`;

    if (cat === "salary") return "payments";
    if (cat === "housing") return "home";
    if (cat === "transport") return "local_gas_station";
    if (cat === "bills") return "receipt_long";
    if (cat === "dairy") return "water_drop";
    if (cat === "food") return "restaurant";

    if (combined.includes("hike") || combined.includes("bonus") || combined.includes("income")) return "payments";
    if (combined.includes("rent") || combined.includes("house")) return "home";
    if (combined.includes("gym") || combined.includes("fitness") || combined.includes("workout")) return "fitness_center";
    if (combined.includes("petrol") || combined.includes("fuel") || combined.includes("bike")) return "local_gas_station";
    if (combined.includes("dress") || combined.includes("cloth") || combined.includes("shopping")) return "shopping_bag";
    if (combined.includes("milk") || combined.includes("dairy")) return "water_drop";
    if (combined.includes("food") || combined.includes("tiffin") || combined.includes("eat")) return "restaurant";
    
    return "account_balance_wallet"; 
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredTransactions = transactions?.filter((t) => {
    const matchesSearch = t.text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) onTransactionDeleted();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="text" placeholder="Search..." value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            flex: 2, padding: "12px", borderRadius: "10px", border: "1px solid #ddd", 
            background: darkMode ? "#2d3748" : "#fff", color: darkMode ? "#fff" : "#000",
            outline: "none", width: '100%'
          }}
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ 
            flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #ddd", 
            background: darkMode ? "#2d3748" : "#fff", color: darkMode ? "#fff" : "#000",
            cursor: "pointer", width: '100%'
          }}
        >
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Dairy">Dairy</option>
          <option value="Bills">Bills</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
           <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.3 }}>search_off</span>
           <p>No transactions found.</p>
        </div>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTransactions.map((t) => {
              const isIncome = Number(t.amount) > 0;
              return (
                <li key={t.id} style={{ 
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: darkMode ? "#2d3748" : "#fff", padding: "12px", margin: "10px 0", borderRadius: "12px",
                  borderLeft: `6px solid ${isIncome ? '#38a169' : '#e53e3e'}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  gap: "10px" // 🚀 Prevents items from touching
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <span className="material-symbols-outlined" style={{ 
                      fontSize: '20px', 
                      color: isIncome ? '#38a169' : '#e53e3e',
                      background: isIncome ? '#f0fff4' : '#fff5f5',
                      padding: '8px', borderRadius: '10px', flexShrink: 0
                    }}>
                      {getIconName(t.category, t.text)}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: "700", 
                        color: darkMode ? "#fff" : "#2d3748", 
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis" // 🚀 Cuts long text with "..."
                      }}>
                        {t.text}
                      </div>
                      <div style={{ fontSize: "10px", color: "#718096" }}>
                        {t.category}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ 
                      fontWeight: "800", 
                      color: isIncome ? "#38a169" : "#e53e3e", 
                      fontSize: '13px', // 🚀 Smaller font for mobile
                      whiteSpace: 'nowrap' 
                    }}>
                      {isIncome ? `+$${Number(t.amount).toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}
                    </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => onEditClick(t)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: '16px' }}>✏️</button>
                      <button onClick={() => handleDelete(t.id)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: '16px' }}>🗑️</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
               <button 
                 onClick={onLoadMore}
                 style={{
                   padding: '10px 25px', borderRadius: '30px', border: '2px solid #3182ce',
                   background: 'transparent', color: '#3182ce', cursor: 'pointer', fontWeight: 'bold'
                 }}
               >
                 Load More
               </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;