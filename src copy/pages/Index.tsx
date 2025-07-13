"use client"

import { useState } from "react"
import Stack from "../components/Stack"
import DecryptedText from "../components/DecryptedText"
import TextPressure from "../components/TextPressure"
import { motion } from "framer-motion"

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(4)

  const handleProgressChange = (index: number, total: number) => {
    setCurrentIndex(index)
    setTotalPages(total)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-between p-8 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* Left side - Card Stack */}
      <div className="flex-1 flex justify-center items-center relative z-10">
        <Stack
          randomRotation={true}
          sensitivity={150}
          sendToBackOnClick={false}
          cardDimensions={{ width: 350, height: 500 }}
          animationConfig={{ stiffness: 300, damping: 25 }}
          onProgressChange={handleProgressChange}
        />
      </div>

      {/* Right side - Typography Animations */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-12 relative z-10 max-w-2xl">
        {/* Main Heading with TextPressure */}
        <motion.div
          className="w-full h-32"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TextPressure
            text="INTERACTIVE"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#8b5cf6"
            minFontSize={32}
          />
        </motion.div>

        {/* Secondary heading */}
        <motion.div
          className="w-full h-24"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TextPressure
            text="CARDS"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#a855f7"
            strokeColor="#3b82f6"
            minFontSize={28}
          />
        </motion.div>

        {/* Descriptive text with DecryptedText animations */}
        <motion.div
          className="space-y-6 text-center max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-xl text-gray-300 leading-relaxed">
            <DecryptedText
              text="Experience the future of interactive design"
              animateOn="view"
              revealDirection="center"
              speed={80}
              maxIterations={15}
              className="text-white"
              encryptedClassName="text-purple-400"
              sequential={true}
            />
          </div>

          <div className="text-lg text-gray-400 leading-relaxed">
            <DecryptedText
              text="Scroll through cards with smooth animations"
              animateOn="view"
              revealDirection="start"
              speed={60}
              maxIterations={12}
              className="text-gray-300"
              encryptedClassName="text-blue-400"
              sequential={true}
            />
          </div>

          <div className="text-base text-gray-500 cursor-pointer hover:text-white transition-colors duration-300">
            <DecryptedText
              text="Hover to reveal hidden messages"
              animateOn="hover"
              revealDirection="center"
              speed={40}
              maxIterations={8}
              className="text-white"
              encryptedClassName="text-purple-300"
            />
          </div>
        </motion.div>

        {/* Interactive elements */}
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-sm text-gray-400 uppercase tracking-wider">
            <DecryptedText
              text="Navigation Controls"
              animateOn="view"
              speed={100}
              maxIterations={20}
              characters="ABCD1234!?"
              className="text-gray-300"
              encryptedClassName="text-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <DecryptedText
                text="↑↓ Arrow Keys"
                animateOn="hover"
                className="text-blue-300"
                encryptedClassName="text-blue-500"
              />
            </div>
            <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <DecryptedText
                text="Mouse Scroll"
                animateOn="hover"
                className="text-purple-300"
                encryptedClassName="text-purple-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-20">
        {Array.from({ length: totalPages }, (_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-16 rounded-full transition-all duration-500 ease-out shadow-lg ${
              index === currentIndex
                ? "bg-gradient-to-b from-purple-400 to-blue-500 scale-110 shadow-purple-500/50"
                : "bg-gray-600/50 hover:bg-gray-500/70 backdrop-blur-sm"
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Index
