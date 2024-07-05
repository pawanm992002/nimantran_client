import React from 'react'

const Wrapper = ({children}) => {
  return (
    <div>
      <div className="flex h-screen">
         
          {children}

        </div>
    </div>
  )
}

export default Wrapper
