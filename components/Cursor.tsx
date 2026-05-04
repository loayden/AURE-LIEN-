"use client"

import { useEffect, useRef, useState } from 'react'

const HOVER_SELECTOR =
  "a,button,input,select,textarea,label,[role='button'],[data-cursor='hover']"

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)
  const [hoverActive, setHoverActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const isHoverTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(HOVER_SELECTOR))

    const draw = () => {
      frameRef.current = null
      const { x, y } = positionRef.current
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x - 7}px, ${y - 7}px, 0)`
      }
    }

    const move = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY }
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(draw)
      }
    }

    const over = (event: PointerEvent) => {
      const nextHover = isHoverTarget(event.target)
      setHoverActive((current) => (current === nextHover ? current : nextHover))
    }

    const out = (event: PointerEvent) => {
      if (isHoverTarget(event.relatedTarget)) return
      setHoverActive(false)
    }

    const leave = () => setHoverActive(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerout', out, { passive: true })
    window.addEventListener('mouseleave', leave)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('mousemove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerout', out)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  return <div ref={cursorRef} className={`luxury-cursor${hoverActive ? ' hover-active' : ''}`} />
}
