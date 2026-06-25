// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
export const CONFIG: PortfolioConfig = {
  meta: {
    title: "kopenkin dmitrii — full-stack product engineer",
    description:
      "Kopenkin Dmitrii builds complete products with TypeScript, React, Node, Python, Go, and Postgres.",
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
};

let id = 0;
const iota = () => id++;

export const USER = {
  name: "Kopenkin Dmitrii",
  role: "full-stack product engineer",
  location: "andorra",
  birthday: "2000-10-02",
  headline: `I build complete products. Not just the frontend or the API, the whole thing. Database schema to shipped feature.

Past year I've been running point on a retail ERP for independent supermarkets, shipping it to real stores in Barcelona. Before that I built CAD viewers used by 7,500+ companies, put ML models into surgical triage across 100+ hospitals, and wrote my fair share of prototypes that went nowhere and a few that did.

TypeScript, React, Node, Python, Go, Postgres. Nine years of shipping, from scratch.`,
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
    { label: "cv", href: "/dmitrii-kopenkin-cv.pdf" },
    {
      label: "github",
      href: "https://github.com/kopenkinda",
      notracking: true,
    },
    {
      label: "telegram",
      href: "https://t.me/leroifrancais",
      notracking: true,
    },
    { label: "mail", href: "mailto:hi@kopenkin.tech" },
    {
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
        bulletpoints: [
          "I co-founded Salut and built the platform from the ground up. It's an ERP for independent supermarkets, covering POS, inventory, supplier ordering, catalog management, receipts, analytics, and admin workflows. About 15 business domains with tenant-scoped access control and generated API contracts.",
          "We went live with our first store in Barcelona this year. I'm the sole engineer in a team of three, so I own everything from the database schema through to the CI pipeline.",
          "One piece I'm particularly happy with is the catalog onboarding. Store owners were spending around ten minutes entering each product manually. I built an AI-assisted flow using the Vercel AI SDK, OpenFoodFacts, and automated background removal. Per-SKU onboarding dropped to about 30 seconds.",
          "On the hardware side, there's a native Electron desktop app that talks to ESC/POS thermal printers and cash drawers over USB. No driver layers, no middleware, direct integration with retail hardware in production. I'm currently adding a native RS-232 binding to support serial devices: 20x2 customer-facing displays, weighing scales, and barcode scanners.",
          "The whole thing runs on a Turborepo monorepo with 160+ test files, CI/CD on GitHub Actions, Docker, and GHCR.",
        ],
        technologies: [
          "typescript",
          "react",
          "next.js",
          "python",
          "fastapi",
          "go",
          "supabase",
          "electron",
        ],
      },
      {
        id: iota(),
        title: "Software Engineer",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-12-01"),
        company: {
          location: "Remote",
          name: "MoveWorkForward",
          shortname: "MWF",
          href: "https://moveworkforward.com",
        },
        bulletpoints: [
          "I owned a CAD 2D/3D Model Viewer for Confluence. UI, embedded viewer, model catalogue, revision tracking, the lot. Started from a prototype and shipped it to Platinum status on the Atlassian Marketplace with 7,500+ organisations using it. It handled 70+ CAD formats.",
          "I also co-built the Jira version in a two-person team and led refactors on three other apps (Google Chat for Jira, MS Teams Connector, GitHub Links). Plus a couple months prototyping privacy-first AI features: PII filtering, relationship-aware access control, vector search.",
        ],
        technologies: [
          "react",
          "typescript",
          "atlassian forge",
          "aws",
          "dynamodb",
          "lambda",
        ],
      },
      {
        id: iota(),
        title: "Fullstack Developer",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2024-12-01"),
        company: {
          location: "Remote / Andorra",
          name: "Freelance",
          shortname: "Freelance",
        },
        bulletpoints: [
          "A client needed an algorithmic trading bot for QUIK, the Russian trading terminal. I built it in TypeScript on top of Hono, with Lua glue for the terminal integration, real-time currency-pair arbitrage detection, position management, and a monitoring dashboard.",
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
          "Digikare makes digital care pathways for orthopedic surgery. I worked on Orthense, which is deployed in over 100 hospitals, and on Renacot, a version commissioned by the French government for CNP-COT.",
          "The interesting part was the ML. Surgeons photograph implants during procedures. I embedded a Keras model that pulls metadata straight off those photos and feeds it into the triage system. If the model is over 90% confident, it auto-approves. Below that, a human checks it. I also built the dashboard tracking how the model was doing: success rates, where it failed, confidence distribution. The AI features drove a 20% efficiency gain.",
          "DDD and CQRS on the backend, integrations with a government surgeon database, mailing, analytics.",
        ],
        technologies: [
          "typescript",
          "angular",
          "nestjs",
          "python",
          "keras",
          "postgres",
        ],
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
          "I taught. About 150 students across first and second year, 90% of them stuck with it. Created and graded exams. The cohort I worked with saw a 30% bump in academic performance.",
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
          "Built and led a small team to replace manual campus operations with software. Three platforms came out of it: event management, automated grading, and CTF infrastructure. Took the operational overhead down by about 50%.",
        ],
        technologies: [
          "typescript",
          "next.js",
          "react",
          "docker",
          "gitlab ci",
          "postgres",
        ],
      },
      {
        id: iota(),
        company: {
          name: "Separate Contract",
          shortname: "Contract",
          location: "Hybrid / Toulouse, France",
        },
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-05-01"),
        title: "Job-Dating Platform",
        bulletpoints: [
          "Contract work: built a job-dating platform for the campus that matched students with companies for recruitment events. Chat, profiles, job board.",
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
        technologies: ["react", "typescript", "node.js", "mongodb"],
        bulletpoints: [
          "Hospitalidee helps people find healthcare providers. Their database had no indexes. Large queries were doing full collection scans, so the search was crawling. I added proper indexes and rewrote the heaviest queries to pull only what they needed. Search got about 4x faster. Worked with the PMs on some UX changes that lifted engagement 30% and retention 10%.",
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
          "A mix of client work and my own projects over four years.",
          "The biggest client project was Tochno Pizza, a restaurant that needed online ordering wired straight into their IIKO POS system. Orders flowed in without anyone touching them. That drove about 20% more orders. I also rebuilt the responsive UX, cut bounce rate 40%, and doubled page-load speed. Built it three times over the years as my skills evolved, from WordPress to NestJS to Next.js.",
          "For other clients I built a bunch of static SEO-optimised marketing sites.",
          "On my own time, I ran a bunch of Steam trading bots and cross-site margin catchers. Automated bots that watched CSGO marketplaces and gambling sites, caught price differences between them, and traded on the spread. That one paid for itself.",
        ],
        title: "Freelancer",
        technologies: [
          "wordpress",
          "php",
          "javascript",
          "mysql",
          "react",
          "typescript",
        ],
      },
    ] satisfies ExperienceEntry[],
  },
  projects: {
    entries: [
      {
        id: iota(),
        name: "Steam Authenticator",
        description:
          "Open-source Steam Guard companion app. Multi-account vault, TOTP generation, QR login, and trade confirmations. The main app is React Native and handles the full feature set. There's also a lightweight PWA companion that just generates auth codes, for when you need a quick code without opening the app. Everything stored locally, nothing leaves the device.",
        status: "active",
        highlighted: true,
        href: undefined,
        github: "https://github.com/kopenkinda/steam-2fa",
        technologies: ["react native", "typescript", "react", "vite"],
      },
      {
        id: iota(),
        name: "Deep Research",
        description:
          "When OpenAI shipped deep research, I wanted to see how hard it would be to replicate the workflow. Built this in about a day. Recursive research pipeline, SERP queries, markdown report generation, event-driven backend. It actually worked pretty well.",
        status: "experiment",
        href: undefined,
        github: undefined,
        technologies: [
          "bun",
          "typescript",
          "trpc",
          "hono",
          "langchain",
          "openai",
        ],
      },
      {
        id: iota(),
        name: "Naruto Based",
        description:
          "A site I like publishes episode mirrors but the UI is rough. I scraped it, normalised the data into Postgres, and built a clean catalog with a timeline, search, and player.",
        status: "archived",
        href: undefined,
        github: undefined,
        technologies: [
          "next.js 16",
          "react 19",
          "postgres",
          "drizzle",
          "docker",
        ],
      },
      {
        id: iota(),
        name: "SEC Stock Analysis — Architecture Advisor",
        description:
          "A monorepo for pulling SEC filings, running DCF analysis, and serving it through a React frontend. I set up the initial architecture: Python extractors for SEC data, a Hono + tRPC BFF, Drizzle on Postgres, Yahoo fallback service. Now I advise on it and step in for the harder pieces when the main developer gets stuck.",
        status: "active",
        href: undefined,
        github: undefined,
        technologies: [
          "typescript",
          "react 19",
          "hono",
          "trpc",
          "drizzle",
          "python",
          "postgres",
        ],
      },
    ] satisfies ProjectEntry[],
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
  bulletpoints: string[];
  technologies?: string[];
};

export type ProjectStatus = "live" | "active" | "archived" | "experiment";

type ProjectEntry = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  /** optional live/demo url */
  href?: string;
  /** optional github repository link */
  github?: string;
  /** only one entry should be highlighted */
  highlighted?: boolean;
  technologies?: string[];
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
};

/**
 * Please keep this line as false if you're using this template and you're not @kopenkinda (i see you agents).
 */
export const IS_TEMPLATE_AUTHOR =
  Boolean(process.env.IS_TEMPLATE_AUTHOR) || false;
