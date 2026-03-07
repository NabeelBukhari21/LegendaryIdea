"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function AuditLog() {
    // In a real app this is fetched from the server.
    const fallbackAuditLog = [
        { id: "al1", timestamp: new Date(Date.now() - 3600000).toISOString(), action: "Session End Detected", dataType: "Telemetry", retention: "Standard", status: "retained" as const },
        { id: "al2", timestamp: new Date(Date.now() - 7200000).toISOString(), action: "Live Demo Active", dataType: "Video Feed", retention: "Discarded", status: "deleted" as const },
    ];
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusVariant = (status: string) => {
        switch (status) {
            case "retained": return "info" as const;
            case "deleted": return "success" as const;
            case "anonymized": return "warning" as const;
            default: return "default" as const;
        }
    };

    return (
        <Card className="animate-fade-in-up stagger-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground">Audit Log</h3>
                    <p className="text-sm text-muted">Complete data event history</p>
                </div>
                <Badge variant="info">
                    <span className="mr-1">⛓️</span> Solana Anchored
                </Badge>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="text-left py-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">Time</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">Data Type</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">Retention</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fallbackAuditLog.map((event) => (
                            <tr key={event.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 px-3 text-xs text-muted whitespace-nowrap">{formatDate(event.timestamp)}</td>
                                <td className="py-3 px-3 text-xs text-foreground">{event.action}</td>
                                <td className="py-3 px-3 text-xs text-muted">{event.dataType}</td>
                                <td className="py-3 px-3 text-xs text-muted">{event.retention}</td>
                                <td className="py-3 px-3">
                                    <Badge variant={statusVariant(event.status)} size="sm">
                                        {event.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
