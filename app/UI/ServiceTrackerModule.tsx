import PatientCard from "./PatientCard";
import MockPatientData from "@/data/MockPatientData.json";

export default function ServiceTrackerModule() {
  return (
      <div className="flex w-[calc(100%-2rem)] flex-col items-center justify-center gap-4 border border-transparent sm:w-[calc(100%-4rem)]">
        <div className="Grid-Container flex gap-4 border-white sm:grid sm:grid-cols-3">
          <div className="col-1">
            <div className="Heading-Container gap-12 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                New Repairs{" "}
              </h1>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
            </div>
          </div>

          <div className="col-2">
            <div className="Heading-Container gap-12 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                In Progress
              </h1>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
            </div>
          </div>

            <div className="col-3">
            <div className="Heading-Container gap-12 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                Completed
              </h1>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center gap-4 rounded-lg border border-(--border) bg-(--surface) p-8 text-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
              <PatientCard patient={MockPatientData[0]} />
            </div>
          </div>
        </div>
      </div>

  );
}
