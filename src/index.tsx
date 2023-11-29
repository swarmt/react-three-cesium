import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import './styles.css';
import { TilesRenderer } from '3d-tiles-renderer';
import { OrbitControls } from '@react-three/drei';

interface TilesProps {
  url: string;
}

const Tiles: React.FC<TilesProps> = ({ url }) => {
  const { camera, gl, scene } = useThree();
  const tilesRendererRef = useRef<TilesRenderer>();

  useEffect(() => {
    const tilesRenderer = new TilesRenderer(url);
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);
    tilesRenderer.fetchOptions.mode = 'cors';
    tilesRenderer.errorTarget = 12;
    tilesRenderer.group.rotation.set(Math.PI / 2, 0, 0);

    scene.add(tilesRenderer.group);

    tilesRendererRef.current = tilesRenderer;

    return () => {
      scene.remove(tilesRenderer.group);
    };
  }, [url, camera, gl, scene]);

  useFrame(() => {
    if (!tilesRendererRef.current) return;
    const tilesRenderer = tilesRendererRef.current as TilesRenderer;
    camera.updateMatrixWorld();
    tilesRenderer.update();
  });

  return null;
};

ReactDOM.render(
  <Canvas>
    <color attach="background" args={['#202025']} />
    <Tiles url="https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json" />
    <OrbitControls />
  </Canvas>,
  document.getElementById('root')
);
