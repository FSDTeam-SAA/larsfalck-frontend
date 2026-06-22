import React from "react";
import PersonalInformationForm from "./_components/personal-information-form";
import ProfilePicture from "./_components/profile-picture";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const PersonalInformationPage = () => {
  return (
    <div className="mb-0 h-full rounded-[6px] bg-[#171717] p-4 sm:p-5">
    <div className="flex items-center justify-between gap-4">
        <div>
        <h1 className="text-xl font-semibold leading-[120%] text-white sm:text-2xl">
        Profile
      </h1>
      <p className="pb-4 pt-1 text-xs font-normal leading-[120%] text-[#8A8A8A] sm:text-sm">
        Manage your profile
      </p>
      </div>
      <div>
      <Link href="/profiles">
        <button className="flex items-center gap-1 rounded-[6px] bg-primary px-4 py-[6px] text-base font-semibold text-black shadow-[0px_4px_6px_0px_#0000001A] hover:border">
          <ChevronLeft className="size-5"/> Back
        </button>
      </Link>
      </div>
    </div>
      <div>
        <ProfilePicture />
        <PersonalInformationForm />
      </div>
    </div>
  );
};

export default PersonalInformationPage;
