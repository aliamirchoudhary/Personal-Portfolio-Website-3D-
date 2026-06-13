export const PERSONAL = {
  name:         "Muhammad Ali Aamir",
  title:        "Data Science & AI Enthusiast | Full Stack Developer | Founder of WebCraft",
  email:        "aliamirchoudhary@gmail.com",
  phone:        "+923283173130",
  location:     "Lahore, Pakistan",
  availability: "Available for freelance projects",
  languages:    "Fluent in English, Urdu & Punjabi",
  resumeUrl:    "/Muhammad_Ali_Aamir_Resume.pdf",
  profileImage: "/profile.jpg",
};

export const ABOUT_TEXT = [
  `I am a dedicated Data Science Enthusiast and passionate Full Stack Developer with an insatiable curiosity for technology and innovation, exploring the intersections of machine learning, artificial intelligence, and modern web development.`,
  `Based in Lahore, Pakistan, I'm currently studying BS Data Science at FAST NUCES, Lahore. I love transforming complex problems into clean, efficient code and building digital experiences that are both powerful and elegant.`,
  `I am also the founder of WebCraft, a professional digital brand I founded to provide high-performance, end-to-end web solutions for service-oriented businesses. My journey in technology is driven by a deep passion for creating meaningful digital experiences. Whether it's training models on real-world data, developing responsive web applications, diving into machine learning algorithms, or exploring the latest in AI, I approach every project with enthusiasm and dedication to excellence.`,
];

export const ABOUT_HIGHLIGHTS = [
  "Data Science Enthusiast", "Full Stack Developer",
  "FAST NUCES", "BS Data Science", "Lahore, Pakistan",
  "WebCraft",
];

export const WEBCRAFT = {
  name: "WebCraft",
  url:  "https://webcraft-dev.vercel.app",
  svgInner: `
    <polygon points="12,2 20,6.5 20,17.5 12,22 4,17.5 4,6.5"
      stroke="#99FFCC" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
    <polygon points="12,5.4 17.1,8.4 17.1,15.6 12,18.6 6.9,15.6 6.9,8.4"
      stroke="#99FFCC" stroke-width="1.6" stroke-linejoin="round" fill="none"/>
    <text x="12" y="15.25" text-anchor="middle"
      font-family="sans-serif" font-size="7.5" font-weight="700" fill="#99FFCC">W</text>
  `,
};

export const SOCIAL_LINKS = [
  { icon: "fa-envelope",    href: "mailto:aliamirchoudhary@gmail.com",                           label: "Email",     fa: "fas" },
  { icon: "fa-phone",       href: "tel:+923283173130",                                           label: "Phone",     fa: "fas" },
  { icon: "fa-facebook-f",  href: "https://www.facebook.com/share/177cJ6ccx3/",                  label: "Facebook",  fa: "fab" },
  { icon: "fa-instagram",   href: "https://www.instagram.com/maacmarketingservice/",             label: "Instagram", fa: "fab" },
  { icon: "fa-dollar-sign", href: "https://www.fiverr.com/s/2Kg9QKV",                            label: "Fiverr",    fa: "fas" },
  { icon: "fa-linkedin-in", href: "https://www.linkedin.com/in/muhammad-ali-aamir2558",          label: "LinkedIn",  fa: "fab" },
  { icon: "fa-github",      href: "https://github.com/aliamirchoudhary",                         label: "GitHub",    fa: "fab" },
  { icon: "fa-twitter",     href: "https://x.com/maacaffliate?t=vc7ALr4cu8ciZkAfUTeR5A&s=09",  label: "Twitter/X", fa: "fab" },
];

