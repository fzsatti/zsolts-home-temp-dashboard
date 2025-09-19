'use client'

import {ChartData, ChartPoint} from "@/services/SupabaseService";

export function formatToLocalDate(date: Date) {
    return new Intl.DateTimeFormat("ISO", {
        timeZone: "Europe/Bucharest", // set your timezone
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
}

export function formatTick(ts: string, mode: "h" | "d") {
    const input = ts.replace(/\.(\d{3})\d+$/, '.$1');
    const d = new Date(input);
    return mode === "h"
        ? d.toLocaleTimeString(undefined, {hour: "2-digit", minute: "2-digit"})
        : d.toLocaleDateString(undefined, {day: "numeric", hour: "2-digit"});
}

export function formatCreatedAt(cratedAt: string | undefined) {
    if (!cratedAt) {
        return '-';
    }
    const input = cratedAt.replace(/\.(\d{3})\d+$/, '.$1');
    const date = new Date(input);
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export function subNow(duration: { hours?: number; days?: number, months?: number }): Date {
    const d = new Date()
    if (duration.hours) d.setHours(d.getHours() - duration.hours)
    if (duration.days) d.setDate(d.getDate() - duration.days)
    if (duration.months) d.setDate(d.getMonth() - duration.months)
    return d
}

export function timeframeToRange(tf: string): { from: Date; to: Date } {
    const to = new Date()
    let from: Date = new Date();

    switch (tf) {
        case "1h":
            from = subNow({hours: 1});
            break;
        case "2h":
            from = subNow({hours: 2});
            break;
        case "6h":
            from = subNow({hours: 6});
            break;
        case "12h":
            from = subNow({hours: 12});
            break;
        case "1d":
            from = subNow({days: 1});
            break;
        case "7d":
            from = subNow({days: 7});
            break;
        case "1m":
            from = subNow({months: 1});
            break;
        default:
            console.log("Unknown timeframe", tf);
            break;
    }
    return {from: from, to: to}
}

export function downsample(points: ChartData, maxPoints = 500): ChartData {
    if (points.length <= maxPoints) return points
    const step = Math.ceil(points.length / maxPoints)
    const acc: ChartData = []
    for (let i = 0; i < points.length; i += step) acc.push(points[i])
    return acc
}

export function rowToPoint(row: { created_at: string; temp: number }): ChartPoint {
    return { ts: row.created_at, value: row.temp }
}