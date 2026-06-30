import { createInvoiceDate, getMockPatientData, type ColumnKey, type MockPatient, type PatientsByColumn } from "@/data/mockPatientData";

export const STORAGE_KEY = "service-tracker-board";
export const VISIBLE_COLUMN_KEYS = ["new-repairs", "in-progress", "completed"] as const;
export type VisibleColumnKey = (typeof VISIBLE_COLUMN_KEYS)[number];
export type InvoiceAgeOption = 0 | 7 | 14;

export const NEXT_COLUMN_BY_STAGE: Record<ColumnKey, ColumnKey> = {
  "new-repairs": "in-progress",
  "in-progress": "completed",
  completed: "with-patient",
  "with-patient": "with-patient",
};

export const EMPTY_COLUMNS: PatientsByColumn = {
  "new-repairs": [],
  "in-progress": [],
  completed: [],
};

export const COLUMN_CONFIG: Array<{ key: VisibleColumnKey; title: string; statusOptions: string[] }> = [
  { key: "new-repairs", title: "New Repairs", statusOptions: ["New", "Order Created", "UPS Pickup"] },
  { key: "in-progress", title: "In Progress", statusOptions: ["In Transit", "Repair Received", "Repair In Progress"] },
  { key: "completed", title: "Completed", statusOptions: ["Received at Clinic", "Appointment Scheduled", "Repair Completed"] },
];

const hasActiveDeviceStatus = (patient: MockPatient) =>
  patient.deviceStatusLeft.toLowerCase() !== "with patient" ||
  patient.deviceStatusRight.toLowerCase() !== "with patient";

export const groupPatientsByColumn = (patients: MockPatient[]): PatientsByColumn =>
  patients.reduce<PatientsByColumn>((columns, patient) => {
    if (!hasActiveDeviceStatus(patient)) return columns;
    if (!VISIBLE_COLUMN_KEYS.includes(patient.columnKey as VisibleColumnKey)) return columns;

    const columnKey = patient.columnKey as ColumnKey;
    columns[columnKey] = [...columns[columnKey], patient];
    return columns;
  }, { ...EMPTY_COLUMNS });

export const getInitialBoard = (): PatientsByColumn => {
  const fallback = groupPatientsByColumn(getMockPatientData());

  if (typeof window === "undefined") return fallback;

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) return fallback;

    const parsedData = JSON.parse(rawData) as PatientsByColumn;
    const hasVisibleColumns = VISIBLE_COLUMN_KEYS.every((key) => Array.isArray(parsedData?.[key]));
    return hasVisibleColumns ? parsedData : fallback;
  } catch {
    return fallback;
  }
};

export const updatePatientColumn = (patientsByColumn: PatientsByColumn, patientId: number, newColumnKey: ColumnKey): PatientsByColumn => {
  const sourceColumn = (Object.keys(patientsByColumn) as ColumnKey[]).find((key) =>
    patientsByColumn[key].some((patient) => patient.id === patientId)
  );
  if (!sourceColumn) return patientsByColumn;

  const patient = patientsByColumn[sourceColumn].find((item) => item.id === patientId);
  if (!patient) return patientsByColumn;

  return {
    ...patientsByColumn,
    [sourceColumn]: patientsByColumn[sourceColumn].filter((item) => item.id !== patientId),
    [newColumnKey]: [...(patientsByColumn[newColumnKey] ?? []), { ...patient, columnKey: newColumnKey }],
  };
};

const getBalancedInvoiceAge = (patientsByColumn: PatientsByColumn): InvoiceAgeOption => {
  const ages: InvoiceAgeOption[] = [0, 7, 14];
  const dateByAge = Object.fromEntries(ages.map((age) => [age, createInvoiceDate(age)])) as Record<InvoiceAgeOption, string>;
  const counts = ages.reduce<Record<InvoiceAgeOption, number>>((acc, age) => ({ ...acc, [age]: 0 }), { 0: 0, 7: 0, 14: 0 });

  Object.values(patientsByColumn).flat().forEach((patient) => {
    ages.forEach((age) => {
      if (patient.invoiceDate === dateByAge[age]) counts[age] += 1;
    });
  });

  const min = Math.min(...ages.map((age) => counts[age]));
  const leastUsed = ages.filter((age) => counts[age] === min);
  return leastUsed[Math.floor(Math.random() * leastUsed.length)];
};

const toNewRepairsPatient = (patient: MockPatient, invoiceAge: InvoiceAgeOption): MockPatient => ({
  ...patient,
  columnKey: "new-repairs",
  invoiceDate: createInvoiceDate(invoiceAge),
});

const appendToNewRepairs = (patientsByColumn: PatientsByColumn, patient: MockPatient): PatientsByColumn => ({
  ...patientsByColumn,
  "new-repairs": [...(patientsByColumn["new-repairs"] ?? []), patient],
});

export const addRandomWithPatientToNewRepairs = (patientsByColumn: PatientsByColumn): PatientsByColumn => {
  const randomInvoiceAge = getBalancedInvoiceAge(patientsByColumn);
  const currentWithPatient = patientsByColumn["with-patient"] ?? [];

  if (currentWithPatient.length > 0) {
    const selectedBoardPatient = currentWithPatient[Math.floor(Math.random() * currentWithPatient.length)];
    const movedPatient = toNewRepairsPatient(selectedBoardPatient, randomInvoiceAge);

    return appendToNewRepairs(
      {
        ...patientsByColumn,
        "with-patient": currentWithPatient.filter((patient) => patient.id !== selectedBoardPatient.id),
      },
      movedPatient,
    );
  }

  const existingPatientIds = new Set(Object.values(patientsByColumn).flat().map((patient) => patient.id));
  const withPatientCandidates = getMockPatientData().filter(
    (patient) => patient.columnKey === "with-patient" && !existingPatientIds.has(patient.id),
  );
  if (withPatientCandidates.length === 0) return patientsByColumn;

  const selectedPatient = withPatientCandidates[Math.floor(Math.random() * withPatientCandidates.length)];
  return appendToNewRepairs(patientsByColumn, toNewRepairsPatient(selectedPatient, randomInvoiceAge));
};
