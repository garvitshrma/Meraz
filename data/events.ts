// Event categories and sub-events, carried over from meraz.iitbhilai.ac.in (Meraz 6.0).
// registerUrlIIT / registerUrlNonIIT are the live Google Form / Unstop links. Replace them with Meraz 7.0 forms when ready.
// Registration rules (same as the reference site):
//   SCI-TECH: two buttons, one for IIT Bhilai students, one for non-IIT Bhilai students.
//   INFORMALS & VARCHASVA (no links at all, the old forms were removed): "All registrations will be done on the spot".
//   CULTURALS: "Coming Soon" until the new Meraz 7.0 forms are added as registerUrlIIT.
//   Everything else with registerUrlIIT: a single Register button.

export type SubEvent = { title: string; desc: string; stall?: string; registerUrlIIT?: string; registerUrlNonIIT?: string };
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
        "title": "General Quiz",
        "desc": "A quiz covering a wide range of topics, from history and science to culture, sports and current affairs."
      },
      {
        "title": "NSFW Quiz",
        "desc": "A quiz on umm well, rather interesting things 👀👀"
      },
      {
        "title": "Photo of the Fest: Candid Edition",
        "desc": "Capture the spirit of Meraz through your lens! Photo of the Fest is an online photography competition where participants capture candid moments, genuine emotions, and the vibrant atmosphere of the fest. Showcase your creativity by turning ordinary moments into extraordinary photographs that tell a story. Submit your best shots and let your perspective stand out! In collaboration with DesignX Kathachitra."
      },
      {
        "title": "Youth Parliament",
        "desc": "Step into the shoes of national lawmakers in a dynamic simulation where participants debate pressing policies, draft legislation, and navigate complex parliamentary procedures. It is a premier platform for young leaders to test their diplomacy, hone their public speaking, and drive impactful change on a competitive stage."
      },
      {
        "title": "Abhivyakti",
        "desc": "Immerse yourself in the rhythm of spoken word at our Hindi Slam, a vibrant stage where poets breathe life into raw emotions and compelling stories. Join us for an electrifying event that celebrates the power, passion, and beauty of Hindi performance poetry."
      },
      {
        "title": "Murder Mystery",
        "desc": "A murder mystery is a themed event where there are fictional characters in a fictional story. The participants will then work together to solve a fictitious murder which occurs during the event. Most of the characters are gray. They are all suspects of the murder and have to be investigated by the participating teams to solve the mystery. Characters can’t lie but mislead the participants in different ways."
      },
      {
        "title": "Pukaar - Nukkad Natak",
        "desc": "Experience the raw energy of Nukkad Natak! This powerful street play brings social issues to life with passion, humor, and heart. With minimal props and dynamic performances, it’s an exciting, spontaneous way to engage the crowd and make a real impact."
      },
      {
        "title": "Dance Solitaire - Solo Dance",
        "desc": "An open solo dance battle/performance round, freestyle or choreographed, judged on technique, musicality, and stage presence. Held live on campus."
      },
      {
        "title": "IN10SITY",
        "desc": "A team-based choreographed dance battle open to multiple genres, judged on synchronisation, choreography, and overall performance."
      },
      {
        "title": "Fragments",
        "desc": "Every piece tells a story, but together, they create a masterpiece! In Fragments, team up with your crew, unleash your creativity, and turn individual puzzle pieces into one spectacular work of art. Can your fragments come together in harmony?"
      },
      {
        "title": "Switch",
        "desc": "Two artists, two canvases, and a switch every two minutes! Just when you find your rhythm, it's time to switch. Adapt to your partner's ideas, build on their strokes, and see how creative chaos transforms into art."
      },
      {
        "title": "Beyond Sight",
        "desc": "What happens when vision meets imagination? In Beyond Sight, one partner paints blindfolded while the other guides every stroke. Put your trust, communication, and creativity to the test, and turn the unseen into a masterpiece!"
      },
      {
        "title": "Nirmiti: Live Digital Art Challenge",
        "desc": "Every great character starts as something unexpected. Nirmiti is DesignX’s on-the-spot digital art challenge: you get a random, unconventional shape and must turn it into a full character design on our graphic tablets, in any style you choose, within 20 minutes."
      },
      {
        "title": "Chitrakatha: Photo-Story Manipulation Challenge",
        "desc": "Shoot 6 to 7 original photographs that narrate a story, then take them into Photoshop and amplify the mood by painting, grading, and drawing over your frames. Your camera is the pen, so bring a story worth showing."
      },
      {
        "title": "Shredded: Battle of Bands",
        "desc": "Turn up the volume, unleash the riffs, and let the battle begin! In Shredded – Battle of Bands, bring your band together, ignite the stage with electrifying solos, thunderous beats, and roaring vocals, and prove that your music has what it takes to steal the show. When the amps are cranked up and the stage is yours, will your band shred its way to victory?"
      },
      {
        "title": "Sur-Real",
        "desc": "Some voices are heard, but some are felt! In Sur-Real, take the stage, let your melodies speak, and transform every note into an unforgettable experience. Pour your heart into every lyric, captivate the audience with your sur, and let your voice create magic that transcends the ordinary. Are you ready to make the unreal sound sur-real?"
      },
      {
        "title": "Copy Cut: Movie Scene Recreation",
        "desc": "Participants are invited to select a movie sequence of their choice, ranging from dramatic dialogues to simple comedic exchanges, and recreate it. Elaborate sets and professional lighting are not required; instead, we encourage the innovative use of accessible locations, props, and standard camera equipment (including smartphones) to capture the core essence of the original sequence."
      },
      {
        "title": "Alter Ego",
        "desc": "AlterEgo is the perfect opportunity to step into the shoes of a character you've always dreamed of becoming. No strict rules, just express yourself and have fun! There are no boundaries to what you can become. You also win a chance to get exciting prizes in various games."
      },
      {
        "title": "Attire Spectra",
        "desc": "The platform for participants to showcase their style, confidence, and personality while walking the runway. Bring your best looks, own the stage, and leave the audience mesmerized with your attitude and presence!"
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
      // {
      //   "title": "VR Experience",
      //   "desc": ""
      // },
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
      // {
      //   "title": "Gandhi Hackathon",
      //   "desc": ""
      // },
      // {
      //   "title": "Agent Wars",
      //   "desc": ""
      // },
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
      // {
      //   "title": "Pit Stop Challenge",
      //   "desc": ""
      // },
      // {
      //   "title": "Buggy Showcase / Expo",
      //   "desc": ""
      // },
      // {
      //   "title": "DriveX",
      //   "desc": ""
      // },
      // {
      //   "title": "CADathon",
      //   "desc": ""
      // },
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
,
         "stall": "Outside Games"
       },
       {
         "title": "Housie",
         "desc": "Players mark called numbers on their tickets and win for completing a required pattern."
,
         "stall": "Stall 1"
       },
       {
         "title": "Lottery",
         "desc": "Players draw a ticket or number; matching numbers can win a small prize."
,
         "stall": "Stall 1"
       },
       {
         "title": "Musical Headphones",
         "desc": "Players wear headphones and try to identify a song or follow a musical challenge."
,
         "stall": "Stall 2"
       },
       {
         "title": "Memory Flip",
         "desc": "Players flip cards to find matching pairs using memory and concentration."
,
         "stall": "Stall 2"
       },
       {
         "title": "Poker Area",
         "desc": "A casual card-table setup for poker-style play using clear rules and non-cash tokens."
,
         "stall": "Stall 2"
       },
       {
         "title": "7 Up",
         "desc": "Players predict or choose an outcome in a simple dice-based luck game."
,
         "stall": "Stall 3"
       },
       {
         "title": "Roulette",
         "desc": "Players place tokens on a chosen number or colour and see where the wheel lands."
,
         "stall": "Stall 3"
       },
       {
         "title": "Mini Football",
         "desc": "Players try to score goals using a tabletop or mini football setup."
,
         "stall": "Stall 4"
       },
       {
         "title": "Cluster",
         "desc": "Players take turns placing magnetic stones without letting them attract or clump together."
,
         "stall": "Stall 4"
       },
       {
         "title": "Jenga",
         "desc": "Players remove one wooden block at a time and stack it on top without toppling the tower."
,
         "stall": "Stall 4"
       },
       {
         "title": "Balloon Blast",
         "desc": "Players throw darts or use a safe popping method to burst balloons and win a prize."
,
         "stall": "Stall 5"
       },
       {
         "title": "Ring Toss",
         "desc": "Players toss rings toward pegs or targets to win a prize."
,
         "stall": "Stall 5"
       },
       {
         "title": "Tekken",
         "desc": "Players compete in a short one-on-one fighting-game match using controllers."
,
         "stall": "Stall 6"
       },
       {
         "title": "Air Hockey",
         "desc": "Players use mallets to hit a puck into the opponent's goal on an air-hockey table."
,
         "stall": "Stall 6"
       },
       {
         "title": "Beyblade Fight",
         "desc": "Players launch spinning tops into an arena; the last top spinning or remaining in the arena wins."
,
         "stall": "Stall 7"
       },
       {
         "title": "Balls of Luck",
         "desc": "Players try to pick same coloured balls from the bucket."
,
         "stall": "Stall 7"
       },
       {
         "title": "Archery",
         "desc": "Players take turns aiming at a target for points using a supervised, safe setup."
,
         "stall": "Stall 8"
       },
       {
         "title": "Arm Wrestling",
         "desc": "Two players compete in a short arm-wrestling match on a stable table with supervision."
,
         "stall": "Stall 9"
       },
       {
         "title": "Spinning Wheel",
         "desc": "Players spin a wheel and receive the prize or challenge indicated by where it stops."
,
         "stall": "Stall 9"
       },
       {
         "title": "Twister",
         "desc": "Players place hands and feet on called-out coloured circles while trying not to fall."
,
         "stall": "Outside Games"
       },
       {
         "title": "Stack It",
         "desc": "Players stack boxes or objects as high as possible without the tower collapsing."
,
         "stall": "Outside Games"
       },
       {
         "title": "Balloon on Feet",
         "desc": "Players try to pop or protect balloons tied to their ankles."
,
         "stall": "Outside Games"
       },
       {
         "title": "Hit the Shuttle",
         "desc": "Players hit a shuttlecock toward a target or through a marked frame to score points."
,
         "stall": "Outside Games"
       },
       {
         "title": "Musical Chairs",
         "desc": "Players walk around chairs while music plays; when it stops, everyone tries to sit."
,
         "stall": "Outside Games"
       },
       {
         "title": "Mystery Bag",
         "desc": "Players buy mystery bags which contain random prizes."
,
         "stall": "Outside Games"
       },
       {
         "title": "Futsal Championship",
         "desc": "Compete in an action-packed Futsal tournament."
       },
       {
         "title": "Basketball League",
         "desc": "Shoot, dunk, and dominate the court!"
       },
       {
         "title": "Box Cricket",
         "desc": "Swing, smash, and own the box!."
       },
       {
         "title": "Volleyball",
         "desc": "Set, spike, and rule the court!"
       },
       {
         "title": "Valorant",
         "desc": "Team up and showcase your tactical prowess in intense 5v5 battles."
       },
       {
         "title": "BGMI",
         "desc": "Drop in, gear up, and survive the battlefield."
       },
       {
         "title": "Stumble Guys",
         "desc": "Dash, jump, and tumble your way through hilarious obstacle courses."
       },
       {
         "title": "Free Fire",
         "desc": "Dive into fast-paced survival battles where every move counts."
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
