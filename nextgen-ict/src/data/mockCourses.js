export const mockCourses = [
  {
    id: "c001",
    title: "ICT Theory - Grade 12",
    shortTitle: "ICT Grade 12",
    description: "Complete ICT theory covering all chapters for the A/L exam. Includes past papers, model papers, and structured notes.",
    price: 3500,
    category: "Theory",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=220&fit=crop",
    teacher: "Mr. Kasun Perera",
    totalLessons: 24,
    duration: "48 hours",
    rating: 4.8,
    students: 312,
    lessons: [
      {
        id: "l001", title: "Introduction to ICT", youtubeId: "rfscVS0vtbw",
        duration: "45 min", hasNotes: true, hasPdf: true,
        description: "Overview of ICT, its applications and importance in modern society."
      },
      {
        id: "l002", title: "Number Systems", youtubeId: "1GSjbWt0c9M",
        duration: "50 min", hasNotes: true, hasPdf: true,
        description: "Binary, Decimal, Octal and Hexadecimal number systems with conversion methods."
      },
      {
        id: "l003", title: "Data Representation", youtubeId: "M4d3FXu9-U8",
        duration: "40 min", hasNotes: false, hasPdf: true,
        description: "How data is stored and represented in computer systems."
      },
      {
        id: "l004", title: "Computer Hardware", youtubeId: "ExxFxD4OSZ0",
        duration: "55 min", hasNotes: true, hasPdf: false,
        description: "CPU, RAM, ROM, storage devices and I/O devices explained."
      },
    ]
  },
  {
    id: "c002",
    title: "Programming Fundamentals",
    shortTitle: "Programming",
    description: "Learn Python and Java basics with practical projects. Covers algorithms, data structures, and problem solving.",
    price: 4500,
    category: "Programming",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=220&fit=crop",
    teacher: "Ms. Dilrukshi Fernando",
    totalLessons: 30,
    duration: "60 hours",
    rating: 4.9,
    students: 245,
    lessons: [
      {
        id: "l005", title: "Introduction to Python", youtubeId: "rfscVS0vtbw",
        duration: "60 min", hasNotes: true, hasPdf: true,
        description: "Getting started with Python - syntax, variables, and basic operations."
      },
      {
        id: "l006", title: "Control Flow", youtubeId: "1GSjbWt0c9M",
        duration: "55 min", hasNotes: true, hasPdf: true,
        description: "If statements, loops, and logical operations."
      },
      {
        id: "l007", title: "Functions & Modules", youtubeId: "M4d3FXu9-U8",
        duration: "50 min", hasNotes: true, hasPdf: false,
        description: "Creating reusable code with functions and parameters."
      },
    ]
  },
  {
    id: "c003",
    title: "Web Design & Development",
    shortTitle: "Web Dev",
    description: "HTML, CSS, JavaScript and React fundamentals. Build real websites from scratch.",
    price: 5000,
    category: "Web",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=220&fit=crop",
    teacher: "Mr. Ashan Wickramasinghe",
    totalLessons: 36,
    duration: "72 hours",
    rating: 4.7,
    students: 189,
    lessons: [
      {
        id: "l008", title: "HTML Basics", youtubeId: "ExxFxD4OSZ0",
        duration: "45 min", hasNotes: true, hasPdf: true,
        description: "Structure of a web page using HTML tags and attributes."
      },
      {
        id: "l009", title: "CSS Styling", youtubeId: "rfscVS0vtbw",
        duration: "60 min", hasNotes: true, hasPdf: true,
        description: "Styling web pages - selectors, box model, flexbox and grid."
      },
    ]
  },
  {
    id: "c004",
    title: "Database Management",
    shortTitle: "Databases",
    description: "SQL, MySQL and Firebase Firestore. Database design, normalization and NoSQL concepts.",
    price: 3000,
    category: "Database",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=220&fit=crop",
    teacher: "Ms. Nimasha Rathnayake",
    totalLessons: 20,
    duration: "40 hours",
    rating: 4.6,
    students: 156,
    lessons: [
      {
        id: "l010", title: "Introduction to Databases", youtubeId: "M4d3FXu9-U8",
        duration: "40 min", hasNotes: true, hasPdf: true,
        description: "DBMS, types of databases and their use cases."
      },
      {
        id: "l011", title: "SQL Queries", youtubeId: "1GSjbWt0c9M",
        duration: "65 min", hasNotes: true, hasPdf: true,
        description: "SELECT, INSERT, UPDATE, DELETE and advanced SQL operations."
      },
    ]
  },
  {
    id: "c005",
    title: "Networking Essentials",
    shortTitle: "Networking",
    description: "TCP/IP, OSI model, LAN/WAN concepts, and network security basics.",
    price: 2500,
    category: "Networking",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=220&fit=crop",
    teacher: "Mr. Pradeep Jayasinghe",
    totalLessons: 18,
    duration: "36 hours",
    rating: 4.5,
    students: 98,
    lessons: [
      {
        id: "l012", title: "Network Fundamentals", youtubeId: "1GSjbWt0c9M",
        duration: "50 min", hasNotes: true, hasPdf: true,
        description: "Basic networking concepts, topologies, and internet basics."
      },
    ]
  },
  {
    id: "c006",
    title: "Free ICT Resources",
    shortTitle: "Free Zone",
    description: "Free introductory lessons, sample papers, and quick revision notes for all students.",
    price: 0,
    category: "Free",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=220&fit=crop",
    teacher: "NextGen ICT Team",
    totalLessons: 10,
    duration: "20 hours",
    rating: 4.9,
    students: 890,
    lessons: [
      {
        id: "l013", title: "Quick Revision - ICT Basics", youtubeId: "rfscVS0vtbw",
        duration: "30 min", hasNotes: true, hasPdf: true,
        description: "Fast revision of core ICT concepts for the exam."
      },
    ]
  }
];

export const mockSchedule = [
  { id: 1, date: "2026-02-17", title: "ICT Theory Live Class", time: "6:00 PM", type: "live", course: "ICT Grade 12" },
  { id: 2, date: "2026-02-19", title: "Programming Lab Session", time: "4:00 PM", type: "practical", course: "Programming" },
  { id: 3, date: "2026-02-21", title: "Mock Exam - Theory", time: "9:00 AM", type: "exam", course: "ICT Grade 12" },
  { id: 4, date: "2026-02-24", title: "Web Dev Q&A Session", time: "5:00 PM", type: "live", course: "Web Dev" },
  { id: 5, date: "2026-02-28", title: "A/L Final Exam", time: "8:30 AM", type: "exam", course: "All Courses" },
];

export const mockNotices = [
  { id: 1, title: "New Study Materials Added", message: "ICT Grade 12 Chapter 5 notes and PDFs uploaded.", date: "2026-02-15", type: "info" },
  { id: 2, title: "Live Class Rescheduled", message: "Monday's class moved to Tuesday 6PM due to holiday.", date: "2026-02-14", type: "warning" },
  { id: 3, title: "Exam Registration Open", message: "Register for Mock Exam before Feb 20. Limited slots.", date: "2026-02-13", type: "success" },
];