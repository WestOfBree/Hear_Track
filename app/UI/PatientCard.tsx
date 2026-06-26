interface Patient {
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  currentDeviceRight: string;
  currentDeviceLeft: string;
  lastApptDate: string;
  nextApptDate: string;
  nextApptType: string;
  deviceStatusRight: string;
  deviceStatusLeft: string;
}

export default function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="flex h-64 w-80 flex-col gap-3 overflow-y-auto rounded-lg border border-zinc-100 bg-blue-50 p-6 text-left shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5">
      <div className="heading-container flex flex-col gap-2">
        <h2 className="wrap-break-word text-xl font-semibold ">
          {patient.name}
        </h2>
        
      </div>
      <div className="details-container flex flex-col gap-1">
        <p className="wrap-break-word text-sm text-zinc-600">
          Date of Birth: {patient.dateOfBirth}
        </p>
        </div>
    </div>
  );
}