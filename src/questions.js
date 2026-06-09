export const questions = [
  {
    id: "q1",
    type: "dropdown",
    title: "What country are you based in?",
    required: true,
    options: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Nigeria", "Other (Type to Search)"]
  },
  {
    id: "q2",
    type: "multiple_choice",
    title: "What is your primary financial goal for the next 12 months?",
    required: true,
    options: [
      "Pay off debt",
      "Save an emergency fund",
      "Start investing",
      "Increase income streams",
      "Buy a home",
      "Other"
    ]
  },
  {
    id: "q3",
    type: "multiple_choice",
    title: "What’s your current financial situation?",
    required: true,
    options: [
      "Living paycheck to paycheck",
      "Saving occasionally",
      "Saving and investing regularly",
      "Financially stable but not growing fast",
      "Financially independent"
    ]
  },
  {
    id: "q4",
    type: "multiple_choice",
    title: "Which of the following do you relate to as a challenge keeping you from a wealth mindset?",
    required: true,
    options: [
      "Lack of clear goals",
      "Not knowing where to start",
      "Fear of failure",
      "Past financial mistakes",
      "Accumulated debt",
      "Lack of discipline or consistency",
      "I earn but don’t save/invest",
      "Other"
    ]
  },
  {
    id: "q5",
    type: "multiple_choice",
    title: "What does “wealth” mean to you right now?",
    required: true,
    options: [
      "Being debt-free",
      "Having consistent monthly savings",
      "Earning passive income",
      "Owning assets that grow in value",
      "Building generational wealth",
      "Other"
    ]
  },
  {
    id: "q6",
    type: "long_text",
    title: "What is your wealth goal over the next 1-3 years? (e.g. own property, build $200K portfolio, start earning passive income, etc.)",
    required: true
  },
  {
    id: "q7",
    type: "multiple_choice",
    title: "How much do you currently save or invest monthly?",
    required: true,
    options: [
      "$0 – $500",
      "$500 – $1,000",
      "$1,000 – $5,000",
      "$5,000 – $10,000",
      "$10,000 – $50,000",
      "$50,000 +"
    ]
  },
  {
    id: "q8",
    type: "multiple_choice",
    title: "Are you willing to follow a strict process over 5 sessions to help you achieve your wealth goals?",
    required: true,
    options: ["Yes", "No"]
  },
  {
    id: "q9",
    type: "multiple_choice",
    title: "If accepted into this private mentorship, are you ready to make a USD4,675 investment into building a structured personalised wealth roadmap for long-term freedom?",
    required: true,
    options: ["Yes", "No"]
  },
  {
    id: "q10",
    type: "contact_group",
    title: "Contact Details",
    required: true,
    fields: [
      { id: "firstName", label: "First Name", type: "text" },
      { id: "lastName", label: "Last Name", type: "text" },
      { id: "email", label: "Email Address", type: "email" },
      { id: "phone", label: "Phone Number", type: "tel" }
    ]
  }
];
