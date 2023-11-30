import * as React from 'react'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { DebugTilesRenderer } from '3d-tiles-renderer'
import { Mesh, ShaderMaterial } from 'three'
import { slopeShader } from './shaders'

interface TilesProps {
  url: string;
  showTraversability: boolean;
}

export const Tiles: React.FC<TilesProps> = ({ url, showTraversability }) => {
  const { camera, gl, scene } = useThree()
  const tilesRef = useRef<DebugTilesRenderer | null>(null)

  useEffect(() => {
    initialize()
    return () => cleanup()
  }, [url, camera, gl, scene])

  const initialize = () => {
    const tiles = new DebugTilesRenderer(url)
    tilesRef.current = tiles
    tiles.displayBoxBounds = false
    tiles.setCamera(camera)
    tiles.setResolutionFromRenderer(camera, gl)
    tiles.fetchOptions.mode = 'cors'
    tiles.errorTarget = 12
    tiles.group.rotation.set(Math.PI / 2, 0, 0)
    scene.add(tiles.group)

    if (showTraversability) {
      const material = new ShaderMaterial(slopeShader)
      tiles.onLoadModel = (scene, tile) => {
        scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.material = material
          }
        })
      }
    }
  }

  const cleanup = () => {
    if (tilesRef.current) {
      scene.remove(tilesRef.current.group)
    }
  }

  useFrame(() => {
    tilesRef.current?.update()
    camera.updateMatrixWorld()
  })

  return null
}
