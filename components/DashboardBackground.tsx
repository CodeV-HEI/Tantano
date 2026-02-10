import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Mesh, Color, Group } from 'three';
import { useTheme } from '@/context/ThemeContext';

function Particles({ theme }: { theme: 'dark' | 'light' }) {
    const groupRef = useRef<Group>(null);
    const particles = Array.from({ length: 100 });

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    const colors = theme === 'dark'
        ? ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981']
        : ['#0891b2', '#7c3aed', '#db2777', '#059669'];

    return (
        <group ref={groupRef}>
            {particles.map((_, i) => {
                const angle = (i / particles.length) * Math.PI * 2;
                const radius = 5 + Math.random() * 10;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const z = (Math.random() - 0.5) * 20;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.05 + Math.random() * 0.1, 16, 16]} />
                        <meshBasicMaterial
                            color={new Color(colors[Math.floor(Math.random() * colors.length)])}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

function FloatingGeometry({ theme }: { theme: 'dark' | 'light' }) {
    const meshRef = useRef<Mesh>(null);
    const torusRef = useRef<Mesh>(null);
    const cubeRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            torusRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
        if (cubeRef.current) {
            cubeRef.current.rotation.x = state.clock.elapsedTime * 0.25;
            cubeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    const primaryColor = theme === 'dark' ? '#06b6d4' : '#0891b2';
    const secondaryColor = theme === 'dark' ? '#8b5cf6' : '#7c3aed';
    const accentColor = theme === 'dark' ? '#ec4899' : '#db2777';

    return (
        <>
            <mesh ref={meshRef} position={[-3, 2, -5]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                    color={new Color(primaryColor)}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>

            <mesh ref={torusRef} position={[4, -2, -8]}>
                <torusGeometry args={[1.5, 0.3, 16, 100]} />
                <meshBasicMaterial
                    color={new Color(secondaryColor)}
                    wireframe
                    transparent
                    opacity={0.2}
                />
            </mesh>

            <mesh ref={cubeRef} position={[0, -3, -10]}>
                <boxGeometry args={[1.8, 1.8, 1.8]} />
                <meshBasicMaterial
                    color={new Color(accentColor)}
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>
        </>
    );
}

function LightOrbs({ theme }: { theme: 'dark' | 'light' }) {
    const orbs = Array.from({ length: 8 });

    return (
        <group>
            {orbs.map((_, i) => {
                const angle = (i / orbs.length) * Math.PI * 2;
                const radius = 8;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const z = -15;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.3, 32, 32]} />
                        <meshBasicMaterial
                            color={new Color(theme === 'dark' ? '#06b6d4' : '#0891b2')}
                            transparent
                            opacity={0.1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

export default function Background() {
    const { theme } = useTheme();

    return (
        <Canvas
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
            }}
            camera={{ position: [0, 0, 5], fov: 75 }}
        >
            <color attach="background" args={[theme === 'dark' ? '#000000' : '#ffffff']} />
            <ambientLight intensity={0.5} />

            <Particles theme={theme} />
            <FloatingGeometry theme={theme} />
            <LightOrbs theme={theme} />
        </Canvas>
    );
}