export const personalInfo = {
  name: 'Suman Raj Khanal',
  title: 'Full Stack Developer · App Developer · DevOps Engineer · Web3 Developer',
  location: 'Kathmandu, Nepal',
  email: 'sumanrajkhanal@gmail.com',
  github: 'https://github.com/srksuman',
  linkedin: 'https://www.linkedin.com/in/suman-raj-khanal/',
  tagline: 'Builder, problem solver, and scalable systems developer.',
  available: true,
};

export const stats = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Shipped' },
  { value: 3, suffix: '', label: 'Ventures Founded' },
];

export const education = [
  {
    degree: 'BSc (Hons) Computer Science',
    institution: 'University of Wolverhampton',
    year: '2022',
    achievement: 'BATCH TOPPER: Graduated top of Batch',
  },
  {
    degree: 'Master of International MBA (IMBA)',
    institution: 'University of Wolverhampton',
    year: 'Ongoing',
    achievement: 'Currently Enrolled',
  },
];

export const experience = [
  {
    period: '2024 – Present',
    role: 'Senior Full Stack Developer & DevOps Lead',
    bullets: [
      'Architecting and deploying scalable microservices on AWS/VPS',
      'CI/CD pipelines, containerization with Docker, Nginx reverse proxy',
      'Leading full-stack projects from spec to production',
    ],
  },
  {
    period: '2022 – 2024',
    role: 'Full Stack Developer',
    bullets: [
      'Built and shipped multiple client web and mobile applications',
      'REST API design, authentication systems, third-party integrations',
      'React.js, Next.js frontends with Node.js/Express backends',
    ],
  },
  {
    period: '2020 – 2022',
    role: 'Junior Developer & Freelancer',
    bullets: [
      'Started professional development career during final year of BSc',
      'Delivered English Learning Platform (capstone + real-world product)',
      'Freelance web projects for local and international clients',
    ],
  },
];

export const projects = [
  {
    title: 'GangstaBet',
    subtitle: 'Web3 Gaming Platform',
    url: 'https://gangstabet.io',
    description: 'Full-stack Web3 gaming/betting platform built on blockchain. Smart contract integration, wallet connect, real-time game state.',
    stack: ['React.js', 'Node.js', 'Solidity', 'Web3.js', 'MongoDB'],
    tags: ['Web3', 'Blockchain', 'DeFi Gaming'],
    featured: true,
  },
  {
    title: 'GangstaVerse Ecosystem',
    subtitle: 'Decentralized Gaming Universe',
    url: 'https://gangstaverse.co',
    description: 'GangWars strategy game with complex game logic, on-chain assets, leaderboards, NFT integration.',
    stack: ['Next.js', 'Node.js', 'Blockchain', 'REST APIs', 'WebSockets'],
    tags: ['Web3', 'NFT', 'Strategy Game'],
    featured: true,
  },
  {
    title: 'Vendetta Game',
    subtitle: 'Competitive Web3 Game',
    url: 'https://vendettagame.xyz',
    description: 'Competitive Web3 game with on-chain mechanics and real-time multiplayer.',
    stack: ['React', 'Node.js', 'Smart Contracts', 'Web3'],
    tags: ['Web3', 'Gaming', 'Blockchain'],
    featured: false,
  },
  {
    title: 'Katha Ghar',
    subtitle: 'Mobile App',
    url: '',
    description: 'Nepali storytelling and literature mobile application. Cross-platform iOS/Android with audio content, offline support.',
    stack: ['React Native', 'Node.js', 'MongoDB', 'AWS S3'],
    tags: ['Mobile App', 'React Native', 'Content Platform'],
    featured: false,
  },
  {
    title: 'English Learning Platform',
    subtitle: 'EdTech - Final Year Project',
    url: '',
    description: 'Virtual English learning platform with structured lessons, user tracking, progress analytics. Batch Topper project.',
    stack: ['React.js', 'Node.js', 'Express', 'MongoDB'],
    tags: ['EdTech', 'Full Stack', '2022'],
    featured: false,
  },
  {
    title: 'ThriftFindNP',
    subtitle: 'E-Commerce Marketplace (Founder)',
    url: '',
    description: "Nepal's online thrift marketplace with product listings, search/filter, payments, and seller dashboard.",
    stack: ['Next.js', 'Node.js', 'MongoDB', 'Payment Gateway'],
    tags: ['E-Commerce', 'Founder', 'Full Stack'],
    featured: false,
  },
  {
    title: 'Client Projects',
    subtitle: 'International Client Portfolio',
    url: '',
    description: 'Multiple full-stack web apps including REST API platforms, admin dashboards, and SaaS tools. Docker deployments, CI/CD, VPS setup.',
    stack: ['React', 'Node.js', 'Docker', 'Nginx', 'CI/CD'],
    tags: ['Client Work', 'DevOps', 'APIs'],
    featured: false,
  },
];

