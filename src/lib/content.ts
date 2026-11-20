// Site content, edited by hand. Array order = display order.
// Images go in /public (e.g. /projects/my-app.png); image_url: null shows a blank placeholder.

export type Project = {
  /** Also the page URL: /work/<id> */
  id: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
  /** "What I did" list on the project page. */
  highlights: string[];
  /** "Visit site" link; null hides it. */
  link: string | null;
  image_url: string | null;
};

/** One row in an info table: muted label | main text | muted right column. */
export type Row = {
  label: string;
  text: string;
  href?: string;
  aside?: string;
};

// TODO: check role, period and stack for both projects
export const projects: Project[] = [
  {
    id: "lampara-app",
    title: "Lampara App",
    role: "Designer & Developer",
    period: "2026",
    summary:
      "CRM, warehouse and HR for solar installation companies. One app runs the whole job: the customer and the quote, the materials leaving the warehouse, and the crew's attendance and pay.",
    stack: [],
    highlights: [
      "Designed and built a three-part app for solar installers, CRM, Warehouse and HR, that a company can take one part at a time",
      "CRM follows each project from first inquiry to site inspection, quote, signed contract, payments and installation, and warns when a lead goes quiet",
      "Site inspection reports can be filled in offline, and quotes are built from packages and exported as PDF",
      "Warehouse tracks stock on hand, reserved and available, with material and tool requests that are approved, released and returned",
      "HR lets crews clock in from the site with location and a selfie, then runs payroll per cutoff with PDF payslips and an Excel export",
      "Runs in the phone's browser and adds to the home screen like an app, with nothing to download from a store",
      "Each company gets its own address, its own database, and roles for owner, admin, engineer, warehouse, HR and field staff",
      "Shipped a live demo with a made-up company that runs in the browser with no account",
    ],
    link: "https://get.lamparaeis.com/",
    image_url: "/projects/lampara-app.png",
  },
  {
    id: "lampara",
    title: "Lampara",
    role: "Designer & Developer",
    period: "2026",
    summary:
      "Website for Lampara, a licensed solar installer serving Metro Manila and CALABARZON, built to turn visitors into quote requests.",
    stack: ["React", "Vite", "Supabase", "Vercel"],
    highlights: [
      "Designed and built the marketing site, from the hero and service pages to the FAQ and contact channels",
      "Built a savings calculator that turns a monthly electric bill into a recommended system size, monthly and yearly savings, and a payback period",
      "Featured installations and client reviews load from a database, so new projects show up without a redeploy",
      "Every section points to one action: a free quote, by form or straight to Messenger",
    ],
    link: "https://lamparaeis.com/",
    image_url: "/projects/lampara-site.png",
  },
];

// TODO: check titles and years
export const work: Row[] = [
  { label: "Independent", text: "Freelance websites, apps and ESP32 builds", aside: "2024 - now" },
  { label: "AMTEC, UPLB", text: "Intern: WordPress catalogue fed by Google Sheets, Python report generator" },
  { label: "Education", text: "BS Computer Engineering", aside: "2022 - 26" },
];

export const recognition: Row[] = [
  { label: "Award", text: "1st Place, LSPU Intercollegiate Research Congress" },
  { label: "Civil Service", text: "Professional Level Eligibility, 90.26%" },
  { label: "Safety", text: "Certified Safety Officer 1 (BOSH SO1)" },
];

export const research: Row[] = [
  {
    label: "Thesis",
    text: "CATOK: judging young coconut ripeness with TinyML and acoustic signals on an ESP32-S3",
    aside: "Best Thesis",
  },
];

export const EMAIL = "deguzman.johnlloyd12@gmail.com";

export const contact: Row[] = [
  { label: "GitHub", text: "loyd000", href: "https://github.com/loyd000" },
  { label: "Instagram", text: "loyd.dg", href: "https://www.instagram.com/loyd.dg/" },
  { label: "Facebook", text: "loydixyz", href: "https://www.facebook.com/loydixyz" },
  { label: "Resume", text: "RESUME_DE_GUZMAN.pdf", href: "/RESUME_DE_GUZMAN.pdf" },
];
