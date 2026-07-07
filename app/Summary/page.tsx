"use client";

import ProtectedRoute from "../UI/ProtectedRoute";

export default function Summary() {
  return (
    <ProtectedRoute>
      <main>
        <div className="chart-container">
          <div> Repairs in need of attention</div>
          <div> Loaners in need of attention</div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
