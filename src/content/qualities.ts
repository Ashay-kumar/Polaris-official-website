export type QualityId = "communication" | "leadership" | "curiosity" | "resilience";

export const qualities: { id: QualityId; name: string; description: string; example: string; reflection: string; photo: string; width: number; height: number }[] = [
  { id: "communication", name: "Communication", description: "Saying what they think so others understand.", example: "In Three-part day, a child tells their day with a beginning, a middle and an end. A parent asks one curious follow-up question.", reflection: "When does your child feel most comfortable sharing a story?", photo: "quality-communication.jpg", width: 373, height: 232 },
  { id: "leadership", name: "Leadership", description: "Starting things and owning outcomes.", example: "In My job this week, a child owns one small family responsibility, including forgetting and fixing it.", reflection: "What small decision could your child take ownership of this week?", photo: "quality-leadership.jpg", width: 371, height: 232 },
  { id: "curiosity", name: "Curiosity", description: "Asking why and how, learning beyond what is required.", example: "In Question jar, the family collects questions and explores one together each weekend using two different sources.", reflection: "Which of your child's questions could you explore together?", photo: "quality-curiosity.jpg", width: 371, height: 232 },
  { id: "resilience", name: "Resilience", description: "Trying again after losing, failing or being disappointed.", example: "In My story of trying again, a parent shares a setback, what they did next and how they felt.", reflection: "How could you make room for disappointment before discussing a next step?", photo: "quality-resilience.jpg", width: 372, height: 232 },
];

export const kitDownload = "/downloads/Kyro_Learning_Home_Leadership_Kit.pdf";
export const perspectives = [
  { id: "parent", label: "Parent / caregiver", asset: "role-parent-caregiver.svg" },
  { id: "educator", label: "Educator", asset: "role-educator.svg" },
  { id: "professional", label: "Child-development professional", asset: "role-professional.svg" },
  { id: "visitor", label: "Interested visitor", asset: "role-visitor.svg" },
] as const;