export const SERVICES = [
  {
    id:        "service-1",
    icon:      "fas fa-code",
    title:     "Full Stack Web Development",
    shortDesc: "High-performance, end-to-end web solutions using React, Node.js, Flask, or MERN stack.",
    link:      { href: "https://webcraft-dev.vercel.app", label: "Visit" },
    modal: {
      title:       "Full Stack Web Development",
      description: "I will provide full stack high-performance, end-to-end web solutions for service-oriented businesses using React, Node.js, Flask, or MERN stack. From responsive frontend designs to scalable backend architectures, database integration, and deployment — I deliver complete solutions that drive business growth.",
      sections: [
        { heading: "What I Offer", items: [
          "Full-stack development with React, Vue.js, or Next.js frontend",
          "Scalable backend APIs using Node.js/Express or Python/Flask",
          "Database design and management (DB, MSSQL)",
          "User authentication, authorization, and security implementation",
          "Cloud deployment on AWS, Google Cloud, or Vercel",
          "Performance optimization and SEO",
        ]},
        { heading: "Perfect For", items: [
          "SaaS platforms and business applications",
          "E-commerce websites with complex features",
          "Booking and scheduling platforms",
          "Social networking applications",
        ]},
      ],
      tech: "React, Node.js, Flask, MSSQL",
      price: "$299 for basic applications",
      delivery: "1-3 weeks depending on complexity",
      link: { href: "https://webcraft-dev.vercel.app", label: "Visit" },
    },
  },
  {
    id: "service-2",
    icon: "fas fa-paint-brush",
    title: "Design to Web",
    shortDesc: "Pixel perfect responsive website from Figma to React or Tailwind — engineered for speed.",
    link: { href: "https://www.fiverr.com/s/2K2ja6V", label: "View on Fiverr" },
    modal: {
      title: "Design to Web",
      description: "I will build a pixel perfect responsive website from Figma to React or Tailwind. As a technical developer focused on logical optimization, I don't just \"build\" pages — I engineer them for speed and responsiveness.",
      sections: [
        { heading: "What You Will Get", items: [
          "Figma to React / Next.js conversion (High-fidelity)",
          "Fully responsive web design using Tailwind CSS",
          "Clean, modular, and well-commented code",
          "Interactive UI elements with smooth animations",
          "Pixel perfect implementation & cross-browser compatibility",
          "Performance optimized with lazy loading and code splitting",
          "SEO-friendly semantic HTML structure",
          "Mobile-first approach with responsive breakpoints",
        ]},
        { heading: "Why Choose Me", items: [
          "Technical precision with attention to design details",
          "Fast turnaround with professional quality",
          "Clean code that's easy to maintain and scale",
          "Direct communication and project transparency",
        ]},
      ],
      tech: "React, Next.js, Tailwind CSS, TypeScript",
      price: "$25 for simple landing pages",
      delivery: "2-5 days",
      link: { href: "https://www.fiverr.com/s/2K2ja6V", label: "View on Fiverr" },
    },
  },
  {
    id: "service-3",
    icon: "fas fa-laptop-code",
    title: "Front-End Web Development",
    shortDesc: "Responsive landing pages and templates with HTML, CSS, JS and Bootstrap.",
    link: { href: "https://fiverr.com/", label: "View on Fiverr" },
    modal: {
      title: "Front-End Web Development",
      description: "I will create responsive landing pages and templates with HTML, CSS, JS and Bootstrap that look modern, load fast, and work perfectly on every device. Whether you need a sleek startup landing page, a product launch site, or a personal portfolio, I deliver clean, hand-coded solutions with attention to detail.",
      sections: [],
      tech: "HTML5, CSS3, JavaScript, Bootstrap",
      price: "Contact for pricing",
      delivery: "2-4 days",
      link: { href: "https://fiverr.com/", label: "View on Fiverr" },
    },
  },
];

