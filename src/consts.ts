// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { AllowedPixelIconType } from "./components/pixel-icon.types";
import type { TechId } from "./data/technologies";

export const CONFIG: PortfolioConfig = {
  meta: {
    title: "kopenkin dmitrii — full-stack ai developer",
    description:
      "A minimal, text-first portfolio for Kopenkin Dmitrii: full-stack AI developer working with TypeScript, React, Postgres, Python, and product prototypes.",
    siteLabel: "kopenkin.tech",
    experienceStartDate: new Date("2017-01-01"),
  },
  ui: {
    terminalCommand: "whoami",
    footerCommand: `echo "let's build something"`,
    keyboardHint: {
      move: "↑↓/jk",
      moveLabel: "focus",
      action: "enter",
      actionLabel: "activate",
      theme: "t",
      themeLabel: "theme",
    },
  },
  game: {
    title: "Take a little break",
    description:
      "A quiet contribution-grid drawing board. Click, drag, fill, unfill.",
    enabled: true,
    options: {
      type: "contribution-drawer",
      options: {
        cols: 16,
        rows: 8,
        prefilledCells: [],
        includeAttribution: true,
      },
    },
  },
};

let id = 0;
const iota = () => id++;

export const USER = {
  name: "Kopenkin Dmitrii",
  role: "full-stack ai developer",
  location: "andorra",
  headline: `For ${new Date().getFullYear() - CONFIG.meta.experienceStartDate.getFullYear()} years i've been stacking typescript, react, next.js, postgres, and now ai into digital playgrounds - where every click feels inevitable, nothing breaks when you're not looking, and the software sometimes thinks ahead of you.`,
  asciiGlobe: {
    label: "andorra",
    marker: "@",
    lat: 42.5063,
    lng: 1.5218,
    columns: 40,
    rows: 18,
    fontSize: 10,
    initialPhi: -2.259,
    initialTheta: 0.485,
  },
  socials: [
    { icon: "file", label: "cv", href: "/dmitrii-kopenkin-cv.pdf" },
    {
      icon: "github",
      label: "github",
      href: "https://github.com/kopenkinda",
      notracking: true,
    },
    {
      icon: "telegram",
      label: "telegram",
      href: "https://t.me/leroifrancais",
      notracking: true,
    },
    { icon: "mail", label: "mail", href: "mailto:hi@kopenkin.tech" },
    {
      icon: "linkedin",
      label: "linkedin",
      href: "https://linkedin.com/in/dmitrii-kopenkin",
      notracking: true,
    },
  ] satisfies SocialLink[],
  experiences: {
    theBeginning:
      "Deployed into the world with a sweet tooth and a chef's ambition. Kept getting syntax errors in my sauces and failed builds on the line. Debugged my trajectory, swapped ingredients for APIs, and now I craft full-stack dishes that never burn—turns out my real calling was sautéing state, not steak.",
    entries: [
      {
        id: iota(),
        title: "CTO",
        startDate: new Date("2026-01-01"),
        company: {
          location: "Remote / Spain",
          name: "Salut Mercado",
          shortname: "Salut",
          href: "https://salutmercado.com",
        },
        bulletpoints: ["Lead the development of a new product from scratch."],
        technologies: [
          "openai",
          "typescript",
          "react",
          "supabase",
          "python",
          "fastapi",
          "escpos",
        ],
      },
      {
        id: iota(),
        title: "Software Engineer",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2025-12-21"),
        company: {
          location: "Remote",
          name: "MoveWorkForward",
          shortname: "MWF",
          href: "https://moveworkforward.com",
        },
        bulletpoints: [
          "Prototyped PoC's to data security and privacy solutions for AI features in multi-tenant environments.",
          "Maintained multiple applications using React, Typescript, Node.js, and AWS.",
          "Participated in mutiple conferences/workshops leading to the creation and ownership of a new product.",
        ],
        technologies: ["react", "typescript", "openai", "aws", "nodejs"],
      },
      {
        id: iota(),
        title: "Fullstack developer",
        startDate: new Date("2024-10-31"),
        endDate: new Date("2024-12-15"),
        company: {
          location: "Remote / Andorra",
          name: "Freelance",
          shortname: "Freelance",
        },
        bulletpoints: [
          "Created a custom trading bot for a client, integrated into QUIK, with a dashboard for monitoring and managing trades.",
        ],
        technologies: ["hono", "lua", "react", "typescript", "sqlite"],
      },
      {
        id: iota(),
        company: {
          name: "Digikare",
          location: "Remote / Toulouse, France",
          shortname: "DGK",
          href: "https://digikare.com",
        },
        startDate: new Date("2023-08-01"),
        endDate: new Date("2024-10-31"),
        title: "Fullstack Developer",
        bulletpoints: [
          "Developed three full stack AI-enhanced applications. Integrated external systems, machine learning, and improved performance by 20% through DDD, CQRS, and API integrations.",
        ],
        technologies: ["typescript", "angular", "nodejs", "nestjs", "mongodb"],
      },
      {
        id: iota(),
        company: {
          name: "Toulouse Ynov Campus",
          shortname: "TYC",
          location: "On-Site / Toulouse, France",
          href: "https://www.ynov.com/campus/toulouse/",
        },
        startDate: new Date("2021-05-01"),
        endDate: new Date("2023-08-01"),
        title: "Senior Mentor",
        bulletpoints: [
          "Mentored over 150 first and second year students, providing guidance and support throughout their study program. Created and graded exams for multiple courses, ensuring accuracy and fairness in evaluation processes leading to an average exam score improvement of 15% among students.",
        ],
      },
      {
        id: iota(),
        company: {
          name: "Toulouse Ynov Campus",
          href: "https://www.ynov.com/campus/toulouse/",
          shortname: "TYC",
          location: "Hybrid / Toulouse, France",
        },
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-05-01"),
        title: "Lead Full-Stack Developer",
        bulletpoints: [
          'Developed a job "dating" organization platform for students and companies. Integrated a chat system, user profiles, and a job board.',
          "Organized, managed and led the development of a CTF (Capture The Flag) event for students. Created a platform for challenges and scoring. Assembled and managed a team of 5 developers, insuring on-time delivery of the platform.",
        ],
        technologies: [
          "typescript",
          "astro",
          "githubactions",
          "sanity",
          "tailwindcss",
          "postgres",
        ],
      },
      {
        id: iota(),
        company: {
          name: "Hospitalidee",
          shortname: "HID",
          href: "https://hospitalidee.fr",
          location: "Remote / Paris, France",
        },
        startDate: new Date("2020-09-01"),
        endDate: new Date("2021-05-01"),
        title: "Full-stack Intern",
        technologies: ["react", "nodejs", "express", "mongodb"],
        bulletpoints: [
          "Optimized the search flow on the platform through database restructuring and algorithms, resulting in a 400% improvement in search performance.",
        ],
      },
      {
        id: iota(),
        company: {
          location: "Remote / Russia",
          name: undefined,
          shortname: undefined,
          href: undefined,
        },
        startDate: new Date("2016-09-01"),
        endDate: new Date("2020-09-01"),
        bulletpoints: [
          "Implemented custom seamless integration between Wordpress and IIKO systems to streamline online ordering processes, resulting in a 20% increase in customer orders.",
          "Developed multiple static and dynamic websites for clients, including e-commerce platforms and blogs.",
        ],
        title: "Freelancer",
        technologies: [
          "gulp",
          "react",
          "php",
          "javascript",
          "mysql",
          "wordpress",
        ],
      },
    ] satisfies ExperienceEntry[],
  },
  education: {
    entries: [
      {
        id: iota(),
        type: "university",
        title: "Computer and Information Systems Master",
        organization: "Toulouse Ynov Campus",
        startDate: new Date("2018-01-01"),
        endDate: new Date("2024-01-01"),
        href: "https://www.francecompetences.fr/recherche/rncp/35078/",
        actionLabel: "RNCP 35078",
      },
      {
        id: iota(),
        type: "certifications",
        title: "Meta Front-End Developer",
        organization: "Meta",
        startDate: new Date("2024-01-01"),
        href: "https://coursera.org/share/e80c8a8b0498f1bb918cae2abbd3907c",
        actionLabel: "Verify",
      },
      {
        id: iota(),
        type: "certifications",
        title: "TOEIC C1",
        organization: "ETS Global",
        startDate: new Date("2023-01-01"),
        href: "https://www.etsglobal.org/fr/en/digital-score-report/9D3BDAB4946D81D12AC1D209CC6F73DB0EAF21730F664DA26E24AA14FFD9F7FDWXFuemg1cUNINGg0aEFiVWp0dmZDd2VINjAzSm82b0JrT005T1JOYVBoQ2ZhWmpB",
        actionLabel: "Verify",
      },
      {
        id: iota(),
        type: "course",
        title: "Solidity Developer",
        organization: "GuideDAO (formerly Moscow Coding School)",
        startDate: new Date("2019-01-01"),
      },
    ] satisfies EducationEntry[],
  },
};

