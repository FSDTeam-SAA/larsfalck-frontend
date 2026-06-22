"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserApiResponse } from "./personal-info-data-type";

const formatMemberSince = (date?: string) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const ProfilePicture = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const queryClient = useQueryClient();

  const [profileImage, setProfileImage] = useState("/no-user.jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery<UserApiResponse>({
    queryKey: ["profile-img"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile-image"],
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile image updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile-img"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast.error("Upload failed");
      console.error(error);
    },
  });

  useEffect(() => {
    const image = data?.data?.profilePicture;
    if (image) {
      setProfileImage(image);
    }
  }, [data?.data?.profilePicture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profilePicture", file, file.name);
    mutate(formData);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-[6px] bg-[#252525] p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative w-fit shrink-0 rounded-full border-2 border-white bg-[#1A1A1A] shadow-[0_4px_15px_rgba(0,0,0,0.25)]">
          <div className="relative">
            <div className="relative size-16 overflow-hidden rounded-full sm:size-20">
              <Image
                src={profileImage}
                alt="Profile"
                width={80}
                height={80}
                className="size-full object-cover"
              />
            </div>

            <div className="absolute -bottom-1 -right-1 flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />

              <Button
                size="sm"
                className="size-6 rounded-full bg-primary p-0 text-[#1A1A1A] hover:bg-primary/90 sm:size-7"
                title="Upload new image"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <Camera className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="truncate text-base font-semibold leading-[120%] text-white sm:text-lg">
            {data?.data?.fullName || "N/A"}
          </h4>
          <p className="truncate pt-1 text-xs font-normal leading-[120%] text-[#BDBDBD] sm:text-sm">
            {data?.data?.email || "N/A"}
          </p>
          <span className="mt-3 inline-flex rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium leading-none text-[#1A1A1A] sm:text-xs">
            Premium member
          </span>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-xs font-normal leading-[120%] text-[#8A8A8A]">
          Member since
        </p>
        <p className="pt-2 text-sm font-medium leading-[120%] text-white">
          {formatMemberSince(data?.data?.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ProfilePicture;
