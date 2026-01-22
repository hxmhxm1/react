'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const Page = () => {
  const init = () => {
    // 1. 获取 Canvas 元素
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement | null
    if (!canvas) return

    // 2. 创建场景 (Scene)
    const scene = new THREE.Scene()

    // 2.1 初始化 GUI
    const gui = new GUI()
    const debugObject = {
      wireframe: true
    }

    // 3. 模型加载器 (GLTFLoader)
    const gltfLoader = new GLTFLoader()
    let donut: THREE.Object3D | null = null

    // 4. 辅助线 (AxesHelper)
    // 辅助线可以帮助理解 3D 空间中的坐标轴方向
    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    // 加载甜甜圈模型
    // 注意：这里使用 /api/static 代理路径来绕过 Next.js 对 .gltf 文件的模块导入限制
    gltfLoader.setPath('/api/static/assets/donut/')
    gltfLoader.load(
      'scene.gltf',
      (gltf) => {
        donut = gltf.scene as THREE.Object3D
        
        // 更新模型线框模式的函数
        const updateWireframe = () => {
          if (!donut) return
          donut.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
              materials.forEach((m: THREE.Material) => {
                if ('wireframe' in m) {
                  ;(m as THREE.MeshStandardMaterial).wireframe = debugObject.wireframe
                }
              })
            }
          })
        }

        // 初始化线框状态
        updateWireframe()

        // 添加 GUI 控制
        gui.add(debugObject, 'wireframe')
          .name('显示线性')
          .onChange(updateWireframe)

        const radius = 8.5
        // 设置初始位置在屏幕右侧
        donut.position.x = 1.5
        // 设置模型缩放倍数
        donut.scale.set(radius, radius, radius)
        scene.add(donut)

      },
      undefined,
      (error) => { console.error('模型加载失败:', error) }
    )

    // 4. 灯光设置 (Lights)
    // 环境光：提供基础亮度，确保暗部不会完全变黑
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    // 平行光：模拟太阳光，产生阴影和立体感
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 2, 0)
    directionalLight.castShadow = true // 开启阴影投影
    scene.add(directionalLight)

    // 5. 视口大小设置
    const sizes = { width: window.innerWidth, height: window.innerHeight }

    // 6. 相机设置 (Camera)
    // 使用透视相机 (PerspectiveCamera)
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 5 // 相机后移，以便看清场景
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    // 7. 渲染器设置 (Renderer)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      antialias: true, // 开启抗锯齿
      alpha: true      // 开启背景透明
    })
    renderer.shadowMap.enabled = true // 开启阴影渲染
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置柔和阴影
    renderer.setSize(sizes.width, sizes.height)
    // 设置像素比，防止在高分屏上模糊
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 7.1 轨道控制器 (OrbitControls)
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true // 开启阻尼感（平滑旋转）
    controls.dampingFactor = 0.05
    // 限制缩放范围
    controls.minDistance = 2
    controls.maxDistance = 10
    // 限制旋转角度（可选）
    // controls.minPolarAngle = Math.PI / 4
    // controls.maxPolarAngle = Math.PI / 1.5

    // 8. 动画循环 (Animation Loop)
    const clock = new THREE.Clock()
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      if (donut) {
        // 设定基础倾斜角度，使其正面朝向屏幕并有立体感
        const baseRotationX = 0.8
        const baseRotationY = 0.8
        
        // 动态计算：基础角度 + 正弦波晃动，实现轻微的浮动效果
        donut.rotation.y = baseRotationY + Math.sin(elapsedTime * 0.4) * 0.1
        donut.rotation.x = baseRotationX + Math.sin(elapsedTime * 0.2) * 0.05
        // Y 轴位置动态浮动
        donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1
      }

      // 更新控制器（如果开启了 enableDamping，必须在每一帧调用）
      controls.update()

      // 执行渲染
      renderer.render(scene, camera)
      // 请求下一帧动画
      window.requestAnimationFrame(tick)
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
      })
    }
    tick()

    // 返回清理函数，销毁 GUI
    return () => {
      gui.destroy()
    }
  }

  useEffect(() => {
    const cleanup = init()
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <div className="h-full w-full flex bg-[#ffc0cb]">
      <div className="w-1/2 min-w-[320px] relative">
        <canvas className="webgl w-full h-full block"></canvas>
      </div>
    </div>
  )
}

export default Page
