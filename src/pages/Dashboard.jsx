import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Summary from "../components/Summary";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5; 

  const fetchTransactions = useCallback(async (isInitial = false) => {
    if (!user) return;
    const currentOffset = isInitial ? 0 : offset;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${user.uid}?limit=${limit}&offset=${currentOffset}`);
      const data = await response.json();

      if (isInitial) {
        setTransactions(data);
        setOffset(data.length);
        setHasMore(data.length === limit); 
      } else {
        setTransactions(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
        setHasMore(data.length === limit);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [user, offset]);

  useEffect(() => {
    fetchTransactions(true);
  }, [user, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try { await logout(); navigate("/login"); } 
    catch (error) { console.error("Logout failed", error); }
  };

  const themeContainer = {
    backgroundColor: darkMode ? "#1a202c" : "#f7fafc",
    color: darkMode ? "#f7fafc" : "#1a202c",
    minHeight: "100vh", padding: "20px", fontFamily: "sans-serif", transition: "all 0.3s ease",
  };

  return (
    <div style={themeContainer}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontWeight: "800", letterSpacing: "-1px" }}>MyFinance Tracker</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={toggleDarkMode} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>{darkMode ? "☀️" : "🌙"}</button>
            <button onClick={handleLogout} style={{ backgroundColor: "#ff4757", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Logout</button>
          </div>
        </header>

        {user ? (
          <>
            <Summary refreshTrigger={refreshTrigger} darkMode={darkMode} />
            <div style={{ background: darkMode ? "#2d3748" : "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
              <p style={{ marginTop: 0, fontSize: "14px", opacity: 0.8 }}>Logged in as: <strong>{user.displayName || user.email}</strong></p>
              <TransactionForm onTransactionAdded={handleRefresh} editData={editData} setEditData={setEditData} />
            </div>

            <TransactionList 
              transactions={transactions} 
              onTransactionDeleted={handleRefresh} 
              onEditClick={(t) => { setEditData(t); window.scrollTo(0,0); }}
              darkMode={darkMode}
              onLoadMore={() => fetchTransactions(false)}
              hasMore={hasMore}
            />
          </>
        ) : (
          <div style={{ textAlign: "center" }}><button onClick={() => navigate("/login")}>Login</button></div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;