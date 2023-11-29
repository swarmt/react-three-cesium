import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'
import './styles.css'
import { Bvh, OrbitControls } from '@react-three/drei'
import { Tiles } from './tiles'
import { RayCast } from './rayCast'

ReactDOM.render(
  <Canvas>
    <color attach="background" args={['#202025']} />
    <Tiles url="https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json" />
    <RayCast />
    <OrbitControls />
    <Bvh firstHitOnly enabled={true} />
  </Canvas>,
  document.getElementById('root')
);
