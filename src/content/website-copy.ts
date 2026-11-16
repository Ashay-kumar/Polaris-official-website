// Approved Website Copy SEO/AEO v2, supplied PDF pages 2-6.
export const pageMetadata = {
  "home": {
    "title": "Kyro Learning | Life Skills and Everyday Growth for Children",
    "description": "Explore how Kyro Learning supports everyday growth beyond academics through communication, leadership, curiosity and resilience."
  },
  "thinking": {
    "title": "Our Thinking | Why Life Skills Matter for Children | Kyro",
    "description": "Learn why Kyro Learning explores communication, leadership, curiosity and resilience through everyday childhood experiences."
  },
  "about": {
    "title": "About Kyro Learning | Purpose, Principles and Progress",
    "description": "Learn why Kyro Learning began, what we believe about childhood growth and how this early-stage initiative is taking shape."
  },
  "kit": {
    "title": "Free Home Leadership Kit | 12 Activities for Kids | Kyro",
    "description": "Explore 12 free at-home activities for children aged 5-14 covering communication, leadership, curiosity and resilience."
  },
  "feedback": {
    "title": "Help Shape Kyro Learning | Share Your Perspective",
    "description": "Share your experience of childhood growth and life skills to help shape Kyro Learning, an early-stage educational initiative."
  }
} as const;

export const feedbackQuestions = [
  {
    "key": "earlierLifeSkill",
    "label": "What is one skill or quality you wish you had practised earlier in life?",
    "asset": "conversation-bubbles.svg"
  },
  {
    "key": "challenge",
    "label": "What challenges do you see children facing as they grow?",
    "asset": "question-challenge.svg"
  },
  {
    "key": "wish",
    "label": "What activities or resources would help?",
    "asset": "question-wish.svg"
  },
  {
    "key": "understand",
    "label": "What should Kyro understand before building something new?",
    "asset": "question-understand.svg"
  }
] as const;
export type FeedbackQuestionKey = typeof feedbackQuestions[number]["key"];
