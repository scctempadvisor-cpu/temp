/**
 * Single source of truth for SEO, structured data and AI-crawler content.
 * Set NEXT_PUBLIC_SITE_URL to the production domain when this page goes live
 * (Netlify's build-time URL is used automatically for preview deployments).
 */
const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://steelcommandercorp.com";

export const SITE = {
  url: rawUrl.replace(/\/+$/, ""),
  name: "Steel Commander Corp",
  shortName: "Steel Commander",
  legalName: "Steel Commander Corp",
  title: "Prefabricated Steel Building Kits | Steel Commander Corp",
  description:
    "American-made, pre-engineered steel building kits shipped factory direct. Engineered to your state's building codes for commercial, agricultural, garage, barndominium and storage use.",
  tagline: "The superior choice for steel building kits",
  locale: "en_US",
  phone: "+1-844-722-4766",
  phoneLabel: "844.722.4766",
  phoneVanity: "844.SCC.IRON",
  ogImage: "/scc/featured.jpg",
  logo: "/scc/logo-260.png",
  address: {
    street: "2200 Corporate Blvd NW Ste 402",
    city: "Boca Raton",
    region: "FL",
    postalCode: "33431",
    country: "US",
  },
  mapUrl: "https://g.page/steel-commander-corp",
  sameAs: [
    "https://www.facebook.com/steelcommandercorp",
    "https://twitter.com/SCommanderCorp",
    "https://www.instagram.com/steelcommandercorp/",
    "https://www.linkedin.com/company/steel-commander-corp",
    "https://www.youtube.com/@SteelCommanderCorp",
    "https://www.bbb.org/us/fl/boca-raton/profile/metal-building/steel-commander-0633-90566615",
  ],
  keywords: [
    "steel building kits",
    "prefabricated steel buildings",
    "pre-engineered metal buildings",
    "metal building kits",
    "steel garage kits",
    "barndominium kits",
    "agricultural steel buildings",
    "commercial steel buildings",
    "steel warehouse buildings",
    "aircraft hangar kits",
    "horse barn steel buildings",
    "self storage building kits",
    "rigid frame steel buildings",
    "C-channel steel buildings",
    "red iron steel buildings",
    "American-made steel buildings",
  ],
};

export const abs = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Building types offered (mirrors the Plan Room + Use cases sections). */
export const OFFERINGS: { name: string; url: string; description: string }[] = [
  {
    name: "Commercial steel buildings",
    url: "https://steelcommandercorp.com/commercial-steel-buildings-prefab-american-metal-building-kits/",
    description: "Retail, office and light-industrial buildings with storefronts, dock doors and drive-ins.",
  },
  {
    name: "Agricultural steel buildings",
    url: "https://steelcommandercorp.com/agriculture-steel-buildings/",
    description: "Machine sheds, hay storage and equipment barns with wide clear spans.",
  },
  {
    name: "Steel garage buildings",
    url: "https://steelcommandercorp.com/steel-buildings/garage-steel-buildings/",
    description: "One-car to multi-bay garages with no wood to rot and nothing for termites to eat.",
  },
  {
    name: "Steel building homes and barndominiums",
    url: "https://steelcommandercorp.com/steel-building-homes/",
    description: "Barndominiums and steel homes with open floor plans and an attached shop.",
  },
  {
    name: "Steel workshop buildings",
    url: "https://steelcommandercorp.com/steel-building-kits/",
    description: "Drive-through bays, office lean-tos and room for every tool and project.",
  },
  {
    name: "Steel warehouse and industrial buildings",
    url: "https://steelcommandercorp.com/steel-warehouse-buildings/",
    description: "Warehouses and plants with tall eaves for pallet racking, mezzanines and cranes.",
  },
  {
    name: "Steel aircraft hangars",
    url: "https://steelcommandercorp.com/metal-hangar-buildings/",
    description: "Clear-span hangars with room for large hydraulic doors, a pilot lounge and a parts room.",
  },
  {
    name: "Metal horse barns",
    url: "https://steelcommandercorp.com/metal-horse-barns/",
    description: "Stalls, tack and wash rooms, raised center aisles and covered riding arenas.",
  },
  {
    name: "Self-storage building kits",
    url: "https://steelcommandercorp.com/self-storage-building-kits/",
    description: "Self-storage runs plus RV and boat storage that can expand as occupancy grows.",
  },
  {
    name: "Recreational and sports steel buildings",
    url: "https://steelcommandercorp.com/recreational-steel-buildings/",
    description: "Gyms, indoor courts, community centers and event spaces under one clear-span roof.",
  },
];