export const EDUCATION = [
  {
    id: "edu-1", year: "2024 - Present", degree: "Bachelor of Data Science",
    institution: "FAST-NUCES, Lahore",
    courses: ["Data Structures and Algorithms","Object Oriented Programming","Multi-Variable Calculus","Computer Organization and Assembly Language","Database Systems","Calculus and Analytical Geometry","Operating Systems","Introduction to Data Sciences","Linear Algebra","Discrete Mathematics"],
  },
  {
    id: "edu-2", year: "2023 - 2024", degree: "Full Stack Web Development",
    institution: "Self Study and Online Resources",
    courses: ["HTML5","CSS","JavaScript","React.js","Tailwind CSS","DOM Manipulations","AI Prompting"],
  },
  {
    id: "edu-3", year: "2023 - 2024", degree: "FSc. Pre-Engineering",
    institution: "Self Study and Online Resources",
    courses: ["Additional Mathematics"],
  },
  {
    id: "edu-4", year: "2021 - 2023", degree: "FSc. Pre-Medical",
    institution: "Oxbridge College, Rahim Yar Khan",
    courses: ["Biology","Physics","Organic Chemistry","Physical Chemistry"],
  },
  {
    id: "edu-5", year: "2019 - 2021", degree: "SSC Matriculation Pre-Medical",
    institution: "National Garrison Secondary School, RYK",
    courses: ["Public Speaking","Biology","Physics","Chemistry","Mathematics"],
  },
];

export const TECHNICAL_SKILLS = [
  { name: "C++", pct: 93 }, { name: "C", pct: 90 }, { name: "Python", pct: 88 },
  { name: "JavaScript", pct: 85 }, { name: "SQL", pct: 87 }, { name: "React", pct: 82 },
  { name: "Flask", pct: 80 }, { name: "MultiVariable Calculus", pct: 82 },
  { name: "Linear Algebra", pct: 85 }, { name: "Assembly Language", pct: 79 },
  { name: "Model Training", pct: 83 }, { name: "Machine Learning", pct: 84 },
  { name: "Git / GitHub", pct: 90 },
];

export const PROFESSIONAL_SKILLS = [
  { name: "Problem Solving", pct: 95 }, { name: "Logical Reasoning", pct: 92 },
  { name: "Communication", pct: 88 }, { name: "Team Collaboration", pct: 90 },
  { name: "Project Management", pct: 85 }, { name: "Continuous Learning", pct: 98 },
];

