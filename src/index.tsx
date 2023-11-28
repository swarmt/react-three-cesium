import * as React from 'react'
import { useEffect, useRef } from 'react'
import * as ReactDOM from 'react-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './styles.css'
import { TilesRenderer } from '3d-tiles-renderer'
import { OrbitControls } from '@react-three/drei'

const Tiles = (): null => {
  const { camera, gl, scene } = useThree()
  const tilesRendererRef = useRef<TilesRenderer>()

  useEffect(() => {
    const tilesRenderer = new TilesRenderer('https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json')
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);
    tilesRenderer.fetchOptions.mode = 'cors';
    tilesRenderer.lruCache.minSize = 900;
    tilesRenderer.lruCache.maxSize = 1300;
    tilesRenderer.errorTarget = 12;

    scene.add(tilesRenderer.group);

    tilesRendererRef.current = tilesRenderer;

    return () => {
      scene.remove(tilesRenderer.group);
    };
  })

  useFrame(() => {
    if (!tilesRendererRef.current) return
    const tilesRenderer = tilesRendererRef.current as TilesRenderer;
    camera.updateMatrixWorld();
    tilesRenderer.update();
  })

  return null
}

ReactDOM.render(
  <Canvas>
    <Tiles />
    <OrbitControls />
  </Canvas>,
  document.getElementById('root')
)
