import React from 'react'

const PromtAndResponse = ({p,r}) => {
  return (
    <pre className='border-2 border-black m-4 whitespace-pre-wrap'>
        <div>{p}</div>
        <div>{r}</div>
    </pre>
  )
}

export default PromtAndResponse