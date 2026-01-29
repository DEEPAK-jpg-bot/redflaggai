
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisLog } from '@/lib/forensicEngine';
import { Terminal, ShieldAlert, CheckCircle2, Activity, Search } from 'lucide-react';

interface LiveAnalysisFeedProps {
    logs: AnalysisLog[];
    isScanning: boolean;
    progress: number;
}

const LiveAnalysisFeed: React.FC<LiveAnalysisFeedProps> = ({ logs, isScanning, progress }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="w-full rounded-xl border border-border bg-black/95 text-green-500 font-mono shadow-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold tracking-wider">FORENSIC_ENGINE_V1.0</span>
                </div>
                <div className="flex items-center gap-3">
                    {isScanning && (
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-400 animate-pulse">LIVE FEED</span>
                        </div>
                    )}
                    <span className="text-xs text-zinc-500">{(progress).toFixed(1)}%</span>
                </div>
            </div>

            {/* Log Feed */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-1.5">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-start gap-3 p-2 rounded border-l-2 ${log.type === 'danger' ? 'bg-red-950/30 border-red-500 text-red-200' :
                                        log.type === 'warning' ? 'bg-yellow-950/30 border-yellow-500 text-yellow-200' :
                                            log.type === 'success' ? 'bg-green-950/30 border-green-500 text-green-200' :
                                                'bg-zinc-900/50 border-zinc-700 text-zinc-400'
                                    }`}
                            >
                                <div className="mt-1">
                                    {log.type === 'danger' ? <ShieldAlert className="w-4 h-4 text-red-500" /> :
                                        log.type === 'warning' ? <Search className="w-4 h-4 text-yellow-500" /> :
                                            log.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                                                <Activity className="w-4 h-4 text-zinc-600" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] uppercase opacity-70">
                                            {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).concat(`.${log.timestamp.getMilliseconds()}`)}
                                        </span>
                                        {log.rowNumber && (
                                            <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-400">ROW {log.rowNumber}</span>
                                        )}
                                    </div>
                                    <p className="text-xs leading-relaxed break-words font-medium">{log.message}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {/* Invisible element to scroll to */}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Footer / Status Bar */}
            <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
                <div>MEM: 48MB / THREADS: 4 / NETWORK: SECURE</div>
                <div>GEMINI_FLASH_1.5: {isScanning ? 'CONNECTED' : 'STANDBY'}</div>
            </div>
        </div>
    );
};

export default LiveAnalysisFeed;
