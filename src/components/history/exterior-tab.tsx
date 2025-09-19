'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent} from "@/components/ui/card";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect} from "react";
import {formatTick, generateSeries} from "@/services/helpers";
import {ChartPoint} from "@/services/SupabaseService";
import {useSupabase} from "@/stores/SupabaseStore";

const TIMEFRAMES = {
    exterior: {
        "6h": {points: 60, mode: "h" as const},
        "1d": {points: 60, mode: "h" as const},
        "7d": {points: 60, mode: "d" as const},
        "1m": {points: 60, mode: "d" as const},
    },
};

export default function ExteriorTab() {

    const supabase = useSupabase((s) => s.service);
    const [extTf, setExtTf] = React.useState<keyof typeof TIMEFRAMES.exterior>("1d");
    const [exteriorSeries, setExteriorSeries] = React.useState([]);

    const fetchChartData = function (extTf) {
        const cfg = TIMEFRAMES.exterior[extTf];
        supabase.getBoilerChartData(extTf, {maxPoints: cfg.points}).then((raw: ChartPoint[]) => {
            const result = raw.map((d: ChartPoint) => ({
                time: cfg.mode === "h" ? formatTick(d.ts, "h") : formatTick(d.ts, "d"),
                value: d.value,
            }));
            console.log(result);
            setExteriorSeries(result);
        })
    }

    useEffect(() => {
        fetchChartData(extTf);
    }, [])

    return (
        <TabsContent value="exterior" className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Timeframe</span>
                <Select value={extTf}
                        onValueChange={(v) => fetchChartData(v as keyof typeof TIMEFRAMES.exterior)}>
                    <SelectTrigger className="w-40 rounded-lg">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(TIMEFRAMES.exterior).map((k) => (
                            <SelectItem key={k} value={k}>
                                {k}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card className="rounded-2xl">
                <CardContent className="pt-6">
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={exteriorSeries}
                                       margin={{left: 8, right: 8, top: 8, bottom: 8}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="time" tick={{fontSize: 12}} interval="preserveStartEnd"/>
                                <YAxis domain={[-15, 40]} tick={{fontSize: 12}} unit="°C"/>
                                <Tooltip formatter={(val) => `${val}°C`} labelClassName="text-xs"/>
                                <Line type="monotone" dataKey="value" strokeWidth={2} dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}