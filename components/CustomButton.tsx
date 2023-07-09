"use client";

import Image from "next/image";

import { CustomButtonProps } from "@/types";

const Button = (
  {
    title,
    containerStyles, 
    handleClick,
    btnType,
    textStyles,
    rightIcon,
    // isDisabled,
  }
  : CustomButtonProps
) => (
  <button
  type={btnType || "button"}
  className={`custom-btn ${containerStyles}`}
  onClick={handleClick}
  // disabled={isDisabled}
  >
    <span
    className={`flex-1 ${textStyles}`}
    >
      {title}
    </span>
    {rightIcon && (
      <div className="relative w-6 h-6">
        <Image
          src={rightIcon}
          alt="arrow_left"
          fill
          className="object-contain"
        />
      </div>
    )}
  </button>

  // <>Button</>
);

export default Button;
