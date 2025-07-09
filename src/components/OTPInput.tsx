// components/OTPInput.tsx
import { useRef } from "react";

type OTPInputProps = {
  length?: number;
  onChange: (otp: string) => void;
};

const OTPInput = ({ length = 6, onChange }: OTPInputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const otpArray = inputRefs.current.map((input) => input?.value || "");
    otpArray[index] = value;
    onChange(otpArray.join(""));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !inputRefs.current[index]?.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) return; // digits only

    const digits = pastedData.slice(0, length).split("");

    digits.forEach((digit, idx) => {
      const input = inputRefs.current[idx];
      if (input) {
        input.value = digit;
      }
    });

    onChange(digits.join(""));

    // Focus the last filled input
    const lastFilledIndex = digits.length - 1;
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}          
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-10 h-12 border border-gray-300 text-center rounded-md text-lg focus:outline-emerald-500"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPInput;
123456