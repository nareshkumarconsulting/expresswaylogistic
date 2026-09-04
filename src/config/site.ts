export const siteConfig = {
  name: "ExpressWay Logistic",
  legalName: "Expressway Logistic Private Limited",
  shortName: "ExpressWay",
  tagline: "PAN India Freight Forwarding & Global Logistics",
  description:
    "ExpressWay Logistic is a Neutral Logistics Provider for PAN India freight forwarding — ocean, air, customs, EXIM advisory, and door-to-door logistics worldwide.",
  url: "https://expresswaylogistic.com",
  locale: "en_IN",
  contact: {
    email: "sales@expresswaylogistics.com",
    phone: "+91 98736 93160",
    phoneHref: "tel:+919873693160",
    whatsapp: "919873693160",
    address:
      "Unit No. 623, 6th Floor, Tower-1, Assotech Business Cresterra, Sector-135, Noida, G.B. Nagar, Uttar Pradesh 201305",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/expresswaylogistic",
    twitter: "https://twitter.com/expresswaylog",
    facebook: "https://www.facebook.com/expresswaylogistic",
    instagram: "https://www.instagram.com/expresswaylogistic",
  },
  nav: [
    { name: "Services", href: "/services" },
    { name: "Industries", href: "/industries" },
    { name: "PAN India", href: "/pan-india-logistics" },
    { name: "Routes", href: "/shipping-routes" },
    { name: "About", href: "/about" },
    { name: "Track", href: "/track" },
  ],
  cta: {
    primary: { label: "Get a Quote", href: "/quote" },
    secondary: { label: "Track Shipment", href: "/track" },
    command: { label: "Ops Login", href: "/command-center" },
  },
} as const;

export type SiteConfig = typeof siteConfig;