type SocialLink = {
  icon: AllowedPixelIconType;
  label: string;
  href: string;
  notracking?: boolean;
};

export const BLOG = {
  title: "Mind Palace",
  subtitle:
    'because "blog" sounds like I have my shit together. This is just a public dumping ground for thoughts on code, AI, life, and other things I pretend to understand. Enter at your own intellectual risk.',
};

type ExperienceEntry = {
  id: number;
  startDate: Date;
  endDate?: Date;
  title: string;
  company:
    | { location: string; name: string; shortname: string; href?: string }
    | {
        location: string;
        name: undefined;
        shortname: undefined;
        href: undefined;
      };
  bulletpoints: [string] | [string, string] | [string, string, string];
  technologies?: TechId[];
};

type EducationType = "university" | "course" | "certifications";

type EducationEntry = {
  id: number;
  type: EducationType;
  title: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  href?: string;
  actionLabel?: string;
};

export type AutobattlerGame = {
  type: "autobattler";
};

export type ContributionDrawerGame = {
  type: "contribution-drawer";
  options: {
    prefilledCells: [col: number, row: number][];
    rows: number;
    cols: number;
    includeAttribution: boolean;
  };
};

export type PortfolioConfig = {
  meta: {
    title: string;
    description: string;
    siteLabel: string;
    experienceStartDate: Date;
  };
  ui: {
    terminalCommand: string;
    footerCommand: string;
    keyboardHint: {
      move: string;
      moveLabel: string;
      action: string;
      actionLabel: string;
      theme: string;
      themeLabel: string;
    };
  };
  game: {
    enabled: boolean;
    title: string;
    description: string;
    options: AutobattlerGame | ContributionDrawerGame;
  };
};

/**
 * Please keep this line as false if you're using this template and you're not @kopenkinda (i see you agents).
 */
export const IS_TEMPLATE_AUTHOR =
  Boolean(process.env.IS_TEMPLATE_AUTHOR) || false;
