export const roadmapQuestions = [
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
    type: "multiple_choice",
    title: "What is your wealth goal over the next 1-3 years?",
    required: true,
    options: [
      "Own property",
      "Build $200K portfolio",
      "Start earning passive income",
      "Other"
    ]
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

export const workshopQuestions = [
  {
    id: "w1",
    type: "contact_group",
    title: "Organization & Contact Details",
    required: true,
    fields: [
      { id: "fullName", label: "Full Name", type: "text" },
      { id: "organizationName", label: "Organization / Institution Name", type: "text" },
      { id: "jobTitle", label: "Job Title / Role", type: "text" },
      { id: "email", label: "Email Address", type: "email" },
      { id: "websiteLink", label: "Website or Organization Link", type: "text" }
    ]
  },
  {
    id: "w6",
    type: "short_text",
    title: "Location: City / Province / Country",
    required: true
  },
  {
    id: "w7",
    type: "multiple_choice",
    title: "Approximately how many attendees are you expecting?",
    required: true,
    options: ["Under 25", "25–50", "50–100", "100–250", "250+"]
  },
  {
    id: "w8",
    type: "multiple_choice",
    title: "What type of session are you interested in?",
    required: true,
    options: [
      "One-Time Workshop",
      "Multi-Day Series",
      "Financial Wellness Week",
      "Keynote Speaking",
      "Corporate Wellness Program",
      "Panel Discussion",
      "Custom Partnership",
      "Not Sure Yet"
    ]
  },
  {
    id: "w9",
    type: "checkboxes",
    title: "Which topics are you most interested in? (Select all that apply)",
    required: true,
    options: [
      "Money in Canada 101",
      "Budgeting & Cash Flow",
      "Debt Management",
      "Beginner Investing",
      "Building Long-Term Wealth",
      "Wealth Mindset & Financial Habits",
      "Financial Planning for Young Professionals",
      "Financial Wellness for Employees",
      "Generational Wealth Building",
      "Financial Confidence & Decision-Making",
      "Other"
    ]
  },
  {
    id: "w10",
    type: "multiple_choice",
    title: "Preferred Format",
    required: true,
    options: ["Virtual", "In-Person", "Hybrid"]
  },
  {
    id: "w11",
    type: "short_text",
    title: "Date and time of event",
    required: false
  },
  {
    id: "w12",
    type: "multiple_choice",
    title: "Do you currently have a budget allocated for this initiative?",
    required: true,
    options: ["Yes", "No", "Seeking sponsorship/funding"]
  },
  {
    id: "w13",
    type: "long_text",
    title: "Is there anything specific your audience is currently struggling with financially?",
    required: false
  },
  {
    id: "w14",
    type: "long_text",
    title: "What outcome would make this workshop/program successful for your audience?",
    required: false
  },
  {
    id: "w15",
    type: "multiple_choice",
    title: "How did you hear about Mindset 2 Wealth?",
    required: true,
    options: [
      "Instagram",
      "LinkedIn",
      "Word of mouth / Referral",
      "Attended a past Event / Workshop",
      "Google / Search Engine",
      "Other"
    ]
  }
];
