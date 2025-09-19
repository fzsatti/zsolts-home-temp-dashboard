'use client'

import { create } from 'zustand';
import {SupabaseTempService} from "@/services/SupabaseService";

type SupabaseState = {
    service: SupabaseTempService;
};

export const useSupabase = create<SupabaseState>(() => ({
    service: SupabaseTempService.create()
}));

