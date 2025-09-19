'use client'

import {createClient} from '@supabase/supabase-js'
import {downsample, formatToLocalDate, rowToPoint, timeframeToRange} from "@/services/helpers";

export type LatestTemp = {
    temp: number
    created_at: string // ISO
}

export type ChartPoint = {
    ts: string // ISO timestamp
    value: number
}

export type ChartData = ChartPoint[]

export class SupabaseTempService {
    private constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        )
    }
    static create(): SupabaseTempService {
        return new SupabaseTempService();
    }
    private supabase;

    async getLatestBoilerTemp(): Promise<LatestTemp | null> {
        const { data, error } = await this.supabase
            .from('boiler_temp')
            .select('temp, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw new Error(`getLatestBoilerTemp: ${error.message}`)
        if (!data) return null
        return { temp: data.temp, created_at: data.created_at }
    }

    /** Get latest exterior (outside) temperature */
    async getLatestOutsideTemp(): Promise<LatestTemp | null> {
        const { data, error } = await this.supabase
            .from('outside_temp')
            .select('temp, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (error) throw new Error(`getLatestOutsideTemp: ${error.message}`)
        if (!data) return null
        return { temp: data.temp, created_at: data.created_at }
    }

    /** Get chart data for boiler by timeframe */
    async getBoilerChartData(timeframe: string, opts?: { maxPoints?: number }): Promise<ChartData> {
        const { from, to } = timeframeToRange(timeframe)

        const { data, error } = await this.supabase
            .from('boiler_temp')
            .select('created_at, temp')
            .gte('created_at', formatToLocalDate(from))
            .lte('created_at', formatToLocalDate(to))
            .order('created_at', { ascending: true })

        if (error) throw new Error(`getBoilerChartData: ${error.message}`)
        const points = (data ?? []).map(rowToPoint)
        return downsample(points, opts?.maxPoints ?? 500)
    }

    /** Get chart data for exterior by timeframe */
    async getOutsideChartData(timeframe: string, opts?: { maxPoints?: number }): Promise<ChartData> {
        const { from, to } = timeframeToRange(timeframe)

        const { data, error } = await this.supabase
            .from('outside_temp')
            .select('created_at, temp')
            .gte('created_at', formatToLocalDate(from))
            .lte('created_at', formatToLocalDate(to))
            .order('created_at', { ascending: true })

        if (error) throw new Error(`getOutsideChartData: ${error.message}`)
        const points = (data ?? []).map(rowToPoint)
        return downsample(points, opts?.maxPoints ?? 500)
    }
}
