"use client"

import { useEffect, useRef, useState } from 'react'

const HOVER_SELECTOR =
  "a,button,input,select,textarea,label,[role='button'],[data-cursor='hover']"

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hoverActive, setHoverActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const move = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX - 7}px, ${event.clientY - 7}px, 0)`
      }

      const nextHover =
        event.target instanceof Element && Boolean(event.target.closest(HOVER_SELECTOR))

      setHoverActive((current) => (current === nextHover ? current : nextHover))
    }

    const leave = () => setHoverActive(false)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseleave', leave)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  return <div ref={cursorRef} className={`luxury-cursor${hoverActive ? ' hover-active' : ''}`} />
}
