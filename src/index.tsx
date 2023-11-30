import * as React from 'react'
import { Suspense } from 'react'
import * as ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'
import './styles.css'
import { Bvh, OrbitControls } from '@react-three/drei'
import { Tiles } from './tiles'
import { Robot } from './robot'
import { Loader } from './loader'


ReactDOM.render(
  <Canvas>
    <color attach='background' args={['#a0522d']} />
    <ambientLight intensity={0.5} />
    <directionalLight color='#ffa07a' position={[5, 5, 5]} intensity={0.7} />
    <fog attach='fog' args={['#a0522d', 10, 50]} />
      <Bvh firstHitOnly enabled={true} />
    <Tiles
      url='https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json'
      showTraversability={false}
    />
    <OrbitControls />
    <Suspense fallback={<Loader />}>
      <Robot />
    </Suspense>
  </Canvas>,
  document.getElementById('root')
)
