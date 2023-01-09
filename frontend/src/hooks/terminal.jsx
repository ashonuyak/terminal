import { useEffect } from "react"

export const useClickOutsideEvent = (ref, clickedInside, setClickedInside) => {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setClickedInside(false)
    } else {
      setClickedInside(true)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
}
