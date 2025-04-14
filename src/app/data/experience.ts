import type { TechId } from "./technologies";

export interface ExperienceEntry {
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
}

let counter = 0;
const id = () => counter++;

export const experiences: ExperienceEntry[] = [
  {
    id: id(),
    title: "Software Engineer",
    startDate: new Date("2024-12-15"),
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
    id: id(),
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
    id: id(),
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
    id: id(),
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
    id: id(),
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
    id: id(),
    company: {
      name: "Hospitalidée",
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
    id: id(),
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
    technologies: ["gulp", "react", "php", "javascript", "mysql", "wordpress"],
  },
];
