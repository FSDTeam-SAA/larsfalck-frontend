"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const genreOptions = [
  "Indie Pop",
  "Electronic Pop",
  "K-Pop Pop",
  "Chillwave",
  "Synthwave",
  "Ambient",
  "J-Pop",
] as const;

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." })
      .trim(),

    email: z
      .string()
      .trim()
      .email({ message: "Please enter a valid email address." }),

    preferredGenres: z
      .array(z.string())
      .min(1, { message: "Please select at least one genre." }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),

    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long.",
    }),

    rememberMe: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const router = useRouter();
  const genreDropdownRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      preferredGenres: [],
      password: "",
      confirmPassword: "",
      rememberMe: true,
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const { mutate, isPending } = useMutation({
  mutationKey: ["signup"],

  mutationFn: async (values: {
    fullName: string;
    email: string;
    password: string;
    preferredGenres: string[];
  }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Registration failed");
    }

    return data;
  },

  onSuccess: (data) => {
    if (!data?.success) {
      toast.error(data?.message || "Something went wrong!");
      return;
    }

    toast.success(data?.message || "Registration successful");

    form.reset();

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  },

  onError: (error: Error) => {
    toast.error(error.message || "Something went wrong");
  },
});

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const payload = {
      fullName: values.fullName,
      email : values.email,
      password : values.password,
      preferredGenres: values.preferredGenres,
    }
    mutate(payload)
  }

  return (
    <div>
      <div className="w-full md:w-[537px] rounded-[12px] border border-[#333333] bg-white/10 p-5 md:p-6">
        <div className="flex w-full items-center justify-center pb-5">
          <Link href="/">
            <Image
              src="/auth_logo.png"
              alt="auth logo"
              width={500}
              height={500}
              className="h-60px] w-[180px] object-contain"
            />
          </Link>
        </div>
        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-[#F2F2F2] text-center leading-[120%] ">
          Create an account
        </h3>
        <p className="text-base md:text-lg font-normal text-[#D7D7D7] leading-[150%] text-center pb-1">
          Start your 14-day free trial. No credit card needed.
        </p>
        

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-6 "
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-white leading-[120%]">
                    Full Name 
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-[48px] bg-[#333333] !rounded-[8px] text-base font-medium text-white py-3 px-4 border-none placeholder:text-[#787878]"
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-white leading-[120%]">
                    Email 
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-[48px] bg-[#333333] !rounded-[8px] text-base font-medium text-white py-3 px-4 border-none placeholder:text-[#787878]"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredGenres"
              render={({ field }) => {
                const selectedGenres = field.value ?? [];

                return (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-white leading-[120%]">
                      Genre
                    </FormLabel>

                    <FormControl>
                      <div className="relative" ref={genreDropdownRef}>
                        <button
                          type="button"
                          className="flex h-[48px] w-full items-center justify-between rounded-[8px] bg-[#333333] px-4 py-3 text-left text-base font-medium text-white"
                          onClick={() =>
                            setIsGenreDropdownOpen((prev) => !prev)
                          }
                        >
                          <span
                            className={
                              selectedGenres.length > 0
                                ? "truncate text-white"
                                : "truncate text-[#787878]"
                            }
                          >
                            {selectedGenres.length > 0
                              ? selectedGenres.join(", ")
                              : "Select"}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-[#979797] transition-transform ${
                              isGenreDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isGenreDropdownOpen ? (
                          <div className="absolute left-0 right-0 z-20 mt-2 rounded-[8px] border border-[#333333] bg-[#1F1F1F] p-2 shadow-lg">
                            <div className="max-h-[240px] space-y-1 overflow-y-auto pr-1">
                              {genreOptions.map((genre) => {
                                const isSelected =
                                  selectedGenres.includes(genre);

                                return (
                                  <label
                                    key={genre}
                                    className="flex cursor-pointer items-center gap-3 rounded-[6px] px-2 py-2 text-[#D7D7D7] transition-colors hover:bg-white/5"
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        if (checked === true) {
                                          field.onChange([
                                            ...selectedGenres,
                                            genre,
                                          ]);
                                          return;
                                        }

                                        field.onChange(
                                          selectedGenres.filter(
                                            (item) => item !== genre
                                          )
                                        );
                                      }}
                                      className="border-[#6F6F6F] data-[state=checked]:border-primary data-[state=checked]:bg-[#E6E6E6] data-[state=checked]:text-black"
                                    />
                                    <span className="text-base leading-[120%]">
                                      {genre}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-white leading-[120%]">
                    Password 
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-[48px] bg-[#333333] !rounded-[8px] text-base font-medium text-white py-3 px-4 border-none placeholder:text-[#787878]"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye className="text-[#979797]" />
                        ) : (
                          <EyeOff className="text-[#979797]" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-white leading-[120%]">
                    Confirm Password 
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="h-[48px] bg-[#333333] !rounded-[8px] text-base font-medium text-white py-3 px-4 border-none placeholder:text-[#787878]"
                        type={confirmShowPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setConfirmShowPassword((prev) => !prev)}
                      >
                        {confirmShowPassword ? (
                          <Eye className="text-[#979797]" />
                        ) : (
                          <EyeOff className="text-[#979797]" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                       className="data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary"
                    />
                  </FormControl>

                  <Label className="text-[#E8E8E8] text-sm font-medium leading-[120%]">
                    I agree to the{" "}
                    <Link href="#">
                    <span className="text-primary">
                    terms & conditions  
                    </span>
                    </Link>
                    and
                    <Link href="#">
                    <span className="text-primary">
                      privacy policy 
                    </span>
                    </Link>
                  </Label>
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button disabled={isPending} className="h-[48px] w-full rounded-[8px] font-medium text-[#333333]" type="submit">
                {isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>

            <p className="text-sm text-[#E6FDE6] font-medium text-center pt-2 leading-[120%]">
              Already have an account? 
              <Link className="text-primary underline" href="/login">
                Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
