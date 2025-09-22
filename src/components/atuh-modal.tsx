'use client'

import * as React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {AlertCircle} from 'lucide-react'
import {SUPABASE_STORAGE_KEY} from "@/services/SupabaseService";
import {useSupabase} from "@/stores/SupabaseStore";

export function AuthModal(props: { trigger?: React.ReactNode; onAuthed?: () => void }) {
    const [open, setOpen] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const supabase = useSupabase((s) => s.service);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)


        const {data, error} = await supabase.supabase.auth.signInWithPassword({email, password})


        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

// Supabase client already persisted the session in localStorage under SUPABASE_STORAGE_KEY
// If you explicitly want to expose the access token separately, you *could* store it too:
        try {
            const accessToken = data.session?.access_token
            if (accessToken) {
                localStorage.setItem(`${SUPABASE_STORAGE_KEY}__access_token`, accessToken)
            }
        } catch {
        }


        setLoading(false)
        setOpen(false)
        props.onAuthed?.()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.trigger ?? (
                    <Button variant="default" className="rounded-xl">Sign in</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Sign in to view temperatures</DialogTitle>
                    <DialogDescription>
                        Enter your Supabase email & password. Your session is securely stored in your browser.
                    </DialogDescription>
                </DialogHeader>


                <form onSubmit={handleLogin} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    {error && (
                        <div
                            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                            <AlertCircle className="h-4 w-4"/>
                            <span className="text-destructive">{error}</span>
                        </div>
                    )}


                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading} className="rounded-xl">
                            {loading ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}