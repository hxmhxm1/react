'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const Page = () => {
  const init = () => {
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement | null
    if (!canvas) return
    

    const scene = new THREE.Scene()

    const gltfLoader = new GLTFLoader()

    

    let donut: THREE.Object3D | null = null

    gltfLoader.setPath('/api/static/assets/donut/')
    gltfLoader.load(
      'scene.gltf',
      (gltf) => {
        donut = gltf.scene as THREE.Object3D
        const radius = 8.5
        donut.position.x = 1.5
        donut.scale.set(radius, radius, radius)
        scene.add(donut)
      },
      undefined,
      (error) => { console.error(error) }
    )

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 2, 0)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const sizes = { width: window.innerWidth, height: window.innerHeight }
    

    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 5
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const clock = new THREE.Clock()
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      if (donut) {
        // 设定基础倾斜角度，使其正面朝向屏幕并有立体感
        const baseRotationX = 0.8
        const baseRotationY = 0.8
        
        donut.rotation.y = baseRotationY + Math.sin(elapsedTime * 0.4) * 0.1
        donut.rotation.x = baseRotationX + Math.sin(elapsedTime * 0.2) * 0.05
        donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1
      }
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()

    
  }

  useEffect(() => { init() }, [])

  return (
    <div className="h-full w-full flex bg-[#ffc0cb]">
      <div className="w-1/2 min-w-[320px] relative">
        <canvas className="webgl w-full h-full block"></canvas>
      </div>
    </div>
  )
}

export default Page