/** Visible on the page (FAQ section) and mirrored in FAQPage JSON-LD + llms.txt. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is a pre-engineered steel building kit?",
    a: "A pre-engineered steel building kit is a complete metal building package (primary steel frames, secondary framing such as purlins and girts, roof and wall panels, trim and fasteners) that is designed and fabricated in the factory, then shipped to your site ready to erect. Steel Commander Corp kits are American-made and shipped factory direct.",
  },
  {
    q: "Are Steel Commander buildings engineered for my state's building codes?",
    a: "Yes. Steel Commander Corp creates a detailed engineering plan that is custom to your property and adheres to your state's specifications, including wind and snow loads. Every state has its own building codes, and our steel building experts handle them for you.",
  },
  {
    q: "What is the difference between a C-channel and a rigid frame (I-beam) steel building?",
    a: "A C-channel building is the simplest and most economical system, using cold-formed steel with less engineering time and no welding during manufacturing, which suits garages, shops and storage. A rigid frame, or red iron I-beam, building puts most of the steel where bending and shear stresses are highest, so it handles heavy snow, wind and collateral loads for commercial buildings, hangars, homes and agricultural buildings.",
  },
  {
    q: "What can I use a Steel Commander steel building for?",
    a: "Popular uses include agricultural buildings and barns, self-storage, aircraft hangars, workshops, commercial and retail buildings, garages, livestock barns, warehouses and industrial plants, horse barns and arenas, recreational and sports facilities, and residential steel homes or barndominiums.",
  },
  {
    q: "Why choose steel instead of wood for a building?",
    a: "Steel is consistent from piece to piece, does not split, rot or warp, is non-combustible, resists termites, mold and mildew, and is recyclable at the end of a building's life. Clear-span steel framing also gives you open interiors without interior columns.",
  },
  {
    q: "Can I design my own steel building online?",
    a: "Yes. The Steel Commander 3D building designer lets you configure size, roof pitch, lean-tos, doors and colors online, then send the design straight to a steel building expert for pricing.",
  },
  {
    q: "Does Steel Commander offer financing for steel buildings?",
    a: "Yes. Steel Commander Corp offers financing with a 60-second pre-qualification that does not affect your credit score, and funding can be available as soon as the next day.",
  },
  {
    q: "Who installs a Steel Commander steel building?",
    a: "Kits ship factory direct, ready for your crew. If you need an installer, you can find builders in your area through Steel Commander's partnership with the Metal Building Contractors & Erectors Association (MBCEA).",
  },
  {
    q: "How do I get a quote for a steel building kit?",
    a: "Request a free quote online at steelcommandercorp.com/contact or call a steel building expert at 844.722.4766 (844.SCC.IRON). Tell us what you are building and we will help you plan the right steel structure for your project.",
  },
];

/** JSON-LD @graph for the homepage. */
export function homeJsonLd() {
  const org = `${SITE.url}/#organization`;
  const website = `${SITE.url}/#website`;
  const page = `${SITE.url}/#webpage`;
  const address = {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "HomeAndConstructionBusiness"],
        "@id": org,
        name: SITE.name,
        legalName: SITE.legalName,
        alternateName: ["Steel Commander", "SCC"],
        url: SITE.url,
        logo: { "@type": "ImageObject", url: abs(SITE.logo), width: 239, height: 69 },
        image: abs(SITE.ogImage),
        description: SITE.description,
        slogan: SITE.tagline,
        telephone: SITE.phone,
        address,
        hasMap: SITE.mapUrl,
        areaServed: { "@type": "Country", name: "United States" },
        priceRange: "$$",
        sameAs: SITE.sameAs,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SITE.phone,
            contactType: "sales",
            areaServed: "US",
            availableLanguage: ["English"],
          },
        ],
        knowsAbout: [
          "Pre-engineered steel buildings",
          "Metal building kits",
          "Rigid frame (red iron) steel buildings",
          "C-channel steel buildings",
          "Steel building engineering and state building codes",
          "Barndominiums",
          "Agricultural steel buildings",
          "Aircraft hangars",
        ],
        memberOf: {
          "@type": "Organization",
          name: "Metal Building Contractors & Erectors Association (MBCEA)",
          url: "https://www.mbcea.org/",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Steel building kits",
          itemListElement: OFFERINGS.map((o, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: o.name,
              description: o.description,
              url: o.url,
              serviceType: "Pre-engineered steel building kit",
              provider: { "@id": org },
              areaServed: { "@type": "Country", name: "United States" },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en-US",
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": page,
        url: `${SITE.url}/`,
        name: SITE.title,
        description: SITE.description,
        inLanguage: "en-US",
        isPartOf: { "@id": website },
        about: { "@id": org },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(SITE.ogImage), width: 1200, height: 619 },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` }],
        },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#faq-heading", "[data-speakable]"] },
        mainEntity: { "@id": `${SITE.url}/#faq` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        isPartOf: { "@id": page },
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
