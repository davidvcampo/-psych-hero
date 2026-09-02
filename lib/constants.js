// Plain data — no "use client" directive, so both Server Components
// (e.g. the landing page) and Client Components can import it safely.

export const SUBJECTS = [
  { code: "PSYC 101", name: "General Psychology", track: "major" },
  { code: "PSYC 102", name: "Developmental Psychology", track: "major" },
  { code: "PSYC 103", name: "Abnormal Psychology", track: "major" },
  { code: "PSYC 104", name: "Theories of Personality", track: "major" },
  { code: "PSYC 105", name: "Industrial Psychology", track: "major" },
  { code: "PSYC 106", name: "Psychological Statistics", track: "major" },
  { code: "PSYC 107", name: "Research Methods", track: "major" },
  { code: "GE 1", name: "Understanding the Self", track: "ge" },
  { code: "GE 2", name: "Readings in Philippine History", track: "ge" },
  { code: "GE 3", name: "Purposive Communication", track: "ge" },
  { code: "GE 4", name: "Mathematics in the Modern World", track: "ge" },
  { code: "OTHER", name: "Other / Not listed", track: "other" },
];

export const RESOURCE_TYPES = ["Notes", "Reviewer", "Module", "Syllabus", "Practice Set", "Other"];
export const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
