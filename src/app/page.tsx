'use client'

import React from "react";
import {AuthGate} from "@/components/atuh-gate";
import Dashboard from "@/components/dashboard";

export default function Home() {
    return (
        <AuthGate>
            <Dashboard/>
        </AuthGate>
    );
}