export const skills = {
  Frontend: [
    'HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript',
    'React.js', 'Next.js', 'Redux / Zustand',
    'Responsive Design', 'Tailwind CSS', 'CSS Animations',
    'UI/UX Principles', 'Figma',
  ],
  Backend: [
    'Node.js', 'Express.js',
    'REST API Design', 'GraphQL',
    'JWT / OAuth2 / Sessions',
    'Microservices Architecture',
    'WebSockets / Real-time',
  ],
  Database: [
    'MongoDB', 'Mongoose ODM',
    'MySQL', 'PostgreSQL',
    'Redis', 'Database Design & Optimization',
  ],
  'Mobile Development': [
    'React Native', 'Expo',
    'Cross-platform iOS & Android',
    'Mobile UX Patterns', 'Push Notifications',
  ],
  'DevOps & Cloud': [
    'Docker', 'Docker Compose',
    'CI/CD (GitHub Actions)',
    'AWS (EC2, S3, CloudFront)',
    'VPS / Linux Admin',
    'Nginx', 'SSL/TLS',
    'PM2',
  ],
  'Web3 / Blockchain': [
    'Blockchain (EVM)',
    'Solidity',
    'Ethers.js / Web3.js',
    'Wallet Connect',
    'NFT Standards (ERC-721, ERC-20)',
    'dApp Development',
  ],
  'Tools & Workflow': [
    'Git / GitHub / GitFlow',
    'Postman', 'Linux CLI / Bash',
    'VS Code', 'Agile / Scrum',
  ],
};

export const ventures = [
  {
    name: 'ThriftFindNP',
    role: 'Founder',
    description: "Nepal's dedicated online thrift marketplace. Built the entire platform from scratch: concept, design, development, and launch. Connecting buyers and sellers of second-hand goods across Nepal.",
  },
  {
    name: 'Blueberry Thrift',
    role: 'Co-Founder',
    description: 'Fashion-forward thrift and sustainable clothing brand. Technology meets fashion: built the digital presence, e-commerce integration, and brand identity.',
  },
];

export const services = [
  {
    number: '01',
    title: 'Full Stack Web Development',
    description: 'Custom web apps, SaaS platforms, dashboards, APIs',
  },
  {
    number: '02',
    title: 'Mobile App Development',
    description: 'Cross-platform iOS & Android with React Native',
  },
  {
    number: '03',
    title: 'DevOps & Cloud Deployment',
    description: 'Docker, CI/CD, AWS, VPS setup, server management',
  },
  {
    number: '04',
    title: 'Web3 Development',
    description: 'Smart contracts, dApps, NFT platforms, DeFi tools',
  },
  {
    number: '05',
    title: 'Custom Software Solutions',
    description: 'Architecture design, technical consulting, MVPs',
  },
];

export const achievements = [
  { value: 4, suffix: '+', label: 'Years of Professional Experience' },
  { value: 20, suffix: '+', label: 'Real-World Projects Shipped' },
  { value: 3, suffix: '', label: 'Ventures Founded / Co-Founded' },
  { value: 1, suffix: 'st', label: 'Batch Topper, BSc CS 2022' },
  { value: 2, suffix: '', label: 'Active Web3 Platforms Live' },
];

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Ventures', href: '#ventures' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export const skillIcons: Record<string, string> = {
  Frontend: '🎨',
  Backend: '⚙️',
  Database: '🗄️',
  'Mobile Development': '📱',
  'DevOps & Cloud': '☁️',
  'Web3 / Blockchain': '🔗',
  'Tools & Workflow': '🛠️',
};
