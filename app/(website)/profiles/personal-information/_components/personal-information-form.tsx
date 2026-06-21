"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PersonalInfoSkeleton from "./PersonalInfoSkeleton";
import { UserApiResponse } from "./personal-info-data-type";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required.",
  }),
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  phoneNumber: z.string().min(2, {
    message: "Phone Number must be at least 2 characters.",
  }),
  gender: z.string().min(1, {
    message: "Gender is required.",
  }),
});

const inputClassName =
  "h-9 w-full rounded-[2px] border-0 bg-[#242424] px-3 text-sm font-normal leading-[120%] text-white shadow-none placeholder:text-[#8A8A8A] focus-visible:ring-1 focus-visible:ring-primary disabled:bg-[#242424] disabled:text-white disabled:opacity-100";

const labelClassName =
  "text-xs font-medium leading-[120%] text-white sm:text-sm";

const splitFullName = (fullName?: string) => {
  const [firstName = "", ...lastNameParts] = fullName?.trim().split(" ") ?? [];

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

const PersonalInformationForm = () => {
  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const { data, isLoading } = useQuery<UserApiResponse>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "male",
    },
  });

  useEffect(() => {
    if (data?.data) {
      const user = data.data;
      const { firstName, lastName } = splitFullName(user.fullName);

      form.reset({
        firstName,
        lastName,
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        gender: user.gender === "female" ? "female" : "male",
      });
    }
  }, [data, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const payload = {
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        country: data?.data?.country ?? "",
        city: data?.data?.city ?? "",
        address: data?.data?.address ?? "",
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      return res.json();
    },
    onSuccess: async (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Profile updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["profile-img"] });
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading) {
    return (
      <div className="pt-4">
        <PersonalInfoSkeleton />
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="pt-4">
      <div>
        <h4 className="text-lg font-semibold leading-[120%] text-white sm:text-xl">
          Personal Information
        </h4>
        <p className="pt-1 text-xs font-normal leading-[120%] text-[#BDBDBD] sm:text-sm">
          Manage your personal information and profile details.
        </p>
      </div>

      <div className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-6">
                      {["male", "female"].map((gender) => (
                        <label
                          key={gender}
                          className="flex items-center gap-2 text-xs font-medium capitalize leading-none text-white"
                        >
                          <input
                            type="radio"
                            value={gender}
                            checked={field.value === gender}
                            onChange={() => field.onChange(gender)}
                            className="size-3 accent-primary"
                          />
                          {gender}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Jenny"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Wilson"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        className={inputClassName}
                        placeholder="example@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="+1 (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center pt-4">
              <Button
                disabled={isPending}
                className="h-6 rounded-full bg-primary px-3 text-[10px] font-semibold leading-none text-[#1A1A1A] hover:bg-primary/90"
                type="submit"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
