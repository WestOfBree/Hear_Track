"use client";

import ServiceTrackerModule from "../UI/ServiceTrackerModule";
import ProtectedRoute from "../UI/ProtectedRoute";

export default function RepairTracker() {
    return (
        <ProtectedRoute>
            <div>
                <ServiceTrackerModule />
            </div>
        </ProtectedRoute>
    );
}