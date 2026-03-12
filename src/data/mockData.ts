export const testimonials = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  name: [
    "Alex Johnson", "Sarah Chen", "Marcus Rodriguez", "Elena Petrova", "David Smith",
    "Yuki Tanaka", "Amara Okafor", "James Wilson", "Sofia Garcia", "Liam Brown",
    "Emma Davis", "Noah Miller", "Olivia Wilson", "William Moore", "Sophia Taylor",
    "Mason Anderson", "Isabella Thomas", "Ethan Jackson", "Mia White", "Lucas Harris",
    "Charlotte Martin", "Benjamin Thompson", "Amelia Garcia", "Oliver Martinez", "Evelyn Robinson",
    "Jacob Clark", "Abigail Rodriguez", "Michael Lewis", "Harper Lee", "Alexander Walker",
    "Emily Hall", "Daniel Allen", "Elizabeth Young", "Henry Hernandez", "Avery King",
    "Sebastian Wright", "Scarlett Lopez", "Jack Hill", "Victoria Scott", "Samuel Green",
    "Madison Adams", "David Baker", "Luna Gonzalez", "Joseph Nelson", "Grace Carter",
    "Carter Mitchell", "Chloe Perez", "Owen Roberts", "Penelope Turner", "Wyatt Phillips",
    "Layla Campbell", "John Parker", "Riley Evans", "Jack Edwards", "Zoey Collins",
    "Luke Stewart", "Nora Sanchez", "Jayden Morris", "Lily Rogers", "Dylan Reed"
  ][i % 60],
  photo: `https://picsum.photos/seed/user${i}/100/100`,
  country: ["USA", "UK", "Canada", "Germany", "Japan", "Nigeria", "Spain", "Australia", "Brazil", "India"][i % 10],
  profession: ["Student", "Developer", "Startup Founder", "Business Owner", "UI Designer", "Marketing Manager"][i % 6],
  feedback: [
    "MukitX transformed our business with their incredible SaaS solution. Highly recommended!",
    "The recorded courses are so easy to follow. I learned React in just two weeks!",
    "Best digital products in the market. The automation tools saved me hours of work.",
    "Professional team and top-notch communication. Our mobile app is a huge success.",
    "The live sessions are interactive and very helpful. Mukit is a great mentor.",
    "I've bought multiple templates from MukitX, and they are all Apple-level quality.",
    "Their UI/UX design is simply stunning. It really elevated our brand identity.",
    "The manual payment process was smooth, and my course was unlocked within an hour.",
    "As a startup founder, I appreciate the efficiency and quality MukitX brings to the table.",
    "The community of students is amazing. I've made so many professional connections."
  ][i % 10]
}));

export const teamMembers = [
  {
    name: "Mukit Ahmed",
    position: "Founder & CEO",
    photo: "https://picsum.photos/seed/mukit/400/400",
    bio: "Visionary leader with 10+ years of experience in full-stack development and tech education.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Sarah Jenkins",
    position: "Lead Developer",
    photo: "https://picsum.photos/seed/sarah/400/400",
    bio: "Expert in React and Node.js, passionate about building scalable web applications.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "David Chen",
    position: "UI/UX Designer",
    photo: "https://picsum.photos/seed/david/400/400",
    bio: "Creating beautiful and intuitive user experiences with a focus on minimalism.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Elena Rodriguez",
    position: "Backend Engineer",
    photo: "https://picsum.photos/seed/elena/400/400",
    bio: "Specialist in database optimization and cloud infrastructure.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Michael Ross",
    position: "Marketing Manager",
    photo: "https://picsum.photos/seed/michael/400/400",
    bio: "Driving growth through data-driven digital marketing strategies.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Jessica Wu",
    position: "Project Manager",
    photo: "https://picsum.photos/seed/jessica/400/400",
    bio: "Ensuring timely delivery and high quality for all our client projects.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Kevin Smith",
    position: "Support Specialist",
    photo: "https://picsum.photos/seed/kevin/400/400",
    bio: "Dedicated to providing the best support for our students and customers.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Aisha Khan",
    position: "Mobile App Developer",
    photo: "https://picsum.photos/seed/aisha/400/400",
    bio: "Building high-performance cross-platform mobile applications.",
    socials: { twitter: "#", linkedin: "#", github: "#" }
  }
];

export const portfolioProjects = [
  {
    title: "EcoTrack SaaS",
    category: "SaaS Development",
    image: "https://picsum.photos/seed/project1/800/600",
    tech: ["Next.js", "Supabase", "Tailwind"],
    result: "Helped 500+ companies track their carbon footprint."
  },
  {
    title: "LuxeCommerce",
    category: "Web Development",
    image: "https://picsum.photos/seed/project2/800/600",
    tech: ["React", "Node.js", "Stripe"],
    result: "Increased sales by 40% for a luxury fashion brand."
  },
  {
    title: "HealthSync App",
    category: "Mobile App",
    image: "https://picsum.photos/seed/project3/800/600",
    tech: ["React Native", "Firebase"],
    result: "Top-rated health app with 100k+ downloads."
  },
  {
    title: "Fintech Dashboard",
    category: "UI/UX Design",
    image: "https://picsum.photos/seed/project4/800/600",
    tech: ["Figma", "Adobe XD"],
    result: "Streamlined financial reporting for a major bank."
  }
];

export const courses = [
  {
    id: "1",
    title: "Mastering Full-Stack Development",
    instructor: "Mukit Ahmed",
    price: 99,
    type: "recorded",
    thumbnail: "https://picsum.photos/seed/course1/600/400",
    duration: "20 Hours",
    description: "Learn to build modern web applications from scratch using React, Node.js, and Supabase."
  },
  {
    id: "2",
    title: "Advanced UI/UX Design Principles",
    instructor: "David Chen",
    price: 79,
    type: "live",
    thumbnail: "https://picsum.photos/seed/course2/600/400",
    duration: "10 Sessions",
    description: "Join our live sessions to master the art of creating premium user interfaces."
  },
  {
    id: "3",
    title: "SaaS Architecture & Scaling",
    instructor: "Mukit Ahmed",
    price: 149,
    type: "recorded",
    thumbnail: "https://picsum.photos/seed/course3/600/400",
    duration: "15 Hours",
    description: "Deep dive into building and scaling multi-tenant SaaS applications."
  }
];

export const digitalProducts = [
  {
    id: "p1",
    title: "SaaS Starter Template",
    description: "A complete Next.js + Supabase starter kit for your next SaaS project.",
    price: 49,
    image: "https://picsum.photos/seed/prod1/600/400"
  },
  {
    id: "p2",
    title: "Automation Script Bundle",
    description: "Python scripts to automate your daily marketing and dev tasks.",
    price: 29,
    image: "https://picsum.photos/seed/prod2/600/400"
  },
  {
    id: "p3",
    title: "Premium UI Kit",
    description: "A collection of 100+ Apple-style UI components for Figma.",
    price: 39,
    image: "https://picsum.photos/seed/prod3/600/400"
  }
];
