import * as React from 'react'
import { useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Euler, Object3D, Quaternion, Raycaster, Scene, Vector3 } from 'three'

const useTerrainAdjustedMovement = (scene: Scene, raycaster: Raycaster) => {
  return (position: Vector3) => {
    const rayPosition = new Vector3()
    const rayDirection = new Vector3(0, -1, 0)
    rayPosition.set(position.x, 100, position.z)
    raycaster.set(rayPosition, rayDirection)
    const tilesGroup = scene.getObjectByName('TilesRenderer.TilesGroup')

    if (!tilesGroup) {
      return { position, normal: new Vector3(0, 1, 0) }
    }

    const intersects = raycaster.intersectObject(tilesGroup, true)
    if (intersects.length === 0) {
      return { position, normal: new Vector3(0, 1, 0) }
    }

    const normal = intersects[0].face.normal.clone().transformDirection(intersects[0].object.matrixWorld)
    return { position: intersects[0].point, normal }
  }
}

export const Robot = () => {
  const gltf = useLoader(GLTFLoader, '/Perseverance.glb')
  const modelRef = useRef<Object3D>(null)
  const { scene, raycaster } = useThree()

  const [position, setPosition] = useState(new Vector3())
  const [rotation, setRotation] = useState(new Euler())

  const shiftToTerrain = useTerrainAdjustedMovement(scene, raycaster)

  const move = () => {
    const speed = 0.005
    const turnRate = 0.1
    const turnChance = 0.5

    setPosition(prevPos => {
      const newPos = prevPos.clone().add(new Vector3(
        Math.sin(rotation.y) * speed,
        0,
        Math.cos(rotation.y) * speed
      ))

      const { position: terrainAdjustedPos, normal } = shiftToTerrain(newPos)
      const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), normal)
      setRotation(new Euler().setFromQuaternion(quaternion))

      return terrainAdjustedPos
    })

    if (Math.random() < turnChance) {
      setRotation(prevRot => new Euler(0, prevRot.y + (Math.random() - 0.5) * turnRate, 0))
    }
  }

  useFrame(() => {
    move()
    if (modelRef.current) {
      modelRef.current.position.copy(position)
      modelRef.current.rotation.copy(rotation)
    }
  })

  return <primitive ref={modelRef} object={gltf.scene} />
}
