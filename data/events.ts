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
        "title": "Robo Soccer",
        "desc": "Showcase your engineering skills as robots compete in an electrifying soccer game to score points and win.",
        "registerUrlIIT": "https://forms.gle/dSwXcMDq3ZXw4wF28",
        "registerUrlNonIIT": "https://forms.gle/12ndvTuvLcsvv2KV7"
      },
      {
        "title": "Line Following Bot",
        "desc": "Program your bot to follow a challenging route using algorithms and score points for precision.",
        "registerUrlIIT": "https://forms.gle/RYaGhGbYMEXZDRox9",
        "registerUrlNonIIT": "https://forms.gle/4ponefwJeRRYzGeL8"
      },
      {
        "title": "Mystery Box",
        "desc": "Get creative with a box of components and build circuit boards to solve surprise tasks on the spot.",
        "registerUrlIIT": "https://forms.gle/iJksX8ckLHmXxogr6",
        "registerUrlNonIIT": "https://forms.gle/25RHbBbj4Ux3RxCM7"
      },
      {
        "title": "FPGA Design Contest",
        "desc": "Design innovative circuits using Altium software, then build your prototype in a timed, hands-on round.",
        "registerUrlIIT": "https://forms.gle/kV6v4XYnvnap1CE26",
        "registerUrlNonIIT": "https://forms.gle/PqwcKcx81nhFX4ri7"
      },
      {
        "title": "VR Session",
        "desc": "Experience the future with immersive VR-themed activities and interactive demonstrations.",
        "registerUrlIIT": "https://forms.gle/h4s3s213xfRx6eDi7",
        "registerUrlNonIIT": "https://forms.gle/h4s3s213xfRx6eDi7"
      },
      {
        "title": "Treasure Hunt: Openquest",
        "desc": "Go on a digital quest to solve clues and uncover hidden treasures in a hybrid adventure.",
        "registerUrlIIT": "https://forms.gle/SF1Mzk9RGX69Z7Xu7",
        "registerUrlNonIIT": "https://forms.gle/sg6yfP9z15YGHCu98"
      },
      {
        "title": "The Forge: Code, Adapt, Conquer",
        "desc": "Collaborate to build real-world solutions in a fast-paced hackathon.",
        "registerUrlIIT": "https://forms.gle/G5qN1uA7R8jqkE1U7",
        "registerUrlNonIIT": "https://forms.gle/Sdxit37J9x7LDcxh6"
      },
      {
        "title": "Capture the Flag",
        "desc": "Test your cybersecurity skills in a beginner-friendly CTF filled with challenging puzzles, both online and offline.",
        "registerUrlIIT": "https://forms.gle/W4jCiucDPZqd7nxx9",
        "registerUrlNonIIT": "https://forms.gle/PnFd4sGtBjzp1vxLA"
      },
      {
        "title": "Hackathon(Vibe Coding)",
        "desc": "Apply your AI and ML skills to tackle real problems in a dynamic student hackathon environment.",
        "registerUrlIIT": "https://forms.gle/duA9JuTyGeRGqBmX6",
        "registerUrlNonIIT": "https://forms.gle/ofntKUjJk7FHNghR7"
      },
      {
        "title": "Save Satoshi",
        "desc": "Join a mystery-themed treasure hunt powered by blockchain, where cracking codes leads to digital rewards.",
        "registerUrlIIT": "https://forms.gle/KDpa4ckyUssoyVRq7",
        "registerUrlNonIIT": "https://forms.gle/bBaNgyCpQzsACKY97"
      },
      {
        "title": "DriveX",
        "desc": "Push your limits in motorsports challenges that test your reflexes and racing instincts.",
        "registerUrlIIT": "https://forms.gle/gBYNJ2K9KPytWvWw5",
        "registerUrlNonIIT": "https://forms.gle/gBYNJ2K9KPytWvWw5"
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
        "desc": "Step into the studio and play the role of a radio host, spin tracks, give shoutouts, and keep the energy high."
      },
      {
        "title": "Housie",
        "desc": "Mark your numbers as luck unfolds in this classic game of Tambola; line up patterns to win exciting prizes."
      },
      {
        "title": "Musical Headphones",
        "desc": "Guess the phrase your teammate says while wearing headphones in this fun test of listening and communication."
      },
      {
        "title": "7 Up",
        "desc": "A fast-paced dice betting game where players predict whether the sum of two dice will be below, on, or above seven."
      },
      {
        "title": "Roulette",
        "desc": "Try your luck on the spinning wheel, bet on numbers or colors and see if fortune favors your picks."
      },
      {
        "title": "Lottery",
        "desc": "Draw random tickets or numbers and hope to win prizes by the luck of the draw."
      },
      {
        "title": "Twister",
        "desc": "Follow the spinner’s calls and put hands and feet on colored circles, last flexible player standing wins."
      },
      {
        "title": "Beyblade Fight",
        "desc": "Launch your Beyblades into the arena; only the last spinning top takes the victory."
      },
      {
        "title": "Stack It",
        "desc": "Stack objects as high as possible without tipping them over, then race with lemons for a double challenge."
      },
      {
        "title": "Archery",
        "desc": "Aim and release arrows at a target, highest accuracy claims the top scores."
      },
      {
        "title": "Balloon on Feet",
        "desc": "Tie balloons to your feet and try to pop others’ while defending your own in this playful romp."
      },
      {
        "title": "Balls Luck",
        "desc": "Pick or toss colored or numbered balls; hope your pick brings a lucky win."
      },
      {
        "title": "7 Bounce",
        "desc": "Pass or catch the ball after seven bounces, requires perfect timing and quick coordination."
      },
      {
        "title": "Sling Shot",
        "desc": "Compete by shooting objects with a slingshot, hit your targets with precision and control."
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
        "registerUrlIIT": "https://forms.gle/6e98oqofD1qVSMXu7"
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
        "registerUrlIIT": "https://tradexiitbhilai.netlify.app/"
      },
      {
        "title": "Nivesh Paheli",
        "desc": "An interactive treasure hunt with a financial twist, aimed at making finance learning exciting and accessible. Participants solve a sequence of finance-based clues and puzzles to reach the final treasure.",
        "registerUrlIIT": "https://docs.google.com/forms/d/e/1FAIpQLSfBRl7zjqPVubOiSZA5W0f5wat9nePIoLRf4tdSrCiC_Sd9XA/viewform?usp=dialog"
      }
    ]
  }
];
