import type { ReactNode } from "react";
import { PrinterIcon } from "lucide-react";
import {
  BiLogoMongodb,
  BiLogoNodejs,
  BiLogoPostgresql,
  BiLogoReact,
  BiLogoTypescript,
} from "react-icons/bi";
import {
  SiAmazonwebservices,
  SiAngular,
  SiAstro,
  SiExpress,
  SiFastapi,
  SiGithubactions,
  SiGulp,
  SiHono,
  SiJavascript,
  SiLangchain,
  SiLua,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiOpenai,
  SiPhp,
  SiPython,
  SiSanity,
  SiSass,
  SiSqlite,
  SiSupabase,
  SiTailwindcss,
  SiWordpress,
} from "react-icons/si";
import { VscAzureDevops } from "react-icons/vsc";

export interface TechnologyEntry {
  id: string;
  label: string;
  href: string;
  icon: (props: React.SVGAttributes<SVGElement>) => ReactNode;
}

// prettier-ignore
export const technologies = [
  { id: "react",        label: "React",         icon: BiLogoReact,         href: "https://react.dev" },
  { id: "typescript",   label: "TypeScript",    icon: BiLogoTypescript,    href: "https://www.typescriptlang.org" },
  { id: "nodejs",       label: "NodeJS",        icon: BiLogoNodejs,        href: "https://nodejs.org/" },
  { id: "express",      label: "Express.js",    icon: SiExpress,           href: "https://expressjs.com" },
  { id: "mongodb",      label: "MongoDB",       icon: BiLogoMongodb,       href: "https://www.mongodb.com" },
  { id: "postgres",     label: "PostgreSQL",    icon: BiLogoPostgresql,    href: "https://www.postgresql.org" },
  { id: "astro",        label: "Astro",         icon: SiAstro,             href: "https://astro.build" },
  { id: "hono",         label: "Hono",          icon: SiHono,              href: "https://hono.dev" },
  { id: "angular",      label: "Angular",       icon: SiAngular,           href: "https://angular.dev" },
  { id: "azuredevops",  label: "Azure DevOps",  icon: VscAzureDevops,      href: "https://azure.microsoft.com/en-us/services/devops/" },
  { id: "githubactions",label: "Github Actions",icon: SiGithubactions,     href: "https://github.com/features/actions" },
  { id: "gulp",         label: "Gulp",          icon: SiGulp,              href: "https://gulpjs.com" },
  { id: "lua",          label: "Lua",           icon: SiLua,               href: "https://www.lua.org" },
  { id: "nextjs",       label: "Next.js",       icon: SiNextdotjs,         href: "https://nextjs.org" },
  { id: "php",          label: "PHP",           icon: SiPhp,               href: "https://www.php.net" },
  { id: "sass",         label: "Sass",          icon: SiSass,              href: "https://sass-lang.com" },
  { id: "tailwindcss",  label: "TailwindCSS",   icon: SiTailwindcss,       href: "https://tailwindcss.com" },
  { id: "wordpress",    label: "WordPress",     icon: SiWordpress,         href: "https://wordpress.org" },
  { id: "sqlite",       label: "SQLite",        icon: SiSqlite,            href: "https://www.sqlite.org" },
  { id: "nestjs",       label: "NestJS",        icon: SiNestjs,            href: "https://nestjs.com" },
  { id: "sanity",       label: "Sanity",        icon: SiSanity,            href: "https://www.sanity.io" },
  { id: "mysql",        label: "MySQL",         icon: SiMysql,             href: "https://www.mysql.com" },
  { id: "javascript",   label: "JavaScript",    icon: SiJavascript,        href: "https://www.mysql.com" },
  { id: "openai",       label: "OpenAI",        icon: SiOpenai,            href: "https://www.openai.com" },
  { id: "langchain",    label: "LangChain",     icon: SiLangchain,         href: "https://www.langchain.com" },
  { id: "aws",          label: "AWS",           icon: SiAmazonwebservices, href: "https://aws.amazon.com" },
  { id: "supabase",     label: "Supabase",      icon: SiSupabase,          href: "https://supabase.com" },
  { id: "python",       label: "Python",        icon: SiPython,            href: "https://www.python.org" },
  { id: "fastapi",      label: "FastAPI",       icon: SiFastapi,           href: "https://fastapi.tiangolo.com" },
  { id: "escpos",       label: "ESC/POS",       icon: PrinterIcon,         href: "https://en.wikipedia.org/wiki/ESC/P" },
] as const satisfies TechnologyEntry[];

type TechnologyItem = (typeof technologies)[number];
export type TechId = (typeof technologies)[number]["id"];

export function tech<TKey extends TechId>(
  id: TKey,
): Extract<TechnologyItem, { id: TKey }> {
  return technologies.find((t) => t.id === id) as Extract<
    TechnologyItem,
    { id: TKey }
  >;
}
