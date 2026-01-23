'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Page = () => {
  const init = () => {
    // 1. 获取 Canvas 元素
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement | null
    if (!canvas) return

    // 2. 创建场景 (Scene)
    const scene = new THREE.Scene()

    // 2.1 初始化 GUI
    const gui = new GUI()
    gui.close() // 默认关闭
    const debugObject = {
      wireframe: true
    }

    // 3. 模型加载器 (GLTFLoader)
    const gltfLoader = new GLTFLoader()
    let donut: THREE.Object3D | null = null

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
        // 设置初始位置
        donut.position.x = 0
        // 设置模型缩放倍数
        donut.scale.set(radius, radius, radius)
        scene.add(donut)

      },
      undefined,
      (error) => { console.error('模型加载失败:', error) }
    )

    // 4. 灯光设置 (Lights)
    // 环境光：提供基础亮度，确保暗部不会完全变黑
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    // 平行光：模拟太阳光，产生阴影和立体感
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(2, 4, 1)
    directionalLight.castShadow = true // 开启阴影投影
    scene.add(directionalLight)

    // 5. 视口大小设置
    const getCanvasSize = () => {
      const parent = canvas.parentElement
      return {
        width: parent?.clientWidth || window.innerWidth,
        height: parent?.clientHeight || window.innerHeight
      }
    }
    let sizes = getCanvasSize()

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
    }

    const handleResize = () => {
      sizes = getCanvasSize()
      
      // 更新相机
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // 更新渲染器
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)
    tick()

    // 返回清理函数，销毁 GUI 和事件监听
    return () => {
      gui.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }

  useEffect(() => {
    const cleanup = init()
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#fdf2f8] overflow-x-hidden relative font-sans text-[#4a2c2c]">
      {/* 背景装饰 */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] lg:w-[40%] h-[40%] bg-[#fee2e2] rounded-full blur-[80px] lg:blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] lg:w-[40%] h-[40%] bg-[#fae8ff] rounded-full blur-[80px] lg:blur-[100px] opacity-50 pointer-events-none"></div>

      {/* 左侧文字内容 */}
      <div className="w-full lg:w-1/2 min-h-[60vh] lg:h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 z-10 relative py-20 lg:py-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4 lg:mb-6">
            <div className="h-[1px] w-8 lg:w-12 bg-[#ec4899]"></div>
            <span className="text-[#ec4899] font-bold tracking-[0.2em] text-xs lg:text-sm uppercase">Sweet Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 lg:mb-6 leading-[0.9] tracking-tighter">
            THE<br />
            <span className="text-[#ec4899]">DONUT</span><br />
            STUDIO
          </h1>
          
          <p className="text-lg lg:text-xl text-[#7c5d5d] mb-8 lg:mb-10 max-w-md leading-relaxed">
            学习three.js，记录学习过程。
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8">
            <Button size="lg" className="w-full sm:w-auto bg-[#ec4899] hover:bg-[#db2777] text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg shadow-pink-200 transition-all hover:scale-105 active:scale-95 group">
              内容记录
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#fbcfe8] flex items-center justify-center overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 右侧 3D 区域 */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative cursor-grab active:cursor-grabbing bg-transparent">
        <canvas className="webgl w-full h-full block"></canvas>
        
        {/* 交互提示 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 flex items-center gap-3 text-[#9d7d7d]"
        >
          <span className="text-[10px] lg:text-xs font-medium uppercase tracking-[0.2em]">Drag to Rotate</span>
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-[#e5e7eb] flex items-center justify-center animate-bounce">
            <div className="w-1 h-2 bg-[#ec4899] rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Page
