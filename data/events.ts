// Event categories and sub-events, carried over from meraz.iitbhilai.ac.in (Meraz 6.0).
// registerUrlIIT / registerUrlNonIIT are the live Google Form / Unstop links. Replace them with Meraz 7.0 forms when ready.
// Registration rules (same as the reference site):
//   SCI-TECH: two buttons, one for IIT Bhilai students, one for non-IIT Bhilai students.
//   INFORMALS & VARCHASVA without a link: "All registrations will be done on the spot".
//   Everything else with registerUrlIIT: a single Register button.

export type SubEvent = { title: string; desc: string; registerUrlIIT?: string; registerUrlNonIIT?: string };
export type EventCategory = { id: number; title: string; hindi: string; heading: string; description: string; subEvents: SubEvent[] };

export const eventCategories: EventCategory[] = [
  {
    "id": 1,
    "title": "CULTURALS",
    "hindi": "सांस्कृतिक",
    "heading": "CULTURAL EVENTS",
    "description": "Celebrate creativity, rhythm, and expression where every act is a spark and every display a masterpiece born of passion and artistry.",
    "subEvents": [
      {
        "title": "Virtual Groove",
        "desc": "Break boundaries and express your rhythm in this virtual dance competition connecting dancers nationwide.",
        "registerUrlIIT": "https://forms.gle/6ZNb8u1MwXSg2iXm8"
      },
      {
        "title": "Murder Mystery",
        "desc": "Unravel secrets, interrogate suspects, and solve a thrilling crime before time runs out.",
        "registerUrlIIT": "https://docs.google.com/forms/d/e/1FAIpQLSeEwQY9U-Lnnb6FCvSzlyBbrUMyAPoKGmgrOUlEx5X_gdnuWQ/viewform?usp=sharing&ouid=109455903570369304753"
      },
      {
        "title": "Shot Ur Story",
        "desc": "Capture the spirit of Meraz through impactful short films that tell powerful stories in minutes.",
        "registerUrlIIT": "https://forms.gle/2j17UirPGxSHdfE36"
      },
      {
        "title": "Candid Capture",
        "desc": "Record spontaneous campus emotions and moments that define the true essence of Meraz.",
        "registerUrlIIT": "https://forms.gle/TgWaQAbnij7JExbHA"
      },
      {
        "title": "IITBh Model United Nations",
        "desc": "Debate, negotiate, and lead global change by tackling real-world issues through diplomacy.",
        "registerUrlIIT": "https://docs.google.com/forms/d/e/1FAIpQLSdA_w5c38QDb9-3Gghz8wphvJsltcG-4VNJvGUicBlMH23GFg/viewform?usp=dialog"
      },
      {
        "title": "Meme-O-Rama",
        "desc": "Meme your way to glory! Create witty and relatable memes that win hearts and screens alike.",
        "registerUrlIIT": "https://forms.gle/72xymDruvBRuUmBQA"
      },
      {
        "title": "Abhivyakti",
        "desc": "Express emotions and creativity through original Hindi poetry that speaks from the soul.",
        "registerUrlIIT": "https://forms.gle/SBxWksCsxdRq58br9"
      },
      {
        "title": "General Quiz",
        "desc": "Test your all-round knowledge in a high-energy quiz covering science, pop culture, and more.",
        "registerUrlIIT": "https://docs.google.com/forms/d/1t4wh_dK-q3IF3dH8ioGDmESERuW9d8Z8N12HDi-_fog/edit"
      },
      {
        "title": "NSFW Quiz",
        "desc": "Get ready for a wild, laughter-filled ride with the NSFW Quiz at MERAZ!.",
        "registerUrlIIT": "https://docs.google.com/forms/d/12wTYnjRGibAN7Y-xYormlAwPGm1qt5ayopYPzS7NGDQ/edit"
      },
      {
        "title": "Beyond Sight",
        "desc": "Create art through trust and teamwork where one paints blindfolded guided by another.",
        "registerUrlIIT": "https://forms.gle/vmrUSseFuytWReZk6"
      },
      {
        "title": "Luminous Ink: Ignite the Night",
        "desc": "Design glowing tattoos with radiant creativity and light up the night.",
        "registerUrlIIT": "https://forms.gle/H4UefzYcZR8z8VdB7"
      },
      {
        "title": "Shredded: The Battle of Bands",
        "desc": "Unleash your musical energy and rock the stage in an electrifying band showdown.",
        "registerUrlIIT": "https://forms.gle/JgaNS3zDpBFzLE219"
      },
      {
        "title": "Euphony",
        "desc": "Let your vocals shine online and turn your screen into a stage for stardom.",
        "registerUrlIIT": "https://forms.gle/fcNCeHmRyVHH8nkL8"
      },
      {
        "title": "Online Theme Photography",
        "desc": "Explore the art of illusion and contrast in this creative online photography challenge.",
        "registerUrlIIT": "https://forms.gle/E1c48kKEzrrTdDJq6"
      },
      {
        "title": "Design Forward",
        "desc": "Collaborate, innovate, and prototype impactful solutions in this one-day design sprint.",
        "registerUrlIIT": "https://unstop.com/p/design-forward-2025-moggly-design-studio-1579178?utm_campaign=site-emails&utm_medium=d2c-automated&utm_source=opportunity-approved"
      },
      {
        "title": "Meraz Got Talent - सुर-Real",
        "desc": "Showcase your passion and creativity through music, dance, and art on the grand Meraz stage.",
        "registerUrlIIT": "https://forms.gle/NMJmHawXFQhHHyBH7"
      },
      {
        "title": "Meraz Got Talent - Dance Arts",
        "desc": "Showcase your passion and creativity through music, dance, and art on the grand Meraz stage.",
        "registerUrlIIT": "https://forms.gle/y75sAr3sXHxE6fxW9"
      }
    ]
  },
  {
    "id": 2,
    "title": "SCI-TECH",
    "hindi": "विज्ञान-तकनीक",
    "heading": "SCIENCE & TECHNOLOGY",
    "description": "Step into a crucible of innovation, where science and technology are unveiled in dazzling brilliance through our trailblazing events.",
    "subEvents": [
      {
        "title": "Messier Marathon",
        "desc": "Analyze real NASA data to track Messier objects and break a chain of locked puzzles."
      },
      {
        "title": "VR Experience",
        "desc": ""
      },
      {
        "title": "RC Plane Comp",
        "desc": "Design, build, and fly an RC aircraft from scratch—put your engineering, flight performance, and precision to the test."
      },
      {
        "title": "Battleship",
        "desc": "Think you played Battleship? Experience the classic game reinvented as 4 teams clash live with custom consoles, shields, sonar scans, and hidden mines to be the last fleet standing."
      },
      {
        "title": "Circuit Syndicate",
        "desc": "Step into the arena with your syndicate—scavenge, build, and program your way to victory!"
      },
      {
        "title": "The Lattice",
        "desc": "One campus. Contradicting trails. Trust no isolated story—trade intel, connect the missing pieces, and uncover the organization's hidden truth."
      },
      {
        "title": "Nightjar",
        "desc": "When NEXUS falls and the festival goes dark, you are the last line of defense. Trace the worm, expose the false insider, and isolate Patient Zero before the show begins."
      },
      {
        "title": "Gandhi Hackathon",
        "desc": ""
      },
      {
        "title": "Agent Wars",
        "desc": ""
      },
      {
        "title": "Runtime Roulette",
        "desc": "A 5-round coding contest featuring Easy, Medium, and Hard problems in each round. Participants wager virtual coins, earn multipliers for solving problems, and compete to maximize their balance and top the leaderboard."
      },
      {
        "title": "Jailbreaking LLM",
        "desc": "A 3-round LLM Jailbreaking event in which participants challenge AI safety guardrails through progressively harder tasks, from guessing hidden numbers to extracting secret keys and fictional private information."
      },
      {
        "title": "Evo AI: Evolve, Adapt, Conquer",
        "desc": "One agent. Five rounds. Infinite possibilities. Push the limits, evolve your AI, and outsmart the leaderboard!!"
      },
      {
        "title": "Pit Stop Challenge",
        "desc": ""
      },
      {
        "title": "Buggy Showcase / Expo",
        "desc": ""
      },
      {
        "title": "DriveX",
        "desc": ""
      },
      {
        "title": "CADathon",
        "desc": ""
      },
      {
        "title": "Line Follower",
        "desc": "Watch high-speed robots race against the clock! Custom-built bots take on sharp turns and tough tracks completely on their own."
      },
      {
        "title": "Robo Soccer",
        "desc": "Showcase your engineering skills as robots compete in an electrifying soccer game to score points and win!"
      },
      {
        "title": "VibeChain",
        "desc": "Build a full-stack blockchain dApp with AI, write smart contracts, and hunt for vulnerabilities in this fast-paced 3-hour hackathon."
      }
    ]
  },
  {
    "id": 3,
    "title": "INFORMALS & VARCHASVA",
    "hindi": "मौज-मस्ती",
    "heading": "INFORMALS & VARCHASVA",
    "description": "Where fun meets competition ,  enjoy casual games and sports events that bring everyone together in the spirit of Meraz.",
     "subEvents": [
       {
         "title": "Radio Meraz",
         "desc": "A fun radio-style stall with hosts, music, shout-outs, mini-games, and audience interaction."
       },
       {
         "title": "Housie",
         "desc": "Players mark called numbers on their tickets and win for completing a required pattern."
       },
       {
         "title": "Lottery",
         "desc": "Players draw a ticket or number; matching numbers can win a small prize."
       },
       {
         "title": "Musical Headphones",
         "desc": "Players wear headphones and try to identify a song or follow a musical challenge."
       },
       {
         "title": "Memory Flip",
         "desc": "Players flip cards to find matching pairs using memory and concentration."
       },
       {
         "title": "Poker Area",
         "desc": "A casual card-table setup for poker-style play using clear rules and non-cash tokens."
       },
       {
         "title": "7 Up",
         "desc": "Players predict or choose an outcome in a simple dice-based luck game."
       },
       {
         "title": "Roulette",
         "desc": "Players place tokens on a chosen number or colour and see where the wheel lands."
       },
       {
         "title": "Mini Football",
         "desc": "Players try to score goals using a tabletop or mini football setup."
       },
       {
         "title": "Cluster",
         "desc": "Players take turns placing magnetic stones without letting them attract or clump together."
       },
       {
         "title": "Jenga",
         "desc": "Players remove one wooden block at a time and stack it on top without toppling the tower."
       },
       {
         "title": "Balloon Blast",
         "desc": "Players throw darts or use a safe popping method to burst balloons and win a prize."
       },
       {
         "title": "Ring Toss",
         "desc": "Players toss rings toward pegs or targets to win a prize."
       },
       {
         "title": "Tekken",
         "desc": "Players compete in a short one-on-one fighting-game match using controllers."
       },
       {
         "title": "Air Hockey",
         "desc": "Players use mallets to hit a puck into the opponent's goal on an air-hockey table."
       },
       {
         "title": "Beyblade Fight",
         "desc": "Players launch spinning tops into an arena; the last top spinning or remaining in the arena wins."
       },
       {
         "title": "Balls of Luck",
         "desc": "Players try to pick same coloured balls from the bucket."
       },
       {
         "title": "Archery",
         "desc": "Players take turns aiming at a target for points using a supervised, safe setup."
       },
       {
         "title": "Arm Wrestling",
         "desc": "Two players compete in a short arm-wrestling match on a stable table with supervision."
       },
       {
         "title": "Spinning Wheel",
         "desc": "Players spin a wheel and receive the prize or challenge indicated by where it stops."
       },
       {
         "title": "Twister",
         "desc": "Players place hands and feet on called-out coloured circles while trying not to fall."
       },
       {
         "title": "Stack It",
         "desc": "Players stack boxes or objects as high as possible without the tower collapsing."
       },
       {
         "title": "Balloon on Feet",
         "desc": "Players try to pop or protect balloons tied to their ankles."
       },
       {
         "title": "Hit the Shuttle",
         "desc": "Players hit a shuttlecock toward a target or through a marked frame to score points."
       },
       {
         "title": "Musical Chairs",
         "desc": "Players walk around chairs while music plays; when it stops, everyone tries to sit."
       },
       {
         "title": "Mystery Bag",
         "desc": "Players buy mystery bags which contain random prizes."
       },
       {
         "title": "Futsal Championship",
         "desc": "Compete in an action-packed Futsal tournament.",
         "registerUrlIIT": "https://docs.google.com/forms/d/e/1FAIpQLSfM1IM39N3eJBvgmrDtWkrShGpbhQWrwcyUOc9iMOEX9oSXiQ/viewform?usp=publish-editor"
       },
       {
         "title": "Basketball League",
         "desc": "Shoot, dunk, and dominate the court!",
         "registerUrlIIT": "https://docs.google.com/forms/d/1fCXyTR8sC2CjeC6f0gtjFfhVcXmxe_7K9QGGwkTxldo/edit"
       },
       {
         "title": "Box Cricket",
         "desc": "Swing, smash, and own the box!.",
         "registerUrlIIT": "https://forms.gle/Gx5qfwHbzEWna2tV7"
       },
       {
         "title": "Volleyball",
         "desc": "Set, spike, and rule the court!",
         "registerUrlIIT": "https://docs.google.com/forms/d/e/1FAIpQLSdGNSfeSqI535j5WLIsrDJJuItmRkk5pfPzv0t_nTONYHrFNg/viewform?usp=header"
       },
       {
         "title": "Valorant",
         "desc": "Team up and showcase your tactical prowess in intense 5v5 battles.",
         "registerUrlIIT": "https://forms.gle/bPp9tvLfPH9mTRBj6"
       },
       {
         "title": "BGMI",
         "desc": "Drop in, gear up, and survive the battlefield.",
         "registerUrlIIT": "https://forms.gle/5FKrpNCQo298papj7"
       },
       {
         "title": "Stumble Guys",
         "desc": "Dash, jump, and tumble your way through hilarious obstacle courses.",
         "registerUrlIIT": "https://forms.gle/pXsTLWqFRBq7xN5x9"
       },
       {
         "title": "Free Fire",
         "desc": "Dive into fast-paced survival battles where every move counts.",
         "registerUrlIIT": "https://forms.gle/DLYkSmbu9SfoTjbR9"
       }
     ]
  },
  {
    "id": 4,
    "title": "E-CELL",
    "hindi": "उद्यम",
    "heading": "E-CONCLAVE",
    "description": "Where ideas meet industry, develop innovations, pitch solutions, and turn concepts into real-world impact.",
     "subEvents": [
       {
         "title": "Steel InTech Industrial Innovation Challenge",
         "desc": "Apply engineering insight to solve real industrial and materials-based problems from Steel InTech.",
       }
     ]
  },
  {
    "id": 5,
    "title": "FinTech",
    "hindi": "फिनटेक",
    "heading": "FinTech Events",
    "description": "Where innovation meets implementation, build solutions, pitch disruptions, and transform finance into impact.",
    "subEvents": [
       {
         "title": "TradeX",
         "desc": "Ready to test your instincts? TradeX brings you an all-India live trading simulation where you can buy and sell stocks in real-time as per live Indian market data! Build, manage, and grow your virtual ₹10L portfolio in the live market arena.",
       },
       {
         "title": "Nivesh Paheli",
         "desc": "An interactive treasure hunt with a financial twist, aimed at making finance learning exciting and accessible. Participants solve a sequence of finance-based clues and puzzles to reach the final treasure.",
       }
    ]
  }
];
