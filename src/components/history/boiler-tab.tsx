'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect} from "react";
import {formatTick} from "@/services/helpers";
import {useSupabase} from "@/stores/SupabaseStore";
import {ChartPoint} from "@/services/SupabaseService";

const TIMEFRAMES = {
    boiler: {
        "1h": {points: 48, mode: "h" as const},
        "2h": {points: 56, mode: "h" as const},
        "6h": {points: 60, mode: "h" as const},
        "12h": {points: 60, mode: "h" as const},
        "1d": {points: 60, mode: "h" as const},
    }
};

export default function BoilerTab() {
    const supabase = useSupabase((s) => s.service);

    const [boilerTf, setBoilerTf] = React.useState<keyof typeof TIMEFRAMES.boiler>("6h");
    const [boilerSeries, setBoilerSeries] = React.useState<{ time: string, value: number }[]>([]);

    const fetchChartData = function (boilerTf: keyof typeof TIMEFRAMES.boiler) {
        setBoilerTf(boilerTf);
        const cfg = TIMEFRAMES.boiler[boilerTf];
        supabase.getBoilerChartData(boilerTf, {maxPoints: cfg.points}).then((raw: ChartPoint[]) => {
            const result = raw.map((d: ChartPoint) => ({
                time: cfg.mode === "h" ? formatTick(d.ts, "h") : formatTick(d.ts, "d"),
                value: d.value,
            }));
            setBoilerSeries(result);
        })
    }

    useEffect(() => {
        fetchChartData(boilerTf);
    }, [])

    return (
        <TabsContent value="boiler" className="mt-4 space-y-3">
            <div className="w-full lg:w-1/4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Timeframe</span>
                <Select value={boilerTf}
                        onValueChange={(v) => fetchChartData(v as keyof typeof TIMEFRAMES.boiler)}>
                    <SelectTrigger className="w-40 rounded-lg">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(TIMEFRAMES.boiler).map((k) => (
                            <SelectItem key={k} value={k}>
                                {k}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" aspect={2}>
                    <LineChart data={boilerSeries} margin={{left: 0, right: 0, top: 4, bottom: 4}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="time" tick={{fontSize: 12}} interval="preserveStartEnd" angle={-45} textAnchor="end" height={60}/>
                        <YAxis tick={{fontSize: 12}} unit="°C"/>
                        <Tooltip formatter={(val) => `${val}°C`} labelClassName="text-xs"/>
                        <Line type="monotone" dataKey="value" strokeWidth={2} dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </TabsContent>
    );
}