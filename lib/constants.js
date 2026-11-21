// Plain data — no "use client" directive, so both Server Components
// (e.g. the landing page) and Client Components can import it safely.

export const SUBJECTS = [
  // Psychology major subjects
  { code: "PSY 100", name: "General Psychology", track: "major" },
  { code: "PSY 101", name: "Psychological Statistics", track: "major" },
  { code: "PSY 102", name: "Physiological Psychology", track: "major" },
  { code: "PSY 103", name: "Developmental Psychology", track: "major" },
  { code: "PSY 104", name: "Theories of Personality", track: "major" },
  { code: "PSY 105", name: "Abnormal Psychology", track: "major" },
  { code: "PSY 106", name: "Experimental Psychology", track: "major" },
  { code: "PSY 107", name: "Cognitive Psychology", track: "major" },
  { code: "PSY 108", name: "Sikolohiyang Filipino", track: "major" },
  { code: "PSY 109", name: "Introduction to Islamic Psychology", track: "major" },
  { code: "PSY 110", name: "Introduction to Counseling", track: "major" },

  // General education courses
  { code: "GEC 101", name: "Understanding the Self", track: "ge" },
  { code: "GEC 102", name: "Purposive Communication", track: "ge" },
  { code: "GEC 103", name: "The Contemporary World", track: "ge" },
  { code: "GEC 104", name: "Mathematics in the Modern World", track: "ge" },
  { code: "GEC 105", name: "Readings in Philippine History", track: "ge" },
  { code: "GEC 106", name: "Art Appreciation", track: "ge" },
  { code: "GEC 107", name: "Ethics", track: "ge" },
  { code: "GEC 108", name: "Science, Technology, Society", track: "ge" },
  { code: "GEC 109", name: "Life and Works of Rizal", track: "ge" },
  {
    code: "GEC 110",
    name: "History of Muslim Filipinos and other Indigenous People in Mindanao",
    track: "ge",
  },

  { code: "OTHER", name: "Other / Not listed", track: "other" },
];

// Used to group folders on the homepage and options in dropdowns.
export const TRACKS = [
  { id: "major", title: "Psychology major subjects" },
  { id: "ge", title: "General education courses" },
  { id: "other", title: "Everything else" },
];

export const RESOURCE_TYPES = ["Notes", "Reviewer", "Module", "Syllabus", "Practice Set", "Other"];
export const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// Files uploaded before the subject list was updated still carry the old codes.
// This maps them to the current subjects so they show up in the right folder.
// Old subjects with no match (Industrial Psychology, Research Methods) go to OTHER.
const LEGACY_SUBJECT_MAP = {
  "PSYC 101": "PSY 100",
  "PSYC 102": "PSY 103",
  "PSYC 103": "PSY 105",
  "PSYC 104": "PSY 104",
  "PSYC 105": "OTHER",
  "PSYC 106": "PSY 101",
  "PSYC 107": "OTHER",
  "GE 1": "GEC 101",
  "GE 2": "GEC 105",
  "GE 3": "GEC 102",
  "GE 4": "GEC 104",
};

export function normalizeResource(resource) {
  const newCode = LEGACY_SUBJECT_MAP[resource.subjectCode];
  if (!newCode) return resource;
  const subject = SUBJECTS.find((s) => s.code === newCode);
  return { ...resource, subjectCode: newCode, subjectName: subject ? subject.name : resource.subjectName };
}

// A "lesson" can hold several files (e.g. photos of notes, page by page).
export const MAX_FILES_PER_LESSON = 15;

// Older submissions have a single fileUrl; newer ones have a files array.
// This returns one list either way: [{ url, name, type }]
export function getResourceFiles(resource) {
  if (Array.isArray(resource.files) && resource.files.length > 0) return resource.files;
  return resource.fileUrl
    ? [{ url: resource.fileUrl, name: resource.fileName || "File", type: "" }]
    : [];
}

export function isImageFile(file) {
  if (file.type && file.type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|avif|bmp)$/i.test(file.name || "");
}
