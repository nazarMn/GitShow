import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';

import './ContributionChart.css';

export default function ContributionsChart({ contributions }) {
  return (
    <div className="contributionsChart">
      <h3>Статистика активності</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={contributions} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#82ca9d" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#82ca9d" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis domain={[0, 'dataMax + 3']} stroke="#ccc" />
          <Tooltip />
          <Area
            type="natural"
            dataKey="count"
            stroke="#82ca9d"
            fill="url(#colorGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#82ca9d", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
