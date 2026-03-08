import React from 'react';
import BackpropagationScene from '@/components/3d/BackpropagationScene';
import Button from '@/components/ui/Button';

export default function ImmersiveLearningPage() {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-background overflow-hidden z-[100]">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 pointer-events-none">
                <div className="pointer-events-auto">
                    <Button href="/student" variant="ghost" size="sm" className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10">
                        ← Exit Immersive Mode
                    </Button>
                </div>

                <div className="pointer-events-auto text-right">
                    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                        <span className="text-xl">🧠</span>
                        <div>
                            <p className="text-xs text-muted uppercase tracking-wider font-bold">Concept Recovery</p>
                            <h1 className="text-sm font-bold text-foreground">Advanced Backpropagation</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Scene */}
            <BackpropagationScene />
        </div>
    );
}
