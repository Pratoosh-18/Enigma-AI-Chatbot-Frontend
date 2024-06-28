import React from 'react'

const PromtAndResponse = ({p,r}) => {
  return (
    <pre className='flex flex-col m-4 whitespace-pre-wrap'>
      <div className='flex flex-row-reverse'>

        <div className='flex justify-end px-4 border-[1px] w-fit'>{p}</div>
      </div>

      <div className='flex'>

        <div className='flex justify-start px-4 border-[1px] w-fit'>{r}</div>
      </div>
    </pre>
  )
}

export default PromtAndResponse