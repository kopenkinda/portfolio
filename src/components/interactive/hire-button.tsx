import { IconMail } from "@tabler/icons-react";
import type { Language } from "~/i18n/language";
import { useTranslations } from "~/i18n/utils";
import { cn } from "~/utils/clsx";

export const HireButton = ({
  lang,
  className,
}: {
  lang: Language;
  className?: string;
}) => {
  const t = useTranslations(lang);

  return (
    <form
      action="mailto:kopenkinda@gmail.com"
      className="my-auto"
      method="get"
      encType="text/plain"
    >
      <input
        type="text"
        name="subject"
        className="hidden"
        defaultValue="Hello!"
      />
      <button
        type="submit"
        className={cn(
          className,
          "relative inline-flex animate-shimmer cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-[linear-gradient(110deg,rgba(100,116,139),45%,rgba(255,255,255,.8),55%,rgba(100,116,139))] bg-[size:200%_100%] px-3 font-medium tracking-wider transition-all hover:border-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-50",
        )}
      >
        <span className="text-slate-50">{t("ui.nav.hire")}</span>
        <IconMail stroke={1.5} size={16} className="ml-1" />
      </button>
    </form>
  );
};
