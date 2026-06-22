import Image from 'next/image'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-black w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0'>
      <div className='relative min-h-[320px] md:min-h-screen'>
        <Image
          src="/auth_image.png"
          alt="Auth Image"
          fill
          priority
          className='object-cover'
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-5 pt-16 md:px-8 md:pb-8'>
          <p className='text-lg md:text-xl lg:text-2xl xl:text-[28px] font-bold leading-normal text-[#F5F5F5] '>
            "The music platform that makes commercial <br className="hidden md:block" /> licensing effortless."
          </p>
        </div>
      </div>

      <div className='flex items-center justify-center px-4 pb-8 md:px-6 md:py-8'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
