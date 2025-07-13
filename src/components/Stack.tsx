"use client"

import type React from "react"

import { motion, useMotionValue, useTransform, useAnimation, useSpring } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"

import DecryptedText from "./DecryptedText"
import BlurText from "./BlurText"
import ShinyText from "./ShinyText"

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  cardRef,
}: {
  children: React.ReactNode
  onSendToBack: () => void
  sensitivity: number
  cardRef?: React.RefObject<HTMLDivElement>
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [60, -60])
  const rotateY = useTransform(x, [-100, 100], [-60, 60])
  const controls = useAnimation()

  // Physics-based spring values for smooth animations
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  function handleDragEnd(_: any, info: any) {
    console.log("Drag ended with offset:", info.offset)
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      console.log("Sending to back due to drag")
      onSendToBack()
    } else {
      x.set(0)
      y.set(0)
    }
  }

  // Enhanced animation controls for realistic scroll animations
  useEffect(() => {
    if (cardRef && cardRef.current) {
      // Human-like drag animation - feels like a real person is dragging the card
      ;(cardRef.current as any).animateScrollOut = (direction: "forward" | "backward" = "forward", momentum = 1) => {
        // Move a short distance to the right, then settle to final position
        const shortDistance = 300 + momentum * 100 // Just move 300px to the right
        const targetX = shortDistance // Short distance travel
        const targetY = -80 - momentum * 40 // Lift up from stack
        const targetRotate = 0 // Keep card flat (no rotation)

        // Add human-like randomness but keep it near stack area
        const randomVariationX = (Math.random() - 0.5) * 50
        const randomVariationY = (Math.random() - 0.5) * 80
        const randomRotationVariation = 0 // No rotation variation

        // Phase 1: Move card toward right edge of screen with dramatic curve
        controls
          .start({
            x: targetX * 0.7 + randomVariationX,
            y: targetY * 0.5 + randomVariationY,
            rotate: targetRotate * 0.8 + randomRotationVariation,
            scale: 1.15,
            rotateX: 0,
            rotateY: 0,
            zIndex: 500,
            transition: {
              type: "spring",
              stiffness: 250,
              damping: 20,
              duration: 0.15,
            },
          })
          .then(() => {
            // Phase 2: Reach the right edge of screen
            controls
              .start({
                x: targetX + randomVariationX,
                y: targetY + randomVariationY,
                rotate: targetRotate + randomRotationVariation,
                scale: 1.1,
                rotateX: 0,
                rotateY: 0,
                zIndex: 400,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.05,
                },
              })
              .then(() => {
                // Phase 3: Hold at right edge briefly (visible to user)
                setTimeout(() => {
                  // Phase 4: Travel back and settle into final stack position (bottom)
                  controls.start({
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    opacity: 1,
                    zIndex: 1,
                    transition: {
                      type: "spring",
                      stiffness: 280,
                      damping: 25,
                      duration: 0.2,
                      bounce: 0.3,
                    },
                  })
                }, 100)
              })
          })
      }

      // Human-like reverse drag - feels like a person is dragging the card back into view
      ;(cardRef.current as any).animateScrollIn = (direction: "forward" | "backward" = "forward", momentum = 1) => {
        // Come from short distance to the right, then settle to top position
        const shortDistance = 300 + momentum * 100 // From 300px to the right
        const startX = shortDistance // Start from short distance
        const startY = -80 - momentum * 40 // Start lifted up
        const startRotate = 0 // Start flat (no rotation)

        // Add human-like randomness but keep it near stack area
        const randomVariationX = (Math.random() - 0.5) * 100
        const randomVariationY = (Math.random() - 0.5) * 80
        const randomRotationVariation = 0 // No rotation variation

        // Phase 1: Start at right edge of screen (invisible)
        controls
          .start({
            x: startX + randomVariationX,
            y: startY + randomVariationY,
            rotate: startRotate + randomRotationVariation,
            scale: 1.1,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
            zIndex: 1000,
            transition: { duration: 0 },
          })
          .then(() => {
            // Phase 2: Card becomes visible at right edge
            controls
              .start({
                opacity: 1,
                transition: {
                  duration: 0.02,
                },
              })
              .then(() => {
                // Phase 3: Move from right edge toward center with curve
                controls
                  .start({
                    x: startX * 0.4 + randomVariationX,
                    y: startY * 0.5 + randomVariationY,
                    rotate: startRotate * 0.6 + randomRotationVariation,
                    scale: 1.1,
                    rotateX: 0,
                    rotateY: 0,
                    transition: {
                      type: "spring",
                      stiffness: 250,
                      damping: 22,
                      duration: 0.05,
                    },
                  })
                  .then(() => {
                    // Phase 4: Final journey and settlement on top of stack
                    controls.start({
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      rotateX: 0,
                      rotateY: 0,
                      opacity: 1,
                      zIndex: 1,
                      transition: {
                        type: "spring",
                        stiffness: 280,
                        damping: 25,
                        duration: 0.1,
                        bounce: 0.1,
                      },
                    })
                  })
              })
          })
      }

      // Legacy methods for backward compatibility
      ;(cardRef.current as any).animateOut = () => {
        ;(cardRef.current as any).animateScrollOut("forward", 1)
      }
      ;(cardRef.current as any).animateIn = () => {
        ;(cardRef.current as any).animateScrollIn("forward", 1)
      }
    }
  }, [controls, cardRef])

  return (
    <motion.div
      ref={cardRef}
      className="absolute cursor-grab"
      style={{ x: springX, y: springY, rotateX, rotateY, zIndex: 1 }}
      animate={controls}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  )
}

