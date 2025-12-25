// app/admin/write/page.tsx
export default function WritePage() {
  return (
    <div className="pt-20 h-screen flex flex-col container mx-auto px-4">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          placeholder="请输入文章标题..." 
          className="text-2xl font-bold border-none outline-none flex-1 placeholder-gray-300"
        />
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
          发布文章
        </button>
      </div>

      {/* 编辑区域 - 左右分栏 */}
      <div className="flex-1 flex gap-4 border-t border-gray-200 pt-4 pb-4">
        {/* 左侧：输入框 */}
        <textarea 
          className="w-1/2 h-full p-4 border border-gray-200 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="在此输入 Markdown 内容..."
        ></textarea>

        {/* 右侧：预览区 */}
        <div className="w-1/2 h-full p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto prose prose-sm max-w-none">
          <h1 className="text-gray-400 mt-0">预览区域</h1>
          <p className="text-gray-400">文章渲染效果将展示在这里...</p>
        </div>
      </div>
    </div>
  );
}
