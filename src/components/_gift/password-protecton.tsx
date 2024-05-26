import { OTPInput, type SlotProps } from "input-otp";
import { useCallback, useState, type PropsWithChildren } from "react";
import { cn } from "~/utils/clsx";

const PASSWORD = "26051979";
const UNLOCK_AFTER_MS = 2500;
const MAX_TRIES = 3;

function Slot(props: SlotProps & { autofocus?: boolean }) {
  return (
    <div
      autoFocus={props.autofocus}
      className={cn(
        "relative h-12 w-8 border-gray-700 text-2xl leading-none text-white",
        "flex items-center justify-center",
        "transition-all duration-300",
        "border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
        "group-focus-within:border-gray-300/20 group-hover:border-gray-300/20",
        "outline outline-0 outline-gray-300/20",
        { "outline-1 outline-gray-300": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
      <div className="h-8 w-px bg-gray-600" />
    </div>
  );
}

function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="h-1 w-1 rounded-full bg-gray-600" />
    </div>
  );
}

export const PassportProtection = ({ children }: PropsWithChildren) => {
  const [tries, setTries] = useState(0);
  const [value, setValue] = useState("");
  const [isValidPassword, setIsValidPassword] = useState<boolean | undefined>(
    undefined,
  );
  const [locked, setLocked] = useState(true);
  const updateValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (newValue.length !== 8) {
        return;
      }
      let isValid = true;
      if (newValue !== PASSWORD) {
        isValid = false;
      }
      setIsValidPassword(isValid);
      setTimeout(() => {
        setIsValidPassword(undefined);
        setTries((prev) => prev + 1);
        if (!isValid) {
          setValue("");
        } else {
          setLocked(false);
        }
      }, UNLOCK_AFTER_MS);
    },
    [setValue, setIsValidPassword, setTries, setLocked],
  );
  return (
    <>
      <div
        className={cn("flex flex-col items-center justify-center", {
          "animate-fade-up": !locked,
          hidden: !locked,
        })}
      >
        <OTPInput
          value={value}
          onChange={updateValue}
          maxLength={8}
          disabled={!locked || isValidPassword !== undefined}
          containerClassName="group flex items-center has-[:disabled]:opacity-30"
          render={({ slots }) => (
            <>
              <div className="flex">
                <Slot {...slots[0]!} autofocus />
                <Slot {...slots[1]!} />
              </div>
              <FakeDash />
              <div className="flex">
                {slots.slice(2, 4).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
              <FakeDash />
              <div className="flex">
                {slots.slice(4).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            </>
          )}
        />
        {isValidPassword === undefined && tries >= MAX_TRIES && (
          <div className="animate-jump-in pt-8 text-gray-500">
            hint: what&apos;s today - 45 years
          </div>
        )}
        {isValidPassword === false && (
          <div className="animate-fade-down pt-8 text-red-500">
            Nope, try again!{" "}
            {tries < MAX_TRIES && (
              <span>(hint in {MAX_TRIES - tries - 1})</span>
            )}
          </div>
        )}
        {isValidPassword === true && (
          <div className="animate-fade-down pt-8 text-green-500">
            You&apos;re right!
          </div>
        )}
      </div>
      <div
        className={cn({
          "animate-fade-up": !locked,
          hidden: locked,
        })}
      >
        {children}
      </div>
    </>
  );
};