interface PageData {
  id: number
  title: string
  content: React.ReactNode
  backgroundColor: string
  textColor?: string
  rightContent?: React.ReactNode // Added rightContent property
}

interface StackProps {
  randomRotation?: boolean
  sensitivity?: number
  cardDimensions?: { width: number; height: number }
  pagesData?: PageData[]
  animationConfig?: { stiffness: number; damping: number }
  sendToBackOnClick?: boolean
  onProgressChange?: (currentIndex: number, totalPages: number) => void
}

export const defaultPages: PageData[] = [
  {
    id: 1,
    title: "Welcome Page",
    backgroundColor: "bg-[#FFD8BE]",
    textColor: "text-[#22223b]",
    content: (
      <div className="p-8 h-full flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6 text-[#22223b]">Welcome!</h1>
        <p className="text-lg mb-4 text-[#22223b]">This is your first page in the stack.</p>
        <p className="text-sm opacity-90 text-[#22223b]">Drag or scroll to navigate →</p>
      </div>
    ),
    rightContent: (
      <div className="space-y-8">
        <BlurText
          text="Welcome to the Future"
          delay={80}
          animateBy="words"
          direction="top"
          className="text-6xl font-bold text-[#fce9e9] leading-tight"
          animationFrom={{ opacity: 0, y: 20 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
        />
        <div className="space-y-4">
          <DecryptedText
            text="Experience interactive navigation like never before. This innovative stack interface combines smooth animations with intuitive controls."
            className="text-xl text-[#fce9e9]/80 leading-relaxed"
            speed={30}
            animateOn="view"
          />
          <div className="pt-4">
            <DecryptedText
              text="→ Scroll, drag, or use arrow keys to explore"
              className="text-lg text-[#fce9e9]/60 font-medium"
              speed={40}
              animateOn="view"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "About Page",
    backgroundColor: "bg-[#FFEEDD]",
    textColor: "text-[#22223b]",
    content: (
      <div className="p-8 h-full flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6 text-[#22223b]">About Us</h1>
        <p className="text-lg mb-4 text-[#22223b]">Learn more about our mission and values.</p>
        <div className="space-y-2 text-sm opacity-90 text-[#22223b]">
          <p>✨ Innovation driven</p>
          <p>🚀 Future focused</p>
          <p>💡 User centered</p>
        </div>
      </div>
    ),
    rightContent: (
      <div className="space-y-8">
        <BlurText
          text="About Our Vision"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-6xl font-bold text-[#fce9e9] leading-tight"
          animationFrom={{ opacity: 0, y: 20 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
        />
        <div className="space-y-6">
          <DecryptedText
            text="We believe in creating digital experiences that push the boundaries of what's possible. Our team combines cutting-edge technology with thoughtful design."
            className="text-xl text-[#fce9e9]/80 leading-relaxed"
            speed={25}
            animateOn="view"
          />
          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <DecryptedText
                text="Innovation at every step"
                className="text-lg text-[#fce9e9]/70"
                speed={35}
                animateOn="view"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <DecryptedText
                text="User-centered design philosophy"
                className="text-lg text-[#fce9e9]/70"
                speed={35}
                animateOn="view"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <DecryptedText
                text="Future-ready solutions"
                className="text-lg text-[#fce9e9]/70"
                speed={35}
                animateOn="view"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Services Page",
    backgroundColor: "bg-[#F8F7FF]",
    textColor: "text-[#22223b]",
    content: (
      <div className="p-8 h-full flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6 text-[#22223b]">Our Services</h1>
        <div className="space-y-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-[#22223b]">Web Development</h3>
            <p className="text-sm text-[#22223b]">Modern, responsive websites</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-[#22223b]">UI/UX Design</h3>
            <p className="text-sm text-[#22223b]">Beautiful, intuitive interfaces</p>
          </div>
        </div>
      </div>
    ),
    rightContent: (
      <div className="space-y-8">
        <ShinyText text="Our Services" disabled={false} speed={3} className="text-6xl font-bold text-[#fce9e9]" />
        <div className="space-y-6">
          <DecryptedText
            text="We offer comprehensive digital solutions tailored to your needs. From concept to deployment, we handle every aspect of your project."
            className="text-xl text-[#fce9e9]/80 leading-relaxed"
            speed={25}
            animateOn="view"
          />
          <div className="space-y-6 pt-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-2xl border border-orange-500/30">
              <BlurText
                text="Web Development"
                delay={50}
                animateBy="letters"
                direction="top"
                className="text-2xl font-bold text-[#fce9e9] mb-3"
                animationFrom={{ opacity: 0, y: 20 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
              />
              <DecryptedText
                text="Modern, responsive websites built with the latest technologies"
                className="text-lg text-[#fce9e9]/70"
                speed={30}
                animateOn="view"
              />
            </div>
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-6 rounded-2xl border border-red-500/30">
              <BlurText
                text="UI/UX Design"
                delay={50}
                animateBy="letters"
                direction="top"
                className="text-2xl font-bold text-[#fce9e9] mb-3"
                animationFrom={{ opacity: 0, y: 20 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
              />
              <DecryptedText
                text="Beautiful, intuitive interfaces that users love to interact with"
                className="text-lg text-[#fce9e9]/70"
                speed={30}
                animateOn="view"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Contact Page",
    backgroundColor: "bg-[#ADADEB]",
    textColor: "text-[#22223b]",
    content: (
      <div className="p-8 h-full flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6 text-[#22223b]">Get In Touch</h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📧</div>
            <span>hello@example.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📱</div>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    ),
    rightContent: (
      <div className="space-y-8">
        <BlurText
          text="Let's Connect"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-6xl font-bold text-[#fce9e9] leading-tight"
          animationFrom={{ opacity: 0, y: 20 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            onAnimationComplete={() => {}}
        />
        <div className="space-y-6">
          <DecryptedText
            text="Ready to bring your ideas to life? We'd love to hear from you. Get in touch and let's create something amazing together."
            className="text-xl text-[#fce9e9]/80 leading-relaxed"
            speed={25}
            animateOn="view"
          />
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4 p-4 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                📧
              </div>
              <div>
                <DecryptedText
                  text="hello@example.com"
                  className="text-lg text-[#fce9e9] font-medium"
                  speed={40}
                  animateOn="view"
                />
                <p className="text-sm text-[#fce9e9]/60">Drop us a line</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                📱
              </div>
              <div>
                <DecryptedText
                  text="+1 (555) 123-4567"
                  className="text-lg text-[#fce9e9] font-medium"
                  speed={40}
                  animateOn="view"
                />
                <p className="text-sm text-[#fce9e9]/60">Give us a call</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function Stack({
  randomRotation = false,
  sensitivity = 180,
  cardDimensions = { width: 300, height: 500 },
  pagesData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  onProgressChange,
}: StackProps) {
  const [pages, setPages] = useState<PageData[]>(() => {
    if (pagesData.length) return pagesData
    // Reverse the array so first card (Welcome) is on top
    return [...defaultPages].reverse()
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0) // Track current position (0 = first card visible)
  const stackRef = useRef<HTMLDivElement>(null)
  const lastScrollTime = useRef(0)
  const scrollThreshold = 40

  // Notify parent component of progress changes
  useEffect(() => {
    if (onProgressChange) {
      onProgressChange(currentIndex, pages.length)
    }
  }, [currentIndex, pages.length, onProgressChange])

  // Store refs in a Map instead of array to avoid hook violations
  const cardRefsMap = useRef<Map<number, React.RefObject<HTMLDivElement>>>(new Map())

  // Function to get or create a ref for a specific page ID
  const getCardRef = useCallback((pageId: number) => {
    if (!cardRefsMap.current.has(pageId)) {
      cardRefsMap.current.set(pageId, { current: null })
    }
    return cardRefsMap.current.get(pageId)!
  }, [])

  const scrollForward = () => {
    if (isAnimating) {
      console.log("Animation in progress, ignoring scroll")
      return
    }

    // Check if we're at the last card
    if (currentIndex >= pages.length - 1) {
      console.log("Already at the last card, cannot scroll forward")
      return
    }

    console.log(`Scrolling forward from index ${currentIndex} to ${currentIndex + 1}`)
    setIsAnimating(true)

    // Animate the top card out
    const topPage = pages[pages.length - 1]
    const topCardRef = getCardRef(topPage.id)
    if (topCardRef?.current && (topCardRef.current as any).animateScrollOut) {
      ;(topCardRef.current as any).animateScrollOut()
    }

    setTimeout(() => {
      setPages((prev) => {
        const newPages = [...prev]
        const [page] = newPages.splice(newPages.length - 1, 1)
        newPages.unshift(page)
        return newPages
      })
      setCurrentIndex((prev) => prev + 1)
      setTimeout(() => setIsAnimating(false), 100)
    }, 600)
  }

  const scrollBackward = () => {
    if (isAnimating) {
      console.log("Animation in progress, ignoring scroll")
      return
    }

    // Check if we're at the first card
    if (currentIndex <= 0) {
      console.log("Already at the first card, cannot scroll backward")
      return
    }

    console.log(`Scrolling backward from index ${currentIndex} to ${currentIndex - 1}`)
    setIsAnimating(true)

    setPages((prev) => {
      const newPages = [...prev]
      const lastPage = newPages.shift()
      if (lastPage) {
        newPages.push(lastPage)
      }
      return newPages
    })

    // Animate the new top card coming in from the right
    setTimeout(() => {
      const newTopPage = pages[pages.length - 1]
      const newTopCardRef = getCardRef(newTopPage.id)
      if (newTopCardRef?.current && (newTopCardRef.current as any).animateScrollIn) {
        ;(newTopCardRef.current as any).animateScrollIn()
      }
      setCurrentIndex((prev) => prev - 1)
      setTimeout(() => setIsAnimating(false), 100)
    }, 200)
  }

  // Legacy function for drag functionality
  const sendToBack = (id: number, animated = false) => {
    if (isAnimating) {
      console.log("Animation in progress, ignoring sendToBack")
      return
    }

    // Removed boundary check for unlimited drags

    console.log("Sending page to back:", id, animated ? "with animation" : "")
    setIsAnimating(true)

    if (animated) {
      // Find the top card and animate it out
      const topPage = pages[pages.length - 1]
      const topCardRef = getCardRef(topPage.id)
      if (topCardRef?.current && (topCardRef.current as any).animateScrollOut) {
        ;(topCardRef.current as any).animateScrollOut()
      }

      setTimeout(() => {
        setPages((prev) => {
          const newPages = [...prev]
          const index = newPages.findIndex((page) => page.id === id)
          const [page] = newPages.splice(index, 1)
          newPages.unshift(page)
          return newPages
        })
        // Update current index to reflect forward movement, loop if needed
        setCurrentIndex((prev) => {
          const next = prev + 1
          return next >= pages.length ? 0 : next
        })
        setTimeout(() => setIsAnimating(false), 100)
      }, 600)
    } else {
      setPages((prev) => {
        const newPages = [...prev]
        const index = newPages.findIndex((page) => page.id === id)
        const [page] = newPages.splice(index, 1)
        newPages.unshift(page)
        return newPages
      })
      // Update current index to reflect forward movement, loop if needed
      setCurrentIndex((prev) => {
        const next = prev + 1
        return next >= pages.length ? 0 : next
      })
      setTimeout(() => setIsAnimating(false), 400)
    }
  }

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      console.log("Wheel event detected:", event.deltaY)
      event.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime.current < 200 || isAnimating) {
        console.log("Throttled or animating, ignoring scroll")
        return
      }

      lastScrollTime.current = now

      if (Math.abs(event.deltaY) > scrollThreshold) {
        if (event.deltaY > 0) {
          console.log("Scrolling down - moving forward through cards")
          scrollForward()
        } else {
          console.log("Scrolling up - moving backward through cards")
          scrollBackward()
        }
      }
    }

    console.log("Adding wheel event listener to window")
    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      console.log("Removing wheel event listener from window")
      window.removeEventListener("wheel", handleWheel)
    }
  }, [pages, isAnimating])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        console.log("Arrow key down/right pressed - moving forward through cards")
        scrollForward()
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        console.log("Arrow key up/left pressed - moving backward through cards")
        scrollBackward()
      }
    }

    console.log("Adding keyboard event listener to window")
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      console.log("Removing keyboard event listener from window")
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [pages, isAnimating])

  return (
    <div className="flex flex-col items-start space-y-8" style={{ overflow: "visible" }}>
      {/* <div className="text-left mb-4">
        <h2 className="text-2xl font-bold mb-2">Interactive Page Stack</h2>
        <p className="text-muted-foreground">Scroll down to go forward • Scroll up to go backward • Linear progression from first to last card</p>
      </div> */}

      <div
        ref={stackRef}
        className="relative focus:outline-none"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          perspective: 600,
          overflow: "visible",
        }}
        tabIndex={0}
      >
        {pages.map((page, index) => {
          const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0

          return (
            <CardRotate
              key={page.id}
              cardRef={getCardRef(page.id)}
              onSendToBack={() => sendToBack(page.id)}
              sensitivity={sensitivity}
            >
              <motion.div
                className={`rounded-2xl overflow-hidden border-4 border-white shadow-2xl ${page.backgroundColor} ${page.textColor || "text-black"}`}
                onClick={() => sendToBackOnClick && sendToBack(page.id)}
                animate={{
                  rotateZ: (pages.length - index - 1) * 2 + randomRotate,
                  scale: 1 + index * 0.03 - pages.length * 0.03,
                  transformOrigin: "50% 100%",
                }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping,
                }}
                style={{
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                }}
              >
                {page.content}
              </motion.div>
            </CardRotate>
          )
        })}
      </div>
    </div>
  )
}
