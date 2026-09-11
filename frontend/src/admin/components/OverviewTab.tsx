import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldAlert, ShieldCheck } from 'lucide-react';
import { type LeadStatsResponse } from '../types';
import { fetchWithAuth } from '../../utils/apiClient';

interface OverviewTabProps {
  leadStats: LeadStatsResponse | null;
  userRole?: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ leadStats, userRole }) => {
  const [userStats, setUserStats] = useState<{ admin: number; super_admin: number } | null>(null);

  useEffect(() => {
    if (userRole === 'super_admin') {
      const fetchUserStats = async () => {
        try {
          const res = await fetchWithAuth('/api/users/stats');
          const data = await res.json();
          if (res.ok && data.success) {
            setUserStats(data.stats);
          }
        } catch (err) {
          console.error("Failed to fetch user stats", err);
        }
      };
      fetchUserStats();
    }
  }, [userRole]);

  const overviewStats = [
    { label: 'Total Leads', value: leadStats?.stats?.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Apps', value: leadStats?.stats?.NEW || 0, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  if (userRole === 'super_admin' && userStats) {
    overviewStats.push(
      { label: 'Total Admins', value: userStats.admin, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Super Admins', value: userStats.super_admin, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' }
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {overviewStats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-sm ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
