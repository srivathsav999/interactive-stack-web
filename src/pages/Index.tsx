"use client"

import { useState } from "react"
import Stack from "../components/Stack"
import { defaultPages } from "../components/Stack"

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(4)

  const handleProgressChange = (index: number, total: number) => {
    setCurrentIndex(index)
    setTotalPages(total)
  }

  return (
    <div className="min-h-screen bg-[#160116] flex items-center justify-between px-8 py-8 gap-8">
      {/* Stack container - left side */}
      <div className="flex flex-col items-center space-y-8">

        {/* Stack component */}
        <div className="relative z-10">
          <Stack
            randomRotation={true}
            sensitivity={150}
            sendToBackOnClick={false}
            cardDimensions={{ width: 350, height: 500 }}
            animationConfig={{ stiffness: 300, damping: 25 }}
            onProgressChange={handleProgressChange}
          />
        </div>
      </div>

      {/* Right content panel */}
      <div className="w-[600px] h-[600px] p-12 mr-24 text-[#eebaba] flex flex-col justify-center rounded-3xl shadow-2xl backdrop-blur-sm  relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br  via-transparent  pointer-events-none" />
        {/* Content */}
        <div className="relative z-10">{defaultPages[currentIndex]?.rightContent}</div>
      </div>

      {/* Segmented scroll bar indicator - repositioned */}
      <div className="fixed right-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <div
            key={index}
            className={`w-1 h-12 rounded-full transition-all duration-500 ease-out ${
              index === currentIndex
                ? "bg-[#fce9e9] shadow-lg shadow-[#fce9e9]/50"
                : "bg-[#fce9e9]/20 hover:bg-[#fce9e9]/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Index
