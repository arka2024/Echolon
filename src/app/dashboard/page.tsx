'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        console.log("API Data:", data); // debug

        setTotalUsers(data.totalUsers); // ✅ IMPORTANT
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 md:ml-64 p-6 mt-16 lg:mt-20">

        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Farmers */}
          <div className="p-6 rounded-2xl bg-secondary shadow">
            <h2>Total Farmers</h2>
            <p className="text-3xl">
              {totalUsers !== null ? totalUsers : "Loading..."}
            </p>
          </div>

          {/* Accuracy */}
          <div className="p-6 rounded-2xl bg-secondary shadow">
            <h2>Yield Accuracy</h2>
            <p className="text-3xl">98%</p>
          </div>

          {/* Revenue */}
          <div className="p-6 rounded-2xl bg-secondary shadow">
            <h2>Revenue</h2>
            <p className="text-3xl">₹24 Cr</p>
          </div>

        </div>

      </div>
    </div>
  );
}