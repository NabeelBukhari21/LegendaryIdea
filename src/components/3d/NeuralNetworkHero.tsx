"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const NETWORK_NODES = 40;
const CONNECTION_DISTANCE = 3.5;

function NetworkGraphic() {
    const groupRef = useRef<THREE.Group>(null);
    const nodesRef = useRef<THREE.InstancedMesh>(null);

    // Generate random node positions and floating connections around a sphere
    const { positions, lines } = useMemo(() => {
        const positions = new Float32Array(NETWORK_NODES * 3);
        const pts: THREE.Vector3[] = [];

        for (let i = 0; i < NETWORK_NODES; i++) {
            // Distribute on outer sphere
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 4 + Math.random() * 2; // radius between 4 and 6

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            pts.push(new THREE.Vector3(x, y, z));
        }

        const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                if (pts[i].distanceTo(pts[j]) < CONNECTION_DISTANCE) {
                    lines.push({ start: pts[i], end: pts[j] });
                }
            }
        }

        return { positions, lines };
    }, []);

    // Create a dummy object to set matrices for instanced mesh
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!nodesRef.current || !groupRef.current) return;

        // Slow majestic rotation
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

        // Pulse nodes
        const time = state.clock.elapsedTime;
        for (let i = 0; i < NETWORK_NODES; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            const scale = 1 + Math.sin(time * 2 + i) * 0.2;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            nodesRef.current.setMatrixAt(i, dummy.matrix);
        }
        nodesRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={groupRef}>
            {/* The glowing nodes */}
            <instancedMesh ref={nodesRef} args={[undefined, undefined, NETWORK_NODES]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
            </instancedMesh>

            {/* Glowing inner core */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[2, 32, 32]}>
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} wireframe />
                </Sphere>
            </Float>

            {/* Connections */}
            {lines.map((l, i) => (
                <Line
                    key={i}
                    points={[l.start, l.end]}
                    color="#3b82f6"
                    lineWidth={1}
                    transparent
                    opacity={0.15}
                />
            ))}
        </group>
    );
}

export default function NeuralNetworkHero() {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 mask-radial-fade">
            <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <NetworkGraphic />
            </Canvas>
        </div>
    );
}
