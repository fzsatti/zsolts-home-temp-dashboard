'use client'

import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Collapsible, CollapsibleTrigger, CollapsibleContent,} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import React from "react";
import {ChevronDown} from "lucide-react";
import BoilerTab from "@/components/history/boiler-tab";
import ExteriorTab from "@/components/history/exterior-tab";

export default function History() {

    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [tab, setTab] = React.useState<"boiler" | "exterior">("boiler");

    return (
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full lg:w-1/4 rounded-xl">
                        <ChevronDown
                            className={`mr-2 h-4 w-4 transition-transform ${historyOpen ? "rotate-180" : ""}`}/>
                        History
                    </Button>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4 space-y-">
                <Tabs value={tab} onValueChange={(v) => setTab(v as "boiler" | "exterior")} className="w-full">
                    <TabsList className="rounded-xl w-full lg:w-1/4">
                        <TabsTrigger value="boiler" className="rounded-lg">Boiler</TabsTrigger>
                        <TabsTrigger value="exterior" className="rounded-lg">Exterior</TabsTrigger>
                    </TabsList>
                    <BoilerTab />
                    <ExteriorTab />
                </Tabs>
            </CollapsibleContent>
        </Collapsible>
    )
}