export const PROJECTS = [
  { id: "criclytics", name: "Criclytics",
    description: "Criclytics is an intelligent cricket analytics platform that transforms historical match data into context-aware probabilities and interpretable machine-learning insights for players, teams, and venues.",
    tags: ["Python","HTML","CSS","JavaScript"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/Criclytics.git" },{ label: "Visit", icon: "fas fa-globe", url: "https://criclytics.aliamirchoudhary.workers.dev/" }],
    modal: { title: "Criclytics", description: "Criclytics is an intelligent cricket analytics platform that transforms historical match data into context-aware probabilities and interpretable machine-learning insights for players, teams, and venues.", tech: "Python, HTML, CSS, JavaScript" },
  },
  { id: "fashion", name: "Fashion Image Classifier",
    description: "Clothing image classifier that predicts fashion categories using a CNN (92.25% accuracy) and Random Forest (87.56% accuracy).",
    tags: ["Python","Jupyter","TensorFlow","Streamlit"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/Fashion-Image-Classifier.git" }],
    modal: { title: "Fashion Image Classifier", description: "Clothing image classifier predicting 8 fashion categories using CNN (92.25% accuracy) and Random Forest (87.56% accuracy).", tech: "Python, Jupyter, TensorFlow, Streamlit" },
  },
  { id: "travelbuddy", name: "TravelBuddy",
    description: "Full-stack web application to revolutionize travel planning and social connections. Built with ReactJS, NodeJS, SQL, and AI integration.",
    tags: ["ReactJS","NodeJS","SQL","AI"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/HassanNawaz14/Travel-Buddy-.git" }],
    modal: { title: "TravelBuddy", description: "TravelBuddy is a full-stack web application designed to revolutionize how people plan and experience travel. Built with ReactJS, NodeJS, SQL, and AI integration, the platform bridges smart trip planning with genuine social connections.", tech: "ReactJS, NodeJS, SQL, AI" },
  },
  { id: "webcraft", name: "Webcraft",
    description: "Freelance web developer portfolio with animated UI, service showcases, order & contact forms with real email delivery via Gmail SMTP, and serverless deployment.",
    tags: ["HTML","CSS","JavaScript","Node.js"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/webcraft.git" },{ label: "Visit", icon: "fas fa-globe", url: "https://webcraft-dev.vercel.app" }],
    modal: { title: "Webcraft", description: "WebCraft — freelance web developer portfolio with animated UI, service showcases, order & contact forms with real email delivery via Gmail SMTP, and serverless deployment.", tech: "HTML, CSS, JavaScript, Node.js" },
  },
  { id: "flappy", name: "Flappy Bird Game",
    description: "Faithful recreation of Flappy Bird in 16-bit assembly language for iAPX8088 processors. Physics-based gravity and procedurally generated pipe obstacles.",
    tags: ["Assembly Language","iAPX8088"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/Flappy-Bird---IAPX8088-Assembly-Game.git" }],
    modal: { title: "Flappy Bird Game", description: "A faithful recreation of the iconic Flappy Bird game written in 16-bit assembly language for iAPX8088 processors. Navigate a bird through procedurally generated pipe obstacles with physics-based gravity and flap mechanics.", tech: "Assembly Language, iAPX8088" },
  },
  { id: "bubble", name: "Bubble Shooter Game",
    description: "Classic arcade-style bubble shooter in 16-bit assembly for iAPX8088. Control a shooter at the bottom to pop falling green bubbles.",
    tags: ["Assembly Language","iAPX8088"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/Bubble-Shooter---IAPX8088-Assembly-Game.git" }],
    modal: { title: "Bubble Shooter Game", description: "A classic arcade-style bubble shooter game written in 16-bit assembly language for iAPX8088 processors. Control a shooter at the bottom of the screen to pop falling green bubbles before they reach you.", tech: "Assembly Language, iAPX8088" },
  },
  { id: "solar", name: "Solar Panel System Predictor",
    description: "C++ console-based solar energy predictor. Estimates optimal panel configurations including types, inverters, batteries, and wiring based on house area and energy consumption.",
    tags: ["C++","File I/O"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/Solar-Panel-System-Predictor.git" }],
    modal: { title: "Solar Panel System Predictor", description: "Developed a C++ console-based solar energy system predictor. It estimates optimal solar panel configurations, including panel types, inverters, batteries, and wiring, based on user inputs like house area and energy consumption.", tech: "C++, File I/O" },
  },
  { id: "relive", name: "ReLive Social Media App",
    description: "Console-based social network simulation in C++ without STL. Demonstrates OOP: inheritance, encapsulation, and polymorphism.",
    tags: ["C++","OOP","Inheritance","Encapsulation","Polymorphism"],
    links: [{ label: "GitHub", icon: "fab fa-github", url: "https://github.com/aliamirchoudhary/ReLive-Social-Media-App.git" }],
    modal: { title: "ReLive Social Media App", description: "The ReLive App is a simple console-based social network simulation built entirely in C++ without using built-in functions or STL containers. This project reflects the core concepts of OOP including inheritance, encapsulation, and polymorphism.", tech: "C++, OOP" },
  },
];

export const NAV_LINKS = [
  { label: "Home",      id: "home"      },
  { label: "About",     id: "about"     },
  { label: "Services",  id: "services"  },
  { label: "Education", id: "education" },
  { label: "Skills",    id: "skills"    },
  { label: "Projects",  id: "projects"  },
  { label: "Contact",   id: "contact"   },
];

export const CONTACT_FORM_ACTION = "https://formspree.io/f/mzzayavg";
