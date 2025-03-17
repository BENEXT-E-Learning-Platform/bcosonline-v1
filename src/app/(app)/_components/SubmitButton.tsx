import React, { ReactElement } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface SubmitButtonProps {
  loading: boolean
  text: string
  customStyle?: React.CSSProperties
}

export default function SubmitButton({
  loading,
  text,
}: {
  loading: boolean
  text: string
}): ReactElement {
  return (
    <button
      type="submit"
      className="bg-[#91be3f] relative text-[#253b74] rounded-md p-2 w-full"
      disabled={loading}
    >
      {text}{' '}
      <div className="h-full  absolute top-0 left-2 flex items-center justify-center  ">
        <AiOutlineLoading3Quarters className={`animate-spin ${loading ? 'block' : 'hidden'}`} />
      </div>
    </button>
  )
}
