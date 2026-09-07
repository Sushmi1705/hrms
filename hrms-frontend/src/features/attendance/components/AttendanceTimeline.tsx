import * as React from "react"
import { Clock, MapPin, MonitorSmartphone, Camera } from "lucide-react"

interface TimelineEvent {
    time: string;
    label: string;
    location?: string;
    device?: string;
    photo?: string;
    type: 'in' | 'out' | 'break';
}

export function AttendanceTimeline({ events }: { events: TimelineEvent[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Today's Timeline</h3>
            <div className="relative border-l border-muted-foreground/30 ml-3 space-y-6">
                {events.map((ev, i) => (
                    <div key={i} className="relative pl-6">
                        <span className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{ev.label} - {ev.time}</span>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                {ev.location && <><MapPin className="h-3 w-3" /> {ev.location}</>}
                                {ev.device && <><MonitorSmartphone className="h-3 w-3" /> {ev.device}</>}
                                {ev.photo && <><Camera className="h-3 w-3" /> Captured</>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
