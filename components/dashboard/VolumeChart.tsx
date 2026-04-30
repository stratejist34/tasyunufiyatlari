"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VOLUME_DATA } from "@/lib/data/marketData";

export default function VolumeChart() {
  return (
    <div className="h-[300px] w-full mt-4 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={VOLUME_DATA}>
          <defs>
            <linearGradient id="colorM2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c69e54" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c69e54" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
            itemStyle={{ color: '#c69e54' }}
          />
          <Area 
            type="monotone" 
            dataKey="m2" 
            stroke="#c69e54" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorM2)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}