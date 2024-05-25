import { useEffect, useState, type PropsWithChildren } from "react";

export const Namedrop = ({ children }: PropsWithChildren) => {
  const [name, setName] = useState<"name" | "surname">("name");

  useEffect(() => {
    const changeName = () => {
      setName((prevName) => (prevName === "name" ? "surname" : "name"));
    };
    const iv = setInterval(changeName, 2000);
    return () => clearInterval(iv);
  }, [setName]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="text-9xl font-black uppercase text-white/5">
        {name === "name" ? (
          <span className="animate-fade-left">Anton</span>
        ) : (
          <span className="animate-fade-right">Kopenkin</span>
        )}
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};
