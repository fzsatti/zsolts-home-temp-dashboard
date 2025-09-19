'use client'

import React, {useEffect} from "react";
import { motion } from "framer-motion";

import TempCard from "@/components/temp-card";
import History from "@/components/history/history";
import {LatestTemp, SupabaseTempService} from "@/services/SupabaseService";
import {useSupabase} from "@/stores/SupabaseStore";

export default function Home() {
    const supabase = useSupabase((s) => s.service);
    const [exteriorTemp, setExteriorTemp] = React.useState<LatestTemp>({created_at: "", temp: 0});
    const [boilerTemp, setBoilerTemp] = React.useState<LatestTemp>({created_at: "", temp: 0});

    useEffect(() => {
        supabase.getLatestBoilerTemp().then((data: LatestTemp) => setBoilerTemp(data));
        supabase.getLatestOutsideTemp().then((data: LatestTemp) => setExteriorTemp(data));
    }, [supabase]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Home Temperatures</h1>
                        <p className="text-sm text-muted-foreground">Realtime overview & history for boiler and outdoor sensors</p>
                    </div>
                </motion.div>

                {/* Top cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <TempCard title={"Boiler temperature"} currentTemp={boilerTemp} icon={"boiler"}></TempCard>
                    <TempCard title={"Outside temperature"} currentTemp={exteriorTemp} icon={"outside"}></TempCard>
                </div>

                <History />
            </div>
        </div>
    );
}

/*
USAGE NOTES
- This is a single-file React component ready for a Next.js + Tailwind + shadcn/ui project.
- Ensure shadcn/ui components (card, tabs, select, collapsible, button) are installed and exported from @/components/ui/*.
- recharts and framer-motion should be installed: `npm i recharts framer-motion`.
- Replace the demo data with your live API data and set current temps accordingly.
*/
