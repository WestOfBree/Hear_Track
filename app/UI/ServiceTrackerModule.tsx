'use client';
import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import LoadingState from "./LoadingState";
import { type ColumnKey, type PatientsByColumn } from "@/data/mockPatientData";
import {
  addRandomWithPatientToNewRepairs,
  COLUMN_CONFIG,
  EMPTY_COLUMNS,
  getInitialBoard,
  NEXT_COLUMN_BY_STAGE,
  STORAGE_KEY,
  type VisibleColumnKey,
  updatePatientColumn,
} from "./serviceTrackerUtils";

const HEADING_CONTAINER_CLASS = "Heading-Container gap-12 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5";
const PATIENT_LIST_CONTAINER_CLASS = "col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5";

export default function ServiceTrackerModule() {
  const [patientsByColumn, setPatientsByColumn] = useState<PatientsByColumn>(EMPTY_COLUMNS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPatientsByColumn(getInitialBoard());
      setIsLoading(false);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    try{
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patientsByColumn));
      } catch (error) {
        console.error("Error saving board data:", error);
      }
  }, [isLoading, patientsByColumn]);

  const onMoveToNextStage = (patientId: number, currentColumnKey: ColumnKey) => {
    const nextColumn = NEXT_COLUMN_BY_STAGE[currentColumnKey];
    setPatientsByColumn(prev => updatePatientColumn(prev, patientId, nextColumn));
  }

  const handleAddRandomPatient = () => {
    setPatientsByColumn((prevPatientsByColumn) => addRandomWithPatientToNewRepairs(prevPatientsByColumn));
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading service tracker board..."
        showSpinner
      />
    );
  }

  return (
    <>
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      onClick={handleAddRandomPatient}> Add Random Patient
      </button>
      <div className="flex w-[calc(100%-2rem)] flex-col items-center justify-center gap-4 border border-transparent sm:w-[calc(100%-4rem)]">
        <div className="Grid-Container flex gap-4 border-white sm:grid sm:grid-cols-3">
          {COLUMN_CONFIG.map((columnConfig) => (
            <div className={`col-${columnConfig.key}`} key={columnConfig.key}>
              <div className={HEADING_CONTAINER_CLASS}>
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                  {columnConfig.title}
                </h1>
              </div>
              <div className={PATIENT_LIST_CONTAINER_CLASS}>
                {(patientsByColumn[columnConfig.key] ?? []).map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    columnKey={columnConfig.key as VisibleColumnKey}
                    statusOptions={columnConfig.statusOptions}
                    moveToNextStage={onMoveToNextStage}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </>

  );
}
