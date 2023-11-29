import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TilesRenderer } from '3d-tiles-renderer';

interface TilesProps {
  url: string;
}

export const Tiles: React.FC<TilesProps> = ({ url }) => {
  const { camera, gl, scene } = useThree();
  const tilesRendererRef = useRef<TilesRenderer | null>(null);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [url, camera, gl, scene]);

  const initialize = () => {
    const tilesRenderer = new TilesRenderer(url);
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);
    tilesRenderer.fetchOptions.mode = 'cors';
    tilesRenderer.errorTarget = 12;
    tilesRenderer.group.rotation.set(Math.PI / 2, 0, 0);

    scene.add(tilesRenderer.group);
    tilesRendererRef.current = tilesRenderer;
  };

  const cleanup = () => {
    if (tilesRendererRef.current) {
      scene.remove(tilesRendererRef.current.group);
    }
  };

  useFrame(() => {
    tilesRendererRef.current?.update();
    camera.updateMatrixWorld();
  });

  return null;
};
