"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Button from '@/components/ui/Button';

// Define the architecture
const LAYERS = [
    { name: "Input", nodes: 3, x: -6, color: "#3b82f6" },     // Blue
    { name: "Hidden 1", nodes: 4, x: -2, color: "#8b5cf6" },  // Purple
    { name: "Hidden 2", nodes: 4, x: 2, color: "#8b5cf6" },   // Purple
    { name: "Output", nodes: 2, x: 6, color: "#f59e0b" },     // Orange
];

// Helper to generate node positions
function getLayerPositions() {
    const positions: { layer: number; index: number; pos: THREE.Vector3; color: string }[] = [];
    LAYERS.forEach((layer, l_idx) => {
        const spacing = 1.5;
        const startY = ((layer.nodes - 1) * spacing) / 2;
        for (let i = 0; i < layer.nodes; i++) {
            positions.push({
                layer: l_idx,
                index: i,
                pos: new THREE.Vector3(layer.x, startY - i * spacing, 0),
                color: layer.color
            });
        }
    });
    return positions;
}

// Global nodes
const ALL_NODES = getLayerPositions();

function NeuralNet() {
    const groupRef = useRef<THREE.Group>(null);
    const [step, setStep] = useState(0);

    // All connections
    const connections = useMemo(() => {
        const lines: { start: THREE.Vector3; end: THREE.Vector3; l1: number; l2: number }[] = [];
        for (let l = 0; l < LAYERS.length - 1; l++) {
            const currentLayerNodes = ALL_NODES.filter(n => n.layer === l);
            const nextLayerNodes = ALL_NODES.filter(n => n.layer === l + 1);

            currentLayerNodes.forEach(startNode => {
                nextLayerNodes.forEach(endNode => {
                    lines.push({
                        start: startNode.pos,
                        end: endNode.pos,
                        l1: l,
                        l2: l + 1
                    });
                });
            });
        }
        return lines;
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Slow horizontal breathing
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    // Step logic styling
    const getLineStyle = (l1: number) => {
        if (step === 0) return { opacity: 0.1, color: "#ffffff", weight: 1 };

        // Forward pass
        if (step === 1 && l1 <= 1) return { opacity: 0.8, color: "#4ade80", weight: 2 }; // Green active
        if (step === 2 && l1 <= 2) return { opacity: 0.8, color: "#4ade80", weight: 2 };

        // Error detection
        if (step === 3) return { opacity: 0.1, color: "#ffffff", weight: 1 };

        // Backward pass
        if (step === 4 && l1 === 2) return { opacity: 0.8, color: "#ef4444", weight: 3 }; // Red flowing back
        if (step === 5 && l1 >= 1) return { opacity: 0.8, color: "#ef4444", weight: 3 };
        if (step === 6) return { opacity: 0.8, color: "#ef4444", weight: 3 };
        if (step === 7) return { opacity: 0.4, color: "#f59e0b", weight: 2 }; // Adjusted weights (Orange)

        return { opacity: 0.1, color: "#ffffff", weight: 1 };
    };

    const getNodeScale = (layerIdx: number) => {
        if (step === 3 && layerIdx === 3) return 1.5; // Output nodes pulse big red
        return 1;
    };

    const getNodeColor = (defaultColor: string, layerIdx: number) => {
        if (step === 3 && layerIdx === 3) return "#ef4444"; // Error!
        if (step >= 4 && step <= 6) return "#ef4444"; // Passing error back
        if (step === 7) return "#f59e0b"; // Updated
        return defaultColor;
    };

    const stepsText = [
        "1. Architecture Overview: Look around. Information flows left to right.",
        "2. Forward Pass: Data enters the Input layer and travels forward.",
        "3. Forward Pass Complete: The Network makes a prediction.",
        "4. Error Calculation: The prediction was wrong. We calculate the difference (Loss).",
        "5. Backpropagation begins: The error (red) travels backwards to the hidden layer.",
        "6. Chain Rule in action: Error continues backward to adjust every contributing weight.",
        "7. Gradients reached input: The full chain of blame is mapped.",
        "8. Weights Updated: The network adjusts its lines (weights) to be more accurate next time."
    ];

    return (
        <>
            <group ref={groupRef}>
                {/* Connections */}
                {connections.map((conn, i) => {
                    const style = getLineStyle(conn.l1);
                    return (
                        <Line
                            key={i}
                            points={[conn.start, conn.end]}
                            color={style.color}
                            lineWidth={style.weight}
                            transparent
                            opacity={style.opacity}
                        />
                    );
                })}

                {/* Nodes */}
                {ALL_NODES.map((node, i) => (
                    <mesh key={i} position={node.pos}>
                        <sphereGeometry args={[0.3 * getNodeScale(node.layer), 32, 32]} />
                        <meshBasicMaterial
                            color={getNodeColor(node.color, node.layer)}
                            transparent
                            opacity={0.9}
                        />
                        {/* Fake glow */}
                        <mesh>
                            <sphereGeometry args={[0.45 * getNodeScale(node.layer), 16, 16]} />
                            <meshBasicMaterial color={getNodeColor(node.color, node.layer)} transparent opacity={0.2} wireframe />
                        </mesh>
                    </mesh>
                ))}

                {/* Layer Labels */}
                {LAYERS.map((layer, i) => (
                    <Html key={i} position={[layer.x, 3.5, 0]} center transform sprite zIndexRange={[100, 0]}>
                        <div className="bg-black/80 border border-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap backdrop-blur-md">
                            {layer.name}
                        </div>
                    </Html>
                ))}
            </group>

            {/* Stepper UI Overlay */}
            <Html position={[0, -4.5, 2]} center transform sprite>
                <div className="w-[600px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4">
                    <p className="text-lg font-bold text-center text-white min-h-[56px] flex items-center">
                        {stepsText[step]}
                    </p>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 7) * 100}%` }}
                        />
                    </div>
                    <div className="flex gap-4 w-full justify-between mt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                        >
                            ← Previous
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setStep(Math.min(7, step + 1))}
                            disabled={step === 7}
                        >
                            {step === 7 ? "Concept Recovered ✓" : "Next Step →"}
                        </Button>
                    </div>
                </div>
            </Html>
        </>
    );
}

export default function BackpropagationScene() {
    return (
        <div className="w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.5} />
                <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1.5} />

                <NeuralNet />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxDistance={25}
                    minDistance={3}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>

            {/* Hint overlay */}
            <div className="absolute top-24 right-6 glass-card p-3 text-xs text-muted pointer-events-none z-10 hidden sm:block">
                🖱️ Left Click: Rotate | 📜 Scroll: Zoom | 🖲️ Right Click: Pan
            </div>
        </div>
    );
}
