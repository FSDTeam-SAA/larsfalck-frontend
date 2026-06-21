import React from 'react'
import PersonalInformationForm from './_components/personal-information-form'
import ProfilePicture from './_components/profile-picture'

const PersonalInformationPage = () => {
  return (
    <div className='h-full bg-white/10 rounded-[16px] mb-0 p-6'>
        <h1 className="text-2xl md:text-3xl lg:text-3xl xl:text-[40px] font-semibold text-white leading-[120%]">Profile</h1>
      <p className="text-base md:text-lg lg:text-xl text-[#8A8A8A] font-normal leading-[120%] pt-1 pb-6 md:pb-7 lg:pb-8">Manage your profile</p>
       <div>
         <ProfilePicture/>
        <PersonalInformationForm/>
       </div>
    </div>
  )
}

export default PersonalInformationPage