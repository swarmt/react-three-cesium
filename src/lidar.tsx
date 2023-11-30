import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SphereGeometry,
  Vector3
} from 'three'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as React from 'react'

export const Lidar: React.FC = () => {
  const { scene, raycaster } = useThree();
  const lidarRef = useRef<Mesh>(null);
  const raysRef = useRef<Array<Line>>([]);

  useEffect(() => {
    if (!lidarRef.current) return;

    const material = new LineBasicMaterial({ color: 0xff0000 });
    for (let i = 0; i < 16; i++) {
      const geometry = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]);
      const line = new Line(geometry, material);
      lidarRef.current.add(line);
      raysRef.current.push(line);
    }

    return () => {
      raysRef.current.forEach((line) => {
        if (lidarRef.current) lidarRef.current.remove(line);
        line.geometry.dispose();
      });
    };
  }, [scene]);

  useFrame(() => {
    if (lidarRef.current) {
      lidarRef.current.rotation.y += 1;
    }

    const verticalFOV = 30; // degrees
    const halfFOV = verticalFOV / 2;
    const numRays = raysRef.current.length;
    const distance = 10;

    raysRef.current.forEach((ray, index) => {
      const angle = ((index / (numRays - 1)) * verticalFOV - halfFOV) * Math.PI / 180;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      ray.geometry = new BufferGeometry().setFromPoints([new Vector3(), new Vector3(0, y, x)]);
    });
  });

  return (
    <mesh
      ref={lidarRef}
      position={[0, 0.5, 0]}
    >
    </mesh>
  );
};
