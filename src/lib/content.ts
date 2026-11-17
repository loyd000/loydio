// Site content, edited by hand. Array order = display order.
// Images go in /public (e.g. /projects/my-app.png); image_url: null shows a blank placeholder.

export type Project = {
  id: string;
  title: string;
  /** Opens in a new tab from the card; null = not clickable. */
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

// TODO: replace placeholders with real projects
export const projects: Project[] = [
  { id: "p1", title: "Project One", link: null, image_url: null },
  { id: "p2", title: "Project Two", link: null, image_url: null },
  { id: "p3", title: "Project Three", link: null, image_url: null },
  { id: "p4", title: "Project Four", link: null, image_url: null },
];

// TODO: check titles and years
export const work: Row[] = [
  { label: "Remote", text: "Claims Assessor, Australian business solutions company", aside: "now" },
  { label: "Independent", text: "Freelance websites, apps and ESP32 builds", aside: "2024 - now" },
  { label: "AMTEC, UPLB", text: "Intern: WordPress catalogue fed by Google Sheets, Python report generator" },
  { label: "Education", text: "BS Computer Engineering", aside: "2022 - 26" },
];

// TODO: replace placeholders with real certifications and awards
export const recognition: Row[] = [
  { label: "Organization", text: "Certification One", aside: "2026" },
  { label: "Organization", text: "Award One", aside: "2026" },
  { label: "Organization", text: "Certification Two", aside: "2025" },
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
