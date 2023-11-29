import * as React from 'react'
import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three'

export const RayCast: React.FC = () => {
  const { camera, mouse, raycaster, scene } = useThree()
  const [intersection, setIntersection] = useState(null)
  const sphereRef = useRef<Mesh>()

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const [intersect] = intersects
      setIntersection(intersect.point)
    } else {
      setIntersection(null)
    }
  })

  return intersection && (
    <mesh
      ref={sphereRef}
      position={intersection}
      args={[new SphereGeometry(0.1, 32, 32), new MeshBasicMaterial({ color: 'orange' })]}
    />
  )
}