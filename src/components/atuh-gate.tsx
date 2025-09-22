'use client'

import { useEffect, useState } from 'react'
import {useSupabase} from "@/stores/SupabaseStore";
import {AuthModal} from "@/components/atuh-modal";

export function AuthGate(props: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false)
    const [authed, setAuthed] = useState(false)
    const supabase = useSupabase((s) => s.service);


    useEffect(() => {
        let mounted = true
        supabase.supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return
            setAuthed(Boolean(data.session))
            setReady(true)
        })


        const { data: sub } = supabase.supabase.auth.onAuthStateChange((_event, session) => {
            setAuthed(Boolean(session))
        })


        return () => {
            mounted = false
            sub.subscription.unsubscribe()
        }
    }, [])


    if (!ready) {
        return (
            <div className="grid place-items-center h-40 text-sm text-muted-foreground">Checking session…</div>
        )
    }


    if (!authed) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border p-8">
                <p className="text-sm text-muted-foreground">You must sign in to view temperature data.</p>
                <AuthModal onAuthed={() => setAuthed(true)} />
            </div>
        )
    }


    return <>{props.children}</>
}