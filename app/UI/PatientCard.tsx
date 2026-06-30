"use client";

import { useEffect, useMemo, useState } from "react";
import { MockPatient } from "@/data/mockPatientData";
import { ColumnKey } from "@/data/mockPatientData";

interface PatientCardProps {
  patient: MockPatient;
  columnKey: ColumnKey;
  statusOptions: string[];
  moveToNextStage: (patientId: number, columnKey: ColumnKey) => void;
}


export default function PatientCard({
  patient,
  columnKey,
  statusOptions,
  moveToNextStage,
}: PatientCardProps) {
  const invoiceDate = new Date(patient.invoiceDate);
  const currentDate = new Date();
  const daysSinceInvoice =
    (currentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);
  const isInvoiceOlderThanSevenDays = daysSinceInvoice > 7;
  const isInvoiceOlderThanFourteenDays = daysSinceInvoice > 14;
  const storageKey = useMemo(
    () => `patient-card-status:${columnKey}:${patient.id}`,
    [columnKey, patient.id],
  );
  const [selectedStatus, setSelectedStatus] = useState(
    () => {
      if (typeof window === "undefined") {
        return statusOptions[0] ?? "";
      }

      const savedValue = window.localStorage.getItem(storageKey);
      return savedValue && statusOptions.includes(savedValue)
        ? savedValue
        : (statusOptions[0] ?? "");
    },
  );

  useEffect(() => {
    const savedValue = window.localStorage.getItem(storageKey);

    if (savedValue && statusOptions.includes(savedValue)) {
      queueMicrotask(() => {
        setSelectedStatus(savedValue);
      });
    }
  }, [statusOptions, storageKey]);

  const safeSelectedStatus = statusOptions.includes(selectedStatus)
    ? selectedStatus
    : (statusOptions[0] ?? "");

  const handleStatusChange = (nextStatus: string) => {
    setSelectedStatus(nextStatus);
    window.localStorage.setItem(storageKey, nextStatus);
  };


  return (
    <div className="flex h-60 w-80 flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-100 bg-blue-50 p-6 text-left shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
      <div className="heading-container flex flex-col gap-2">
        <h2 className="wrap-break-word text-xl font-semibold ">
          {patient.name}
        </h2>
        
      </div>
      <div className="details-container flex flex-col gap-1">
        <p className="wrap-break-word text-sm text-zinc-600">
          Device out for repair: {patient.deviceStatusLeft || patient.deviceStatusRight !== "with patient" ? patient.currentDeviceRight : patient.currentDeviceLeft}
        </p>
        <p
          className={`wrap-break-word text-sm ${
            isInvoiceOlderThanFourteenDays
              ? "text-red-500"
              : isInvoiceOlderThanSevenDays
              ? "text-yellow-500"
              : "text-zinc-600"
          }`}
        >
          Order Created: {patient.invoiceDate}
        </p>
        <p className="wrap-break-word text-sm text-zinc-600">
          Loaners: 
          </p>
        <select
          className="wrap-break-word text-sm text-zinc-600"
          value={safeSelectedStatus}
          onChange={(event) => handleStatusChange(event.target.value)}
          aria-label={`${patient.name} status`}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
       
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              moveToNextStage(patient.id, columnKey);
            }}
          >
            Move to next stage
          </button>
        </div>
    </div>
  );
}