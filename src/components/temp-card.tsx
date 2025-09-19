'use client'

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Sun, Thermometer} from "lucide-react";
import {motion} from "framer-motion";
import React from "react";
import {formatCreatedAt} from "@/services/helpers";
import {LatestTemp} from "@/services/SupabaseService";

;

export default function TempCard({title, icon, currentTemp}: { title: string, icon: string, currentTemp: LatestTemp | null }) {
    return (
        <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay: 0.05}}>
            <Card className="rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {icon === 'boiler' && <Thermometer className="h-5 w-5 text-muted-foreground"/>}
                    {icon === 'outside' && <Sun className="h-5 w-5 text-muted-foreground"/>}
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold leading-none">{currentTemp?.temp.toFixed(1)}°C</span>
                        <span className="text-sm text-muted-foreground">{formatCreatedAt(currentTemp?.created_at)}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}