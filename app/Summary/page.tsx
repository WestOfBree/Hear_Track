"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../UI/ProtectedRoute";
import { getInitialBoard, type PatientsByColumn, type Patient } from "../UI/serviceTrackerUtils";

// Small helper: treat any device status that mentions "repair" as an item in repair
const isStatusRepair = (status?: string) => typeof status === "string" && /repair/i.test(status);

const daysSince = (isoDate?: string) => {
  if (!isoDate) return 0;
  const then = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export default function Summary() {
  const [board, setBoard] = useState<PatientsByColumn>({} as PatientsByColumn);

  useEffect(() => {
    // read board from local storage (or fallback) on client
    setBoard(getInitialBoard());
  }, []);

  const { redCount, yellowCount, totalInRepair } = useMemo(() => {
    let red = 0;
    let yellow = 0;
    let total = 0;

    (Object.values(board).flat() as Patient[]).forEach((patient) => {
      const invoiceAge = daysSince(patient.invoiceDate);

      // count right device
      if (isStatusRepair(patient.deviceStatusRight)) {
        total += 1;
        if (invoiceAge > 14) red += 1;
        else if (invoiceAge > 7) yellow += 1;
      }

      // count left device
      if (isStatusRepair(patient.deviceStatusLeft)) {
        total += 1;
        if (invoiceAge > 14) red += 1;
        else if (invoiceAge > 7) yellow += 1;
      }
    });

    return { redCount: red, yellowCount: yellow, totalInRepair: total };
  }, [board]);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Repairs summary</h1>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-center">
            <h2 className="text-sm font-medium text-red-700">Red (over 14 days)</h2>
            <p className="mt-2 text-3xl font-bold text-red-800" aria-live="polite">{redCount}</p>
            <p className="mt-1 text-sm text-red-600">Items in repair older than 14 days</p>
          </div>

          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center">
            <h2 className="text-sm font-medium text-yellow-700">Yellow (over 7 days)</h2>
            <p className="mt-2 text-3xl font-bold text-yellow-800" aria-live="polite">{yellowCount}</p>
            <p className="mt-1 text-sm text-yellow-600">Items in repair older than 7 days</p>
          </div>

          <div className="rounded-lg border border-slate-300 bg-slate-50 p-4 text-center">
            <h2 className="text-sm font-medium text-slate-700">Total in repair</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900" aria-live="polite">{totalInRepair}</p>
            <p className="mt-1 text-sm text-slate-600">Total devices currently marked as in repair</p>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="mb-2 text-lg font-medium">Notes</h3>
          <ul className="list-inside list-disc text-sm text-slate-600">
            <li>Counts are calculated per-device (left and right) using the patient&apos;s invoice date.</li>
            <li>Invoice age is calculated from the patient.invoiceDate field present in the mock data.</li>
          </ul>
        </section>
      </main>
    </ProtectedRoute>
  );
}
