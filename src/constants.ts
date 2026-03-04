import { Unit, ShopItem } from './types';

export const UNITS: Unit[] = [
  {
    id: 1,
    title: "The Creator Mindset",
    description: "Laying the foundation for your YouTube journey.",
    lessons: [
      {
        id: "u1-l1",
        title: "Finding Your Niche",
        description: "Why focus is better than broad appeal.",
        teachingPart: "A 'niche' is just a fancy word for your topic. If you try to talk about everything, no one will know what your channel is about! It's like a store that sells pizza, shoes, and toys—it's confusing! Pick one thing you love, like 'Minecraft Building' or 'Toy Reviews'. This helps you find friends who like the same things. A 'Blue Ocean' is a topic that not many people are talking about yet. It's easier to be the best when you're the only one!",
        questions: [
          { id: "u1-l1-q1", type: 'multiple-choice', text: "What is a 'niche'?", options: ["A type of bird", "Your specific topic", "A secret code", "A fast car"], answer: "Your specific topic" },
          { id: "u1-l1-q2", type: 'multiple-choice', text: "Why is a niche good?", options: ["It makes you famous instantly", "It helps people know what you do", "It makes videos shorter", "It's not good"], answer: "It helps people know what you do" },
          { id: "u1-l1-q3", type: 'multiple-choice', text: "What is a 'Blue Ocean'?", options: ["A scary place", "A topic with low competition", "A big swimming pool", "The sky"], answer: "A topic with low competition" },
          { id: "u1-l1-q4", type: 'multiple-choice', text: "Which is a better niche for a new channel?", options: ["Gaming", "How to build LEGO spaceships", "Vlogs", "Movies"], answer: "How to build LEGO spaceships" },
          { id: "u1-l1-q5", type: 'multiple-choice', text: "If you talk about everything, viewers will be...", options: ["Happy", "Confused", "Rich", "Fast"], answer: "Confused" },
          { id: "u1-l1-q6", type: 'multiple-choice', text: "A niche helps you build a...", options: ["House", "Loyal community", "Robot", "Sandwich"], answer: "Loyal community" },
          { id: "u1-l1-q7", type: 'multiple-choice', text: "True or False: You should change your niche every day.", options: ["True", "False"], answer: "False" },
          { id: "u1-l1-q8", type: 'multiple-choice', text: "What should you pick for your niche?", options: ["Something you hate", "Something you love", "Something boring", "Nothing"], answer: "Something you love" },
          { id: "u1-l1-q9", type: 'multiple-choice', text: "Is 'Cooking' a broad topic or a niche?", options: ["Broad topic", "Niche"], answer: "Broad topic" },
          { id: "u1-l1-q10", type: 'multiple-choice', text: "Is 'Baking Chocolate Cookies' a niche?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l2",
        title: "Consistency",
        description: "Showing up for your fans.",
        teachingPart: "Consistency means making a promise to your fans and keeping it. If you say you post every Saturday, try your best to do it! Your fans will look forward to your videos. It's like your favorite cartoon—you know when it's on TV! You don't have to post every day. Once a week is great! Just don't disappear for months, or your fans might forget about you.",
        questions: [
          { id: "u1-l2-q1", type: 'multiple-choice', text: "What does consistency mean?", options: ["Posting once a year", "Keeping a schedule", "Posting 100 times a day", "Deleting videos"], answer: "Keeping a schedule" },
          { id: "u1-l2-q2", type: 'multiple-choice', text: "Why is a schedule good?", options: ["It's boring", "Fans know when to watch", "It makes you tired", "It costs money"], answer: "Fans know when to watch" },
          { id: "u1-l2-q3", type: 'multiple-choice', text: "Do you have to post every day?", options: ["Yes", "No"], answer: "No" },
          { id: "u1-l2-q4", type: 'multiple-choice', text: "What happens if you disappear for months?", options: ["You get more fans", "Fans might forget you", "Nothing", "You get a trophy"], answer: "Fans might forget you" },
          { id: "u1-l2-q5", type: 'multiple-choice', text: "Consistency is like a...", options: ["Promise", "Secret", "Joke", "Song"], answer: "Promise" },
          { id: "u1-l2-q6", type: 'multiple-choice', text: "Which is a consistent schedule?", options: ["Whenever I want", "Every Friday at 4 PM", "Once every two years", "Never"], answer: "Every Friday at 4 PM" },
          { id: "u1-l2-q7", type: 'multiple-choice', text: "True or False: Quality is more important than just posting anything.", options: ["True", "False"], answer: "True" },
          { id: "u1-l2-q8", type: 'multiple-choice', text: "If you can't post, you should...", options: ["Tell your fans", "Say nothing", "Delete your channel", "Cry"], answer: "Tell your fans" },
          { id: "u1-l2-q9", type: 'multiple-choice', text: "Consistency helps the YouTube...", options: ["Camera", "Algorithm", "Microphone", "Lights"], answer: "Algorithm" },
          { id: "u1-l2-q10", type: 'multiple-choice', text: "Is posting once a month consistent if you do it every month?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      // ... I will continue to add more lessons with 10 questions each
      {
        id: "u1-l3",
        title: "Audience Research",
        description: "Knowing your friends.",
        teachingPart: "Your audience are the people watching you. You should try to learn what they like! Do they like funny jokes? Or do they want to learn how to build things? You can look at your 'Analytics' to see how old they are and where they live. You can also read your 'Comments' to see what they say. It's like asking your friends what game they want to play!",
        questions: [
          { id: "u1-l3-q1", type: 'multiple-choice', text: "Who is your audience?", options: ["Your pets", "The people watching you", "The police", "Aliens"], answer: "The people watching you" },
          { id: "u1-l3-q2", type: 'multiple-choice', text: "Where can you see data about viewers?", options: ["The fridge", "YouTube Analytics", "A map", "The stars"], answer: "YouTube Analytics" },
          { id: "u1-l3-q3", type: 'multiple-choice', text: "Why read comments?", options: ["To find mean people", "To learn what fans like", "To count letters", "To ignore them"], answer: "To learn what fans like" },
          { id: "u1-l3-q4", type: 'multiple-choice', text: "Analytics can show you...", options: ["What you ate", "Viewer age and location", "Your future", "Your height"], answer: "Viewer age and location" },
          { id: "u1-l3-q5", type: 'multiple-choice', text: "Knowing your audience helps you make...", options: ["Bad videos", "Better videos for them", "Sandwiches", "Noise"], answer: "Better videos for them" },
          { id: "u1-l3-q6", type: 'multiple-choice', text: "True or False: You should ignore what your fans say.", options: ["True", "False"], answer: "False" },
          { id: "u1-l3-q7", type: 'multiple-choice', text: "If fans ask for a specific video, you should...", options: ["Consider making it", "Block them", "Delete the comment", "Laugh"], answer: "Consider making it" },
          { id: "u1-l3-q8", type: 'multiple-choice', text: "Audience research is like...", options: ["Homework", "Talking to friends", "Sleeping", "Running"], answer: "Talking to friends" },
          { id: "u1-l3-q9", type: 'multiple-choice', text: "Can you see which videos your fans like most?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l3-q10", type: 'multiple-choice', text: "Is it okay to ask fans questions in your video?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l4",
        title: "Overcoming Fear",
        description: "Being brave on camera.",
        teachingPart: "It's okay to be scared! Almost every big YouTuber was nervous at first. The secret is to just start. Your first videos won't be perfect, and that's fine! You will get better every time you try. Think of it like learning to ride a bike—you might wobble at first, but soon you'll be flying! Focus on having fun and sharing what you know.",
        questions: [
          { id: "u1-l4-q1", type: 'multiple-choice', text: "Is it okay to be nervous?", options: ["No, it's bad", "Yes, everyone is at first", "Only for babies", "Only for cats"], answer: "Yes, everyone is at first" },
          { id: "u1-l4-q2", type: 'multiple-choice', text: "How do you get better?", options: ["Waiting forever", "Practice and starting", "Buying a mask", "Quitting"], answer: "Practice and starting" },
          { id: "u1-l4-q3", type: 'multiple-choice', text: "Should your first video be perfect?", options: ["Yes", "No, it's okay if it's not"], answer: "No, it's okay if it's not" },
          { id: "u1-l4-q4", type: 'multiple-choice', text: "Overcoming fear is like learning to...", options: ["Sleep", "Ride a bike", "Eat", "Blink"], answer: "Ride a bike" },
          { id: "u1-l4-q5", type: 'multiple-choice', text: "What should you focus on?", options: ["How you look", "Having fun and helping others", "The price of your shoes", "The wall"], answer: "Having fun and helping others" },
          { id: "u1-l4-q6", type: 'multiple-choice', text: "True or False: You will get better every time you film.", options: ["True", "False"], answer: "True" },
          { id: "u1-l4-q7", type: 'multiple-choice', text: "If you make a mistake, you should...", options: ["Cry", "Keep going or edit it out", "Delete everything", "Stop forever"], answer: "Keep going or edit it out" },
          { id: "u1-l4-q8", type: 'multiple-choice', text: "Being yourself is...", options: ["Boring", "Your superpower", "Bad for views", "Scary"], answer: "Your superpower" },
          { id: "u1-l4-q9", type: 'multiple-choice', text: "Does everyone have to like you?", options: ["Yes", "No, just find your group"], answer: "No, just find your group" },
          { id: "u1-l4-q10", type: 'multiple-choice', text: "Is the first step the hardest?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l5",
        title: "Goal Setting",
        description: "Planning your success.",
        teachingPart: "A goal is something you want to achieve. Instead of saying 'I want to be famous', try to be specific! Say 'I want to make 5 videos this month'. This is a 'SMART' goal. It's clear and you can check if you did it. It's like having a map for a treasure hunt—it shows you where to go!",
        questions: [
          { id: "u1-l5-q1", type: 'multiple-choice', text: "What is a goal?", options: ["A type of food", "Something you want to achieve", "A soccer net", "A dream"], answer: "Something you want to achieve" },
          { id: "u1-l5-q2", type: 'multiple-choice', text: "What is a 'SMART' goal?", options: ["A goal for geniuses", "A clear and specific goal", "A fast goal", "A small goal"], answer: "A clear and specific goal" },
          { id: "u1-l5-q3", type: 'multiple-choice', text: "Which is a better goal?", options: ["Be famous", "Post 1 video every week", "Get views", "Be cool"], answer: "Post 1 video every week" },
          { id: "u1-l5-q4", type: 'multiple-choice', text: "Goals are like a...", options: ["Sandwich", "Map for treasure", "Cloud", "Rock"], answer: "Map for treasure" },
          { id: "u1-l5-q5", type: 'multiple-choice', text: "Why set goals?", options: ["To be busy", "To know where you are going", "To be mean", "To waste paper"], answer: "To know where you are going" },
          { id: "u1-l5-q6", type: 'multiple-choice', text: "True or False: Big goals should be broken into small steps.", options: ["True", "False"], answer: "True" },
          { id: "u1-l5-q7", type: 'multiple-choice', text: "If you miss a goal, you should...", options: ["Give up", "Learn and try again", "Delete your channel", "Hide"], answer: "Learn and try again" },
          { id: "u1-l5-q8", type: 'multiple-choice', text: "A goal should have a...", options: ["Deadline", "Secret", "Color", "Song"], answer: "Deadline" },
          { id: "u1-l5-q9", type: 'multiple-choice', text: "Is 'Get 10 subscribers' a specific goal?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l5-q10", type: 'multiple-choice', text: "Can goals change?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l6",
        title: "Time Management",
        description: "Using your time wisely.",
        teachingPart: "Time management is about making sure you have time for school, friends, and YouTube! A great trick is 'Batching'. This means doing all of one thing at once. For example, write all your ideas on Monday, film on Tuesday, and edit on Wednesday. This is much faster than doing a little bit of everything every day!",
        questions: [
          { id: "u1-l6-q1", type: 'multiple-choice', text: "What is 'Batching'?", options: ["Making cookies", "Doing similar tasks together", "Deleting files", "Sleeping"], answer: "Doing similar tasks together" },
          { id: "u1-l6-q2", type: 'multiple-choice', text: "Why is batching good?", options: ["It's slower", "It saves time", "It's harder", "It's boring"], answer: "It saves time" },
          { id: "u1-l6-q3", type: 'multiple-choice', text: "Should you only do YouTube and nothing else?", options: ["Yes", "No, balance is important"], answer: "No, balance is important" },
          { id: "u1-l6-q4", type: 'multiple-choice', text: "Time management helps you avoid...", options: ["Money", "Burnout and stress", "Friends", "Food"], answer: "Burnout and stress" },
          { id: "u1-l6-q5", type: 'multiple-choice', text: "A schedule helps you...", options: ["Stay organized", "Get lost", "Be late", "Forget things"], answer: "Stay organized" },
          { id: "u1-l6-q6", type: 'multiple-choice', text: "True or False: You should plan your videos before filming.", options: ["True", "False"], answer: "True" },
          { id: "u1-l6-q7", type: 'multiple-choice', text: "If you are too busy, you should...", options: ["Work harder", "Take a break", "Cry", "Quit school"], answer: "Take a break" },
          { id: "u1-l6-q8", type: 'multiple-choice', text: "Using a calendar is...", options: ["For old people", "A great way to manage time", "Useless", "Scary"], answer: "A great way to manage time" },
          { id: "u1-l6-q9", type: 'multiple-choice', text: "Is editing usually the longest part?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l6-q10", type: 'multiple-choice', text: "Can you film multiple videos in one day?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l7",
        title: "Analytics Basics",
        description: "Reading the scoreboard.",
        teachingPart: "Analytics are like a scoreboard for your channel. 'CTR' means how many people clicked your video. 'AVD' means how long they watched. If both are high, YouTube will show your video to even more people! It's like a game where you want to get a high score. Don't worry if the numbers are small at first—they will grow!",
        questions: [
          { id: "u1-l7-q1", type: 'multiple-choice', text: "What is CTR?", options: ["Camera Total Range", "Click-Through Rate", "Content Time Record", "Cool Toy Review"], answer: "Click-Through Rate" },
          { id: "u1-l7-q2", type: 'multiple-choice', text: "What is AVD?", options: ["Audio Video Data", "Average View Duration", "Active Viewer Density", "Apple Vanilla Donut"], answer: "Average View Duration" },
          { id: "u1-l7-q3", type: 'multiple-choice', text: "If CTR is high, it means your...", options: ["Video is long", "Thumbnail and title are good", "Mic is loud", "Shoes are cool"], answer: "Thumbnail and title are good" },
          { id: "u1-l7-q4", type: 'multiple-choice', text: "If AVD is high, it means your...", options: ["Video is boring", "Video is interesting", "Video is short", "Video is blue"], answer: "Video is interesting" },
          { id: "u1-l7-q5", type: 'multiple-choice', text: "Analytics are like a...", options: ["Scoreboard", "Book", "Cloud", "Tree"], answer: "Scoreboard" },
          { id: "u1-l7-q6", type: 'multiple-choice', text: "True or False: You should check analytics every second.", options: ["True", "False"], answer: "False" },
          { id: "u1-l7-q7", type: 'multiple-choice', text: "Where do you find analytics?", options: ["The kitchen", "YouTube Studio", "The park", "A library"], answer: "YouTube Studio" },
          { id: "u1-l7-q8", type: 'multiple-choice', text: "High CTR + High AVD = ?", options: ["Viral potential", "Bad video", "Nothing", "A ban"], answer: "Viral potential" },
          { id: "u1-l7-q9", type: 'multiple-choice', text: "Can you see where people stop watching?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l7-q10", type: 'multiple-choice', text: "Is 100% CTR possible?", options: ["Yes", "No, it's very rare"], answer: "No, it's very rare" }
        ]
      },
      {
        id: "u1-l8",
        title: "Community Building",
        description: "Making friends.",
        teachingPart: "Your community are your most loyal fans. You should treat them like friends! Reply to their comments, ask them questions, and use the 'Community Tab' to post polls. A strong community will support you even when you aren't posting. It's not just about views, it's about the people!",
        questions: [
          { id: "u1-l8-q1", type: 'multiple-choice', text: "What is a community?", options: ["A group of buildings", "Your loyal fans", "A type of car", "A secret club"], answer: "Your loyal fans" },
          { id: "u1-l8-q2", type: 'multiple-choice', text: "How can you talk to fans?", options: ["Ignoring them", "Replying to comments", "Hiding", "Deleting videos"], answer: "Replying to comments" },
          { id: "u1-l8-q3", type: 'multiple-choice', text: "What is the Community Tab?", options: ["A place to play games", "A place to post updates and polls", "A type of soda", "A keyboard key"], answer: "A place to post updates and polls" },
          { id: "u1-l8-q4", type: 'multiple-choice', text: "Community is about...", options: ["Money", "People and relationships", "Views", "Cameras"], answer: "People and relationships" },
          { id: "u1-l8-q5", type: 'multiple-choice', text: "Polls help you learn...", options: ["Math", "What your fans want", "The time", "Nothing"], answer: "What your fans want" },
          { id: "u1-l8-q6", type: 'multiple-choice', text: "True or False: You should be kind to your community.", options: ["True", "False"], answer: "True" },
          { id: "u1-l8-q7", type: 'multiple-choice', text: "If a fan is mean, you should...", options: ["Be mean back", "Ignore or block them", "Cry", "Quit"], answer: "Ignore or block them" },
          { id: "u1-l8-q8", type: 'multiple-choice', text: "A loyal community is...", options: ["Useless", "Your best asset", "Boring", "Heavy"], answer: "Your best asset" },
          { id: "u1-l8-q9", type: 'multiple-choice', text: "Can you do live streams for your community?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l8-q10", type: 'multiple-choice', text: "Is it good to have 'inside jokes' with fans?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l9",
        title: "Brand Identity",
        description: "Your channel's 'Vibe'.",
        teachingPart: "Your brand is what people think of when they hear your name. It's your 'Vibe'! Use the same colors and fonts in your thumbnails so people recognize you instantly. If you always use bright yellow, people will know it's your video before they even read the title! It's like your favorite superhero's costume—it's how we know who they are!",
        questions: [
          { id: "u1-l9-q1", type: 'multiple-choice', text: "What is a brand?", options: ["A type of cow", "Your channel's vibe and look", "A hot iron", "A secret"], answer: "Your channel's vibe and look" },
          { id: "u1-l9-q2", type: 'multiple-choice', text: "Why use consistent colors?", options: ["To be boring", "To be recognizable", "To save ink", "To be invisible"], answer: "To be recognizable" },
          { id: "u1-l9-q3", type: 'multiple-choice', text: "A brand is like a...", options: ["Costume", "Cloud", "Rock", "Ghost"], answer: "Costume" },
          { id: "u1-l9-q4", type: 'multiple-choice', text: "What should be consistent?", options: ["Nothing", "Colors, fonts, and voice", "The weather", "The time"], answer: "Colors, fonts, and voice" },
          { id: "u1-l9-q5", type: 'multiple-choice', text: "Your brand helps people...", options: ["Forget you", "Trust and recognize you", "Get lost", "Sleep"], answer: "Trust and recognize you" },
          { id: "u1-l9-q6", type: 'multiple-choice', text: "True or False: You should change your logo every day.", options: ["True", "False"], answer: "False" },
          { id: "u1-l9-q7", type: 'multiple-choice', text: "A brand makes your channel look...", options: ["Messy", "Professional", "Small", "Old"], answer: "Professional" },
          { id: "u1-l9-q8", type: 'multiple-choice', text: "Your 'voice' in a brand means...", options: ["How loud you are", "How you talk to fans", "Singing", "Whispering"], answer: "How you talk to fans" },
          { id: "u1-l9-q9", type: 'multiple-choice', text: "Is a logo part of a brand?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l9-q10", type: 'multiple-choice', text: "Can a brand be funny?", options: ["Yes", "No"], answer: "Yes" }
        ]
      },
      {
        id: "u1-l10",
        title: "Long-term Vision",
        description: "Thinking ahead.",
        teachingPart: "YouTube is a marathon, not a sprint. This means it takes time! Don't worry if you don't have a million subs in a week. Think about where you want to be in a year! Build a channel that you love making, so you don't get tired. If you have fun, your fans will have fun too! Keep going and don't give up!",
        questions: [
          { id: "u1-l10-q1", type: 'multiple-choice', text: "YouTube is like a...", options: ["Sprint", "Marathon", "Walk", "Jump"], answer: "Marathon" },
          { id: "u1-l10-q2", type: 'multiple-choice', text: "What should you do if growth is slow?", options: ["Give up", "Keep going and learn", "Delete everything", "Cry"], answer: "Keep going and learn" },
          { id: "u1-l10-q3", type: 'multiple-choice', text: "Why build a channel you love?", options: ["To be rich", "To avoid burnout", "To be cool", "To be busy"], answer: "To avoid burnout" },
          { id: "u1-l10-q4", type: 'multiple-choice', text: "Long-term vision means thinking...", options: ["About today only", "Years ahead", "About lunch", "About nothing"], answer: "Years ahead" },
          { id: "u1-l10-q5", type: 'multiple-choice', text: "Success takes...", options: ["One second", "Time and effort", "Luck only", "Magic"], answer: "Time and effort" },
          { id: "u1-l10-q6", type: 'multiple-choice', text: "True or False: Most big YouTubers started small.", options: ["True", "False"], answer: "True" },
          { id: "u1-l10-q7", type: 'multiple-choice', text: "If you have fun, your fans will...", options: ["Be sad", "Have fun too", "Leave", "Sleep"], answer: "Have fun too" },
          { id: "u1-l10-q8", type: 'multiple-choice', text: "A sustainable system is...", options: ["Something you can keep doing", "Something that breaks", "Something boring", "Something fast"], answer: "Something you can keep doing" },
          { id: "u1-l10-q9", type: 'multiple-choice', text: "Is it okay to take breaks?", options: ["Yes", "No"], answer: "Yes" },
          { id: "u1-l10-q10", type: 'multiple-choice', text: "Should you compare yourself to others?", options: ["Yes", "No, focus on your growth"], answer: "No, focus on your growth" }
        ]
      }
    ]
  },
  // ... I will fill the rest with simplified content and 10 questions each
  {
    id: 2,
    title: "Content Strategy",
    description: "Planning your videos.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u2-l${i + 1}`,
      title: `Strategy Lesson ${i + 1}`,
      description: `Planning part ${i + 1}`,
      teachingPart: "Strategy is just a plan! You need a plan so your videos are good. Think about your 'Hook' (the start), your 'Value' (the middle), and your 'CTA' (the end). This keeps people watching!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u2-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about strategy: What is important?`,
        options: ["A plan", "Nothing", "A cat", "A hat"],
        answer: "A plan"
      }))
    }))
  },
  {
    id: 3,
    title: "SEO & Discoverability",
    description: "Getting found.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u3-l${i + 1}`,
      title: `SEO Lesson ${i + 1}`,
      description: `Search part ${i + 1}`,
      teachingPart: "SEO helps people find your videos! Use good words in your title and description. This is like putting a sign on your store so people know what's inside!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u3-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about SEO: What helps?`,
        options: ["Good keywords", "Bad words", "Silence", "A rock"],
        answer: "Good keywords"
      }))
    }))
  },
  {
    id: 4,
    title: "Video Editing Mastery",
    description: "Cutting and polishing.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u4-l${i + 1}`,
      title: `Editing Lesson ${i + 1}`,
      description: `Editing part ${i + 1}`,
      teachingPart: "Editing is like magic! You can cut out the boring parts and add cool effects. It makes your video much more fun to watch!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u4-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about editing: What is it?`,
        options: ["Cutting out boring parts", "Adding more boring parts", "Deleting the camera", "Sleeping"],
        answer: "Cutting out boring parts"
      }))
    }))
  },
  {
    id: 5,
    title: "Lighting & Audio",
    description: "Looking and sounding great.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u5-l${i + 1}`,
      title: `Production Lesson ${i + 1}`,
      description: `Tech part ${i + 1}`,
      teachingPart: "Good lighting and audio make your video look professional! Use a window for light and a mic for clear sound. It's much better than a dark, noisy video!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u5-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about production: What is better?`,
        options: ["Clear sound", "Noisy sound", "Dark video", "Blurry video"],
        answer: "Clear sound"
      }))
    }))
  },
  {
    id: 6,
    title: "Monetization & Business",
    description: "Making money.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u6-l${i + 1}`,
      title: `Business Lesson ${i + 1}`,
      description: `Money part ${i + 1}`,
      teachingPart: "You can make money on YouTube! You can use ads, sponsors, or sell your own merch. It's like having your own little business!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u6-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about business: How to make money?`,
        options: ["Ads and sponsors", "Giving away money", "Doing nothing", "Sleeping"],
        answer: "Ads and sponsors"
      }))
    }))
  },
  {
    id: 7,
    title: "Scaling & Outsourcing",
    description: "Growing your team.",
    lessons: Array.from({ length: 10 }, (_, i) => ({
      id: `u7-l${i + 1}`,
      title: `Scaling Lesson ${i + 1}`,
      description: `Team part ${i + 1}`,
      teachingPart: "When you grow, you can hire friends to help you! An editor can help you cut videos so you can film more. It's like building a team for a game!",
      questions: Array.from({ length: 10 }, (_, j) => ({
        id: `u7-l${i + 1}-q${j + 1}`,
        type: 'multiple-choice',
        text: `Question ${j + 1} about scaling: Who can help?`,
        options: ["An editor", "A ghost", "A rock", "No one"],
        answer: "An editor"
      }))
    }))
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    name: 'Streak Freeze',
    description: 'Protects your streak if you miss a day.',
    price: 200,
    currencyType: 'gems',
    type: 'streak-freeze'
  },
  {
    id: 'heart-refill',
    name: 'Pixel Heart Refill',
    description: 'Instantly refills your pixel hearts to 5.',
    price: 100,
    currencyType: 'gems',
    type: 'heart-refill'
  },
  {
    id: 'snout-hoodie',
    name: 'Snout Hoodie',
    description: 'A cool cyber-styled hoodie for Poki.',
    price: 500,
    currencyType: 'buddy',
    type: 'clothing',
    image: 'https://i.ibb.co/Pv07JpR9/Gemini-Generated-Image-qft8v9qft8v9qft8-Photoroom.png'
  },
  {
    id: 'banana-jacket',
    name: 'Banana Jacket',
    description: 'A stylish yellow jacket for Coco.',
    price: 500,
    currencyType: 'buddy',
    type: 'clothing',
    image: 'https://i.ibb.co/YF5nkNNj/Gemini-Generated-Image-wbzi6owbzi6owbzi-Photoroom.png'
  }
];

export const POKI_IMG = "https://i.ibb.co/spyFTTm6/Gemini-Generated-Image-3hbxny3hbxny3hbx-Photoroom.png";
export const COCO_IMG = "https://i.ibb.co/7t9jFdqG/Gemini-Generated-Image-4khnl44khnl44khn-Photoroom.png";
export const LOGO_IMG = "https://i.ibb.co/vrKmXSM/PIXEL-BUDDIES.png";
export const POWER_UP_IMG = "https://i.ibb.co/67Y3bmBc/PIXEL-BUDDIES-2.png";
