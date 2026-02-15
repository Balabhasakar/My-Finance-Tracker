import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SpendingChart from "./SpendingChart";

const Summary = ({ refreshTrigger, darkMode }) => {
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });
  const [categoryTotals, setCategoryTotals] = useState({});
  const [showChart, setShowChart] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTotals = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${user.uid}?limit=1000`);
        const transactions = await response.json();

        let inc = 0;
        let exp = 0;
        let categories = {};

        transactions.forEach((t) => {
          const amt = Number(t.amount);
          if (amt > 0) {
            inc += amt;
          } else {
            const absAmt = Math.abs(amt);
            exp += absAmt;
            const catName = t.category || "Other";
            if (!categories[catName]) {
              categories[catName] = { amount: 0 };
            }
            categories[catName].amount += absAmt;
          }
        });

        setTotals({ income: inc, expense: exp, balance: inc - exp });
        setCategoryTotals(categories);
      } catch (err) {
        console.error("Summary error:", err);
      }
    };
    fetchTotals();
  }, [user, refreshTrigger]);

  const styles = {
    balanceBox: { background: darkMode ? "#2a4365" : "#ebf5ff", padding: "15px", borderRadius: "10px" },
    incomeBox: { background: darkMode ? "#1c4532" : "#e6fffa", padding: "15px", borderRadius: "10px" },
    expenseBox: { background: darkMode ? "#63171b" : "#fff5f5", padding: "15px", borderRadius: "10px" },
    textMain: { color: darkMode ? "#ffffff" : "#000000", fontSize: "16px", fontWeight: "bold", margin: "5px 0 0 0" },
    categoryContainer: { marginTop: "20px", background: darkMode ? "#2d3748" : "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
    categoryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: darkMode ? "1px solid #4a5568" : "1px solid #edf2f7" },
    toggleBtn: {
      width: "100%", padding: "10px", marginTop: "15px", borderRadius: "10px", border: "none", 
      backgroundColor: darkMode ? "#4a5568" : "#edf2f7", color: darkMode ? "#fff" : "#2d3748",
      fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      gap: "8px", transition: "0.3s"
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", margin: "20px 0", textAlign: "center" }}>
        <div style={styles.balanceBox}>
          <h4 style={{ margin: 0, color: "#3182ce", fontSize: "10px", fontWeight: "800" }}>BALANCE</h4>
          <p style={{...styles.textMain, color: totals.balance >= 0 ? "#38a169" : "#e53e3e"}}>
            ${totals.balance.toFixed(2)}
          </p>
        </div>
        <div style={styles.incomeBox}>
          <h4 style={{ margin: 0, color: "#38a169", fontSize: "10px", fontWeight: "800" }}>INCOME</h4>
          <p style={styles.textMain}>+${totals.income.toFixed(2)}</p>
        </div>
        <div style={styles.expenseBox}>
          <h4 style={{ margin: 0, color: "#e53e3e", fontSize: "10px", fontWeight: "800" }}>EXPENSE</h4>
          <p style={styles.textMain}>-${totals.expense.toFixed(2)}</p>
        </div>
      </div>

      <button style={styles.toggleBtn} onClick={() => setShowChart(!showChart)}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {showChart ? "visibility_off" : "pie_chart"}
        </span>
        {showChart ? "Hide Analytics" : "Show Spending Chart"}
      </button>

      {showChart ? (
        <div style={{ animation: "fadeIn 0.5s" }}>
          <SpendingChart categoryTotals={categoryTotals} darkMode={darkMode} />
        </div>
      ) : (
        <div style={styles.categoryContainer}>
          <h4 style={{ margin: "0 0 15px 0", color: darkMode ? "#a0aec0" : "#718096", fontSize: "12px", fontWeight: "800", textTransform: "uppercase" }}>
            Spending Breakdown
          </h4>
          {Object.entries(categoryTotals).length === 0 ? <p>No expenses yet.</p> : 
            Object.entries(categoryTotals).map(([name, data]) => (
            <div key={name} style={styles.categoryRow}>
              <span style={{ color: darkMode ? "#e2e8f0" : "#2d3748", fontWeight: "500" }}>{name}</span>
              <span style={{ fontWeight: "bold", color: "#e53e3e" }}>-${data.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summary;