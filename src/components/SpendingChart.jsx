import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SpendingChart = ({ categoryTotals, darkMode }) => {
  // 📊 Transform the object { Food: {amount: 50} } into an array [{ name: 'Food', value: 50 }]
  const data = Object.entries(categoryTotals).map(([name, data]) => ({
    name: name,
    value: data.amount
  }));

  // 🎨 Professional Color Palette
  const COLORS = ['#3182ce', '#38a169', '#e53e3e', '#805ad5', '#ecc94b', '#ed64a6', '#00b5d8'];

  return (
    <div style={{ 
      height: 300, 
      width: '100%', 
      background: darkMode ? "#2d3748" : "#fff", 
      padding: "20px", 
      borderRadius: "15px", 
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      marginTop: "20px"
    }}>
      <h4 style={{ 
        margin: "0 0 10px 0", 
        fontSize: "12px", 
        color: darkMode ? "#a0aec0" : "#718096",
        textAlign: "center" 
      }}>EXPENSE DISTRIBUTION</h4>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#2d3748' : '#fff', 
              border: 'none', 
              borderRadius: '10px',
              color: darkMode ? '#fff' : '#000' 
            }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;