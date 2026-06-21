import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

interface SuccessfullyApprovedModalProps {
  title: string;
  desc: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessfullyApprovedModal: React.FC<SuccessfullyApprovedModalProps> = ({
  title,
  desc,
  open,
  onOpenChange,
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full md:w-[537px] rounded-[12px] border border-[#333333] bg-white/10 p-5 md:p-6">
          <DialogHeader>
            <div className="flex items-center justify-center pb-3">
              {/* <div className="p-[10px] bg-[#E6E6E6] rounded-full">
                <div className="p-[10px] bg-[#CCCCCC] rounded-full">
                  <div className="p-[6px] bg-[#6A93B6] rounded-full flex items-center justify-center">
                    <Check className="w-[35px] h-[35px] text-white" />
                  </div>
                </div>
              </div> */}

              <Image
                src="/auth_logo.png"
                alt="password reset successfully"
                width={400}
                height={400}
                className="w-[180px] h-[60px] object-contain"
              />
            </div>
            <DialogTitle className="text-center text-[#F2F2F2] text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-normal font-poppins">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-[#D7D7D7] text-sm md:text-base font-normal leading-normal font-poppins pt-1 pb-5 lg:pb-6">
              {desc}
            </DialogDescription>
            <div >
              <Link href="/login" className="w-full flex items-center justify-center">
              <Button className="!w-full h-[48px] bg-primary text-[#333333] py-[13px] px-10 md:px-14 rounded-[8px] text-lg font-bold leading-normal">
                Back to Login
              </Button>
            </Link>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessfullyApprovedModal;
