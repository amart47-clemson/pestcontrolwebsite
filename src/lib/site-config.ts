export const SITE = {
  name: "Pierce Pest Control",
  shortName: "Pierce Pest",
  tagline: "Fast, effective pest solutions for your home.",
  description:
    "Licensed pest control with free estimates. Ants, roaches, rodents, termites, and more — Pierce Pest Control has you covered.",
  phone: "(555) 867-5309",
  phoneHref: "tel:+15558675309",
  email: "info@piercepestcontrol.com",
  emailHref: "mailto:info@piercepestcontrol.com",
  serviceArea:
    "Serving homeowners across the greater metro area and surrounding counties.",
  hours: "Mon–Sat 7am–7pm · Same-day & emergency service available",
  licenseNote: "Licensed & insured · Free inspections · Satisfaction guaranteed",
} as const

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "How It Works", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const

export const PEST_TYPES = [
  "Ants",
  "Roaches",
  "Rodents",
  "Termites",
  "Spiders / Wasps",
  "Mosquitoes",
  "Wildlife",
  "Not sure / Multiple",
  "Other",
] as const

export const SERVICES = [
  {
    id: "residential",
    title: "Residential Protection",
    description:
      "Custom treatment plans for single-family homes, apartments, and condos — safe for kids and pets when dry.",
    icon: "home" as const,
    image: "/images/services/residential.png",
    imageAlt: "House diagram showing common household pests and treatment areas",
    imageFit: "contain" as const,
  },
  {
    id: "rodents",
    title: "Rodent Control",
    description:
      "Inspection, exclusion, trapping, and monitoring to stop mice and rats at the source.",
    icon: "rat" as const,
    image: "/images/services/rodents.png",
    imageAlt: "Rodent control — technician with no-rodents shield icon",
    imageFit: "contain" as const,
  },
  {
    id: "termites",
    title: "Termite Defense",
    description:
      "Liquid barriers, bait systems, and WDO reports to protect your biggest investment.",
    icon: "shield" as const,
    image: "/images/services/termites.png",
    imageAlt: "Termite defense — no termites symbol",
    imageFit: "contain" as const,
  },
  {
    id: "mosquito",
    title: "Mosquito & Outdoor",
    description:
      "Yard treatments and standing-water guidance for season-long relief outdoors.",
    icon: "leaf" as const,
    image: "/images/services/mosquito.jpg",
    imageAlt: "Backyard and lawn for mosquito control",
  },
] as const

export const WHY_US = [
  {
    title: "Free Inspections",
    description: "No-pressure estimates. We explain what we find before any treatment.",
    icon: "search" as const,
  },
  {
    title: "Licensed Technicians",
    description: "Trained, background-checked pros using EPA-approved products.",
    icon: "badge" as const,
  },
  {
    title: "Same-Day Service",
    description: "Urgent infestations? Call early and we’ll do our best to be there today.",
    icon: "zap" as const,
  },
  {
    title: "Re-Treatment Promise",
    description: "If pests return between scheduled visits, we come back at no extra charge.",
    icon: "refresh" as const,
  },
] as const

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tell us what’s going on",
    description: "Call, text, or submit the form with your name, address, and pest details.",
  },
  {
    step: "02",
    title: "On-site inspection",
    description: "We identify entry points, nesting areas, and the right treatment plan.",
  },
  {
    step: "03",
    title: "Targeted treatment",
    description: "Interior and exterior service tailored to your property and pest type.",
  },
  {
    step: "04",
    title: "Follow-up & prevention",
    description: "Scheduled maintenance and tips to keep your space pest-free year-round.",
  },
] as const

export const TESTIMONIALS = [
  {
    quote:
      "Had ants in the kitchen for weeks. Pierce came out the same day and they were gone within days. Super professional.",
    name: "Maria G.",
    location: "Homeowner",
    initials: "MG",
  },
  {
    quote:
      "We manage twelve rental units. Pierce handles all our pest calls — fast reports and fair pricing every time.",
    name: "James T.",
    location: "Property Manager",
    initials: "JT",
  },
  {
    quote:
      "Termite scare during our home sale. Pierce explained everything, treated quickly, and helped us close on time.",
    name: "Sarah & David L.",
    location: "Home Sellers",
    initials: "SL",
  },
] as const

export const FAQ_ITEMS = [
  {
    question: "How quickly can you come out?",
    answer:
      "We offer same-day and next-day appointments when you call before early afternoon. Emergency situations are prioritized.",
  },
  {
    question: "Are your treatments safe for pets and children?",
    answer:
      "We use products according to label directions and will tell you when it’s safe to re-enter treated areas. Let us know about pets, aquariums, or sensitivities before service.",
  },
  {
    question: "Do I need to be home for the visit?",
    answer:
      "For most interior treatments, yes. Exterior-only services can often be done with exterior access. We’ll confirm when we schedule.",
  },
  {
    question: "How much does pest control cost?",
    answer:
      "Pricing depends on pest type, property size, and severity. Every job starts with a free inspection and a clear quote before work begins.",
  },
  {
    question: "Do you offer ongoing maintenance plans?",
    answer:
      "Yes — quarterly and monthly plans are available for homes and businesses to prevent recurring issues and save over one-time visits.",
  },
  {
    question: "What should I put in the request form?",
    answer:
      "Your name, full address, phone number, what pests you’re seeing (or suspect), and where you’ve noticed activity. Photos help but aren’t required.",
  },
] as const
