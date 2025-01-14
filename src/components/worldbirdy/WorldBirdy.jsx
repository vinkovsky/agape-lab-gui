import { Collider } from './collider/Collider'
import { useGLBLoader } from './glb-loader/useGLBLoader'
// import { WalkerGame } from '@/lib/walker/WalkerGame'
// import { Avatar } from '../Avatar/Avatar'
import { createPortal, useThree } from '@react-three/fiber'
import {
  CubeCamera,
  Environment,
  MeshRefractionMaterial,
  MeshTransMissionMaterial,
  MeshTransmissionMaterial,
  OrbitControls,
  useEnvironment,
} from '@react-three/drei'
// import { AvatarChaser } from '../AvatarChaser/AvatarChaser'
import { AvatarGuide } from './AvatarGuide'
import { useMemo } from 'react'
import { Object3D } from 'three'
import { Mouse3D } from './noodles/Noodle/Mouse3D'
// import { Noodle } from '@/content-vfx/Noodle/Noodle'
import { AvaZoom } from './AvaZoom'
import { BirdCamSync } from './BirdCamSync'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
// import { PlaneBufferGeometry } from 'three'
import { BoxBufferGeometry, DoubleSide } from 'three'
import { Mesh } from 'three'
import { MeshBasicMaterial } from 'three'
import { Color } from 'three'
// import { MeshReflectorMaterial } from '@react-three/drei'

export function WorldBirdy() {
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)

  let destObj = useMemo(() => {
    let dd = new Object3D()
    dd.position.y = 1.0
    return dd
  }, [])

  let clothes = [
    //
    `/2022/03/18/floor/xr/skycity/lok-dune.glb`,
    `/2022/03/18/floor/xr/skycity/lok-jacket.glb`,
    `/2022/03/18/floor/xr/skycity/lok-groom.glb`,
    `/2022/03/18/floor/xr/skycity/lok-dark-armor.glb`,
  ]

  let makeFollower = (collider, level = 3, aCore) => {
    if (level < 0) {
      return null
    }

    window.follow = aCore.player

    return (
      <AvatarGuide
        offset={[0.01, 1, 0]}
        chaseDist={1.2}
        speed={aCore.playerSpeed * 0.98}
        destObj={aCore.player}
        collider={collider}
        avatarUrl={clothes[level % clothes.length]}
        onACore={(aCore) => {
          return <group>{makeFollower(collider, level - 1, aCore)}</group>
        }}></AvatarGuide>
    )
  }

  let colliderScene = new Object3D() // clone(glb.scene)
  let floor = new Mesh(new BoxBufferGeometry(2000, 0.1, 2000), new MeshBasicMaterial({ color: new Color('#ffbaba') }))
  floor.position.y = -1

  //
  let querlo = useGLBLoader(`/2022/03/18/floor/xr/querlo.glb`)

  colliderScene.add(floor)
  colliderScene.traverse((it) => {
    if (it.name === 'ground') {
      it.visible = false
    }
  })

  let cloneQuerlo = clone(querlo.scene)
  colliderScene.add(cloneQuerlo)

  let querlo2 = {
    scene: clone(querlo.scene),
  }
  querlo2.scene.position.x += 50
  colliderScene.add(querlo2.scene)

  let querlo3 = {
    scene: clone(querlo.scene),
  }
  querlo3.scene.position.x -= 50
  colliderScene.add(querlo3.scene)

  let island = cloneQuerlo.getObjectByName('island')

  /*

    <MeshTransmissionMaterial
            {...{
              transmissionSampler: false,
              samples: 5,
              resolution: 512,
              transmission: 1,
              roughness: 0.3,
              thickness: 2.5,
              ior: 1.5,
              chromaticAberration: 0.26,
              anisotropy: 0.3,
              distortion: 0.3,
              distortionScale: 0.3,
              temporalDistortion: 0.5,
              attenuationDistance: 0.5,
              attenuationColor: '#ffffff',
              color: '#ffffff',
              side: DoubleSide,
            }}
          ></MeshTransmissionMaterial>*/
  // let tex = useEnvironment({ preset: 'apartment' })

  return (
    <group>
      <primitive object={cloneQuerlo}></primitive>
      <primitive object={querlo2.scene}> </primitive>
      <primitive object={querlo3.scene}> </primitive>

      {/* {island &&
        createPortal(
          <MeshRefractionMaterial
            side={DoubleSide}
            envMap={tex}
            bounces={5}
            ior={1.4}
            fresnel={0.1}
            aberrationStrength={0.1}
            color={'#ffffff'}
            fastChroma={true}
          ></MeshRefractionMaterial>,
          island
        )} */}

      <OrbitControls
        args={[camera, gl.domElement]}
        makeDefault
        enableRotate={false}
        enablePan={false}
        object-position={[0, 20, 40]}
        target={[0, 0, 0]}></OrbitControls>

      {/* <gridHelper
        rotation-y={Math.PI * 0.25}
        args={[300, 100, '#8F6A1A', '#8F6A1A']}
      /> */}
      <Collider
        scene={colliderScene}
        onReady={(collider) => {
          return (
            <group>
              {/* <primitive object={colliderScene}></primitive> */}
              <group
              // onClick={(ev) => {
              //   console.log(ev.object?.name)
              // }}
              >
                {/* <primitive object={showGLB}></primitive> */}
              </group>

              <AvatarGuide
                offset={[0, 2, 2]}
                chaseDist={1}
                speed={2}
                destObj={destObj}
                collider={collider}
                avatarUrl={`/2022/03/18/floor/xr/skycity/lok-dune.glb`}
                onACore={(aCore) => {
                  return (
                    <group>
                      <BirdCamSync player={aCore.player}></BirdCamSync>

                      {makeFollower(collider, 5, aCore)}
                    </group>
                  )
                }}></AvatarGuide>

              {/*  */}
              <Mouse3D collider={collider} mouse3d={destObj}></Mouse3D>

              {/*  */}
              <AvaZoom mouse3d={destObj}></AvaZoom>

              {/*  */}
              {/* <Noodle mouse3d={destObj}></Noodle> */}
            </group>
          )
        }}></Collider>

      <Environment preset='apartment' background></Environment>
    </group>
  )
}
