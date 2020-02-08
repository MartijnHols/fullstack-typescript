import React, { useRef } from 'react'

const useAutoFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [inputRef])
  return inputRef
}

export default useAutoFocus
