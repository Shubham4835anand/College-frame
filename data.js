/**
 * ============================================================================
 *  SPEAKER SHOWCASE — SINGLE-FILE CONTENT CONFIGURATION
 * ============================================================================
 *  Edit this file to personalize your entire website.
 *  You don't need to touch HTML, CSS, or JavaScript unless you want to!
 *
 *  Tip: Replace `assets/speaker-portrait.jpg` and `assets/campus-story.jpg`
 *  with your own photos, or update the image paths below.
 * ============================================================================
 */

window.SPEAKER_DATA = {
  meta: {
    siteTitle: "Full Circle — Alumni Speaker Showcase",
    issueLabel: "ALUMNI HOMECOMING · SPECIAL EDITION",
    issueNumber: "VOL. 01",
    dateStamp: "NOVEMBER 2026",
  },

  event: {
    collegeName: "National Institute of Technology & Engineering",
    collegeShort: "My Alma Mater",
    eventName: "Annual Alumni Fireside & Tech Talk",
    talkTitle: "From Back-Bench Curiosity to Building at Scale",
    talkSubtitle:
      "An honest, unfiltered timeline of wrong turns, late-night experiments, first breaks, and what I wish someone had told me when I sat in your seats.",
    date: "November 2026",
    venue: "Main Campus Auditorium",
    alumniBadge: "Class of 2020 · Guest Speaker",
  },

  speaker: {
    name: "Aarav Sharma",
    firstName: "Aarav",
    role: "Senior Product Engineer",
    company: "Stripe / CloudScale Labs",
    location: "Bengaluru, India",
    photo: "assets/speaker-portrait.jpg",
    photoCaption: "Back on campus — five years after handing in my final semester project.",
    featureImage: "assets/campus-story.jpg",
    featureImageCaption: "Where most real ideas started: one notebook, lukewarm filter coffee, and too many browser tabs.",
    shortIntro:
      "A few days ago, an email landed in my inbox inviting me back to the very campus where I wrote my first messy lines of code, survived viva exams, and wondered whether I was falling behind. I built this page so you can follow along with my story — and reach out anytime after the talk.",
    letterLead:
      "Five years ago, I was sitting right where you are today — quietly wondering if everyone else had a secret roadmap that I somehow missed.",
    letterBody: [
      "The truth is, nobody hands you a clean map. Most careers only look linear in hindsight on LinkedIn. Up close, they look like late-night debugging sessions in the hostel corridor, projects that nobody used, cold emails that got ignored, and one or two brave decisions that compounded over time.",
      "Below is the real timeline of my journey from these hallways to where I work today — complete with the doubts, turning points, and practical notes I wish I could hand back to my second-year self."
    ],
    quickFacts: [
      { label: "Graduated", value: "Batch of '20" },
      { label: "Current Role", value: "Sr. Engineer" },
      { label: "Years Out", value: "6+ Years" },
      { label: "Favorite Spot", value: "Library 2nd Floor" },
    ],
  },

  /**
   * MY JOURNEY TIMELINE
   * Add, remove, or reorder chapters freely.
   * Supported `era` categories automatically populate the filter pills!
   */
  timeline: [
    {
      id: "chapter-01",
      chapterNumber: "01",
      era: "College Days",
      period: "2016 — 2017",
      title: "The Clueless First Year & Finding My Tribe",
      roleOrMilestone: "B.Tech Freshman · First Hackathon",
      location: "Campus Hostel & Computer Lab 3",
      summary:
        "Walked into college thinking I had to memorize textbooks to succeed. Failed my first coding lab test, panicked for a week, and then accidentally joined a weekend campus hackathon just for the free samosas.",
      story:
        "Our team didn't win — in fact, our demo crashed live in front of the judges. Yet staying up 36 hours trying to glue an API to a broken frontend taught me more than an entire semester of slides. More importantly, I met two friends who pushed me to build things outside the syllabus.",
      turningPoint:
        "Realizing that curiosity and shipping small, imperfect projects beat waiting until you 'feel ready.'",
      lessonForStudents:
        "Don't wait for the curriculum to give you permission. Pick one weird problem around campus this semester and build a rough version of it with two friends.",
      marginNote:
        "True story: our first hackathon app was a canteen crowd tracker that crashed because we hard-coded the Wi-Fi IP.",
      tags: ["First Year", "Hackathons", "Learning to Learn"],
    },
    {
      id: "chapter-02",
      chapterNumber: "02",
      era: "College Days",
      period: "2018 — 2019",
      title: "Building in Public & Surviving 40+ Rejections",
      roleOrMilestone: "Open Source Contributor · Internship Hunt",
      location: "College Library & Late-Night Cafés",
      summary:
        "Third year arrived and internship season hit hard. I applied to 47 companies, got ghosted by 39, rejected by 7, and landed one tiny remote internship at a 6-person startup.",
      story:
        "Instead of tweaking my resume font for the tenth time, I started writing short weekly notes about the bugs I solved and publishing small web tools on GitHub. A founder stumbled across one of those tiny repos and reached out directly — no formal coding round, just a 30-minute conversation about what I had built.",
      turningPoint:
        "Proof of work spoke louder than my CGPA ever did. One visible project opened doors that 40 blind applications couldn't.",
      lessonForStudents:
        "Treat your GitHub, portfolio, or blog like an open workshop, not a polished museum. Document what you're learning while you're still learning it.",
      marginNote:
        "My CGPA wasn't top-10 in the department. Showing real code I cared about changed the entire conversation.",
      tags: ["Internships", "Proof of Work", "Resilience"],
    },
    {
      id: "chapter-03",
      chapterNumber: "03",
      era: "First Break",
      period: "2020 — 2021",
      title: "Graduating Into Uncertainty & First Full-Time Role",
      roleOrMilestone: "Software Engineer I · Early-Stage Startup",
      location: "Remote -> Bengaluru",
      summary:
        "Graduated during a turbulent hiring year when offers were getting delayed. Took a bet on a fast-moving product team where I owned real features from week two.",
      story:
        "The biggest shock of my first job wasn't the algorithms — it was communication. Reading other people's code, asking clear questions without pretending to know everything, and writing crisp design docs turned out to be superpowers. I also broke production once on a Friday evening and learned how great teams do blameless postmortems.",
      turningPoint:
        "Shifting from 'How do I look smart?' to 'How do I help the team and our users succeed?'",
      lessonForStudents:
        "Your first job is a paid apprenticeship. Optimize for steep learning curves, honest mentors, and real ownership over just a flashy brand name.",
      marginNote:
        "Yes, I took down checkout for 11 minutes in month three. Still one of the best engineering lessons of my life.",
      tags: ["First Job", "Ownership", "Communication"],
    },
    {
      id: "chapter-04",
      chapterNumber: "04",
      era: "Growth & Pivot",
      period: "2022 — 2024",
      title: "Going Deep, Scaling Systems & Leading Projects",
      roleOrMilestone: "Senior Engineer · Core Platform Team",
      location: "Bengaluru, India",
      summary:
        "Transitioned from building standalone features to designing systems used by hundreds of thousands of people — and mentoring fresh graduates joining the team.",
      story:
        "Around year three, I realized that writing code was only half the job. Understanding why a product exists, talking directly to customers, simplifying complex architectures, and lifting up junior teammates multiplied my impact far more than working longer hours ever could.",
      turningPoint:
        "Discovering that teaching and mentoring others forces you to truly understand your own craft.",
      lessonForStudents:
        "Depth beats hype. Frameworks change every two years, but strong fundamentals, clear writing, and genuine empathy for users never go out of style.",
      marginNote:
        "Every senior engineer I admire still Googles basic syntax — they're just calmer when things break.",
      tags: ["Systems Thinking", "Leadership", "Mentorship"],
    },
    {
      id: "chapter-05",
      chapterNumber: "05",
      era: "Full Circle",
      period: "2026 — Present",
      title: "Returning Home to the Auditorium Stage",
      roleOrMilestone: "Alumnus Guest Speaker · Mentor",
      location: "Back at My College",
      summary:
        "Getting the invite to come back and speak to you all is honestly one of the most meaningful milestones of my career — far more than any title or promotion.",
      story:
        "Walking back through the main gate reminded me how much potential sits in every single classroom here. You don't need to have your next ten years figured out today. You just need enough curiosity to take the next honest step, build things that excite you, and stay kind to the people walking beside you.",
      turningPoint:
        "Coming full circle — turning everything I struggled through into a lantern for the batches coming after me.",
      lessonForStudents:
        "Reach out! Alumni love hearing from thoughtful, curious students. Ask specific questions, share what you're building, and never hesitate to start a conversation.",
      marginNote:
        "If you're reading this from the auditorium right now — wave during Q&A or say hi right after the talk!",
      tags: ["Homecoming", "Community", "Giving Back"],
    },
  ],

  /**
   * SHORT EDITORIAL PULL-CARDS: "NOTES TO MY COLLEGE SELF"
   */
  notesToStudents: {
    eyebrow: "POSTSCRIPT · MARGINALIA",
    heading: "Three things I'd tell my college self over chai",
    items: [
      {
        number: "I",
        title: "Build small, finish often",
        body: "Ten tiny finished projects teach you far more than one ambitious 'perfect' idea sitting half-built in a private folder.",
      },
      {
        number: "II",
        title: "Your peers are your future network",
        body: "The friend helping you debug at 2 AM today might be your co-founder, referral, or favorite teammate five years from now.",
      },
      {
        number: "III",
        title: "Ask better, bolder questions",
        body: "Send that thoughtful message. Raise your hand in the talk. Most exciting opportunities start as one slightly nervous conversation.",
      },
    ],
  },

  /**
   * CONNECT & SHARE HUB
   * Tip: Set `shareUrl` to your deployed website URL (e.g. "https://yourname.netlify.app")
   * so the Stage QR Code always points straight to your live page!
   * Leave `shareUrl` empty ("") to automatically use the current page URL.
   */
  connect: {
    eyebrow: "STAY IN TOUCH",
    heading: "Let's keep the conversation going after the talk.",
    subtext:
      "Working on a cool college project, preparing for internships, or just want honest feedback on your resume or portfolio? Drop a message — mention that you were at today's session!",
    email: "aarav.sharma@example.com",
    shareUrl: "", // e.g. "https://aarav-homecoming.netlify.app"
    customQrImage: "", // Optional: path to your own QR PNG if you prefer an offline static image
    links: [
      {
        label: "LinkedIn",
        handle: "in/aarav-sharma",
        url: "https://linkedin.com",
        note: "Best for career & internship DMs",
      },
      {
        label: "GitHub",
        handle: "@aaravbuilds",
        url: "https://github.com",
        note: "Projects, starter templates & notes",
      },
      {
        label: "X / Twitter",
        handle: "@aarav_writes",
        url: "https://x.com",
        note: "Occasional threads on engineering",
      },
      {
        label: "Email",
        handle: "aarav.sharma@example.com",
        url: "mailto:aarav.sharma@example.com",
        note: "Always happy to review a project",
      },
    ],
  },
};
