'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import '@/style/home.css'

const Page = () => {
  const init = () => {
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement | null
    if (!canvas) return
    const gsap = ((window as unknown as { gsap?: { to: (...args: unknown[]) => unknown } }).gsap)

    const loadingBarElement = document.querySelector('.loading-bar') as HTMLElement | null
    const bodyElement = document.querySelector('body') as HTMLElement | null

    const scene = new THREE.Scene()

    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const overlayMaterial = new THREE.ShaderMaterial({
      vertexShader: `void main(){gl_Position=vec4(position,1.0);}`,
      fragmentShader: `uniform float uAlpha;void main(){gl_FragColor=vec4(0.0,0.0,0.0,uAlpha);}`,
      uniforms: { uAlpha: { value: 1.0 } },
      transparent: true
    })
    const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
    scene.add(overlay)

    const loadingManager = new THREE.LoadingManager(
      () => {
        window.setTimeout(() => {
          if (gsap) {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
          } else {
            overlayMaterial.uniforms.uAlpha.value = 0
          }
          loadingBarElement?.classList.add('ended')
          bodyElement?.classList.add('loaded')
          if (loadingBarElement) loadingBarElement.style.transform = ''
        }, 500)
      },
      (_itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        if (loadingBarElement) loadingBarElement.style.transform = `scaleX(${progressRatio})`
      },
      () => {}
    )

    const gltfLoader = new GLTFLoader(loadingManager)

    const textureLoader = new THREE.TextureLoader()
    const alphaShadow = textureLoader.load('/api/static/assets/texture/simpleShadow.jpg')

    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({ transparent: true, color: 0x000000, opacity: 0.5, alphaMap: alphaShadow })
    )
    sphereShadow.rotation.x = -Math.PI * 0.5
    sphereShadow.position.y = -1
    sphereShadow.position.x = 1.5
    scene.add(sphereShadow)

    let donut: THREE.Object3D | null = null

    gltfLoader.setPath('/api/static/assets/donut/')
    gltfLoader.load(
      'scene.gltf',
      (gltf) => {
        donut = gltf.scene as THREE.Object3D
        const radius = 8.5
        donut.position.x = 1.5
        donut.rotation.x = Math.PI * 0.2
        donut.rotation.z = Math.PI * 0.15
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
    let currentSection = 0
    const transformDonut = [
      { rotationZ: 0.45, positionX: 1.5 },
      { rotationZ: -0.45, positionX: -1.5 },
      { rotationZ: 0.0314, positionX: 0 },
      { rotationZ: 0.0314, positionX: 0 },
    ]
    window.addEventListener('scroll', () => {
      const newSection = Math.round(window.scrollY / sizes.height)
      if (newSection !== currentSection) {
        currentSection = newSection
        if (donut && gsap) {
          gsap.to(donut.rotation, { duration: 1.5, ease: 'power2.inOut', z: transformDonut[currentSection].rotationZ })
          gsap.to(donut.position, { duration: 1.5, ease: 'power2.inOut', x: transformDonut[currentSection].positionX })
          gsap.to(sphereShadow.position, { duration: 1.5, ease: 'power2.inOut', x: transformDonut[currentSection].positionX - 0.2 })
        }
      }
    })

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
        donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1
        ;(sphereShadow.material as THREE.MeshBasicMaterial).opacity = (1 - Math.abs(donut.position.y)) * 0.3
      }
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()

    window.onbeforeunload = () => { window.scrollTo(0, 0) }
  }

  useEffect(() => { init() }, [])

  return (
    <div className="h-full w-full flex">
      <div className="w-1/2 min-w-[320px] border-black/10 relative">
        <canvas className="webgl w-full h-full block"></canvas>
        <div className="loading-bar absolute left-0 top-0 h-1 w-full origin-left"></div>
      </div>
    </div>
  )
}

export default Page
