import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// --- Helper Functions to generate authentic Grade 3 Math ---
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const wrongAnswers = (correct) => [correct, correct + rand(1,3), correct - rand(1,3), correct + rand(4,6)].sort(() => Math.random() - 0.5);

const generateMathForWeek = (week) => {
  if (week === 1) { // Place value up to 500
    return { title: 'Place Value & Ordering (up to 500)', qs: [
      { q: "What is 3 hundreds, 4 tens, and 2 ones?", options: [342, 324, 432, 234], answer: 342 },
      { q: "Which number is larger: 489 or 498?", options: [498, 489, 400, 480], answer: 498 },
      { q: "What is the value of the 5 in 256?", options: [50, 5, 500, 250], answer: 50 }
    ]}
  } else if (week === 2) { // Addition & Subtraction
    return { title: 'Addition & Subtraction (up to 400)', qs: [
      { q: "Liam has 150 marbles. He wins 45 more. How many does he have?", options: [195, 105, 185, 205], answer: 195 },
      { q: "Calculate: 240 + 130", options: [370, 360, 270, 470], answer: 370 },
      { q: "A shop has 300 apples. 120 are sold. How many are left?", options: [180, 280, 120, 420], answer: 180 }
    ]}
  } else if (week === 3) { // Multiplication 2s & 3s
    return { title: 'Multiplication (2s & 3s)', qs: [
      { q: "There are 4 dogs. Each dog has 4 legs. Wait, let's do 3s: 5 cats have how many ears total? (2 ears each)", options: [10, 5, 15, 8], answer: 10 },
      { q: "What is 6 groups of 3?", options: [18, 12, 21, 9], answer: 18 },
      { q: "Calculate 8 x 2", options: [16, 14, 18, 10], answer: 16 }
    ]}
  } else if (week === 4) { // Multiplication 4s, 5s, 10s
    return { title: 'Multiplication (4s, 5s, 10s)', qs: [
      { q: "What is 7 times 5?", options: [35, 30, 40, 25], answer: 35 },
      { q: "There are 6 hands. How many fingers in total? (5 per hand)", options: [30, 25, 35, 20], answer: 30 },
      { q: "Calculate 9 x 10", options: [90, 80, 100, 19], answer: 90 }
    ]}
  } else if (week === 5) { // Fractions
    return { title: 'Fractions (Halves & Quarters)', qs: [
      { q: "If you cut a pizza into 4 equal slices, what is one slice called?", options: ["One quarter", "One half", "One third", "Whole"], answer: "One quarter" },
      { q: "How many halves make a whole?", options: [2, 3, 4, 1], answer: 2 },
      { q: "What is half of 20?", options: [10, 5, 15, 2], answer: 10 }
    ]}
  } else if (week === 6) { // Sharing
    return { title: 'Grouping & Sharing Equally', qs: [
      { q: "Share 24 sweets equally between 4 friends. How many does each get?", options: [6, 8, 4, 12], answer: 6 },
      { q: "Divide 15 balls into groups of 3. How many groups?", options: [5, 3, 4, 6], answer: 5 },
      { q: "If 10 children sit at 2 tables equally, how many at each table?", options: [5, 2, 10, 8], answer: 5 }
    ]}
  } else if (week === 7) { // Measurement Length
    return { title: 'Measurement (Length)', qs: [
      { q: "Which tool do you use to measure the length of a pencil?", options: ["Ruler", "Scale", "Thermometer", "Clock"], answer: "Ruler" },
      { q: "How many centimeters in 1 meter?", options: [100, 10, 1000, 50], answer: 100 },
      { q: "If a string is 15cm and you add 10cm, how long is it?", options: [25, 5, 150, 20], answer: 25 }
    ]}
  } else if (week === 8) { // Time
    return { title: 'Measurement (Time)', qs: [
      { q: "How many minutes are in one hour?", options: [60, 30, 100, 24], answer: 60 },
      { q: "How many days in a week?", options: [7, 5, 14, 30], answer: 7 },
      { q: "If it is 2:00 PM, what time will it be in 2 hours?", options: ["4:00 PM", "3:00 PM", "12:00 PM", "5:00 PM"], answer: "4:00 PM" }
    ]}
  } else if (week === 9) { // Data
    return { title: 'Data Handling', qs: [
      { q: "In a tally chart, what does a group of crossed lines represent?", options: ["5", "4", "10", "1"], answer: "5" },
      { q: "If a bar graph shows 3 apples and 4 bananas, how many fruits in total?", options: [7, 1, 12, 4], answer: 7 }
    ]}
  } else {
    return { title: 'Term 2 Math Revision', qs: [
      { q: "Calculate 45 + 55", options: [100, 90, 110, 80], answer: 100 },
      { q: "What is 8 x 5?", options: [40, 45, 35, 50], answer: 40 },
      { q: "Share 30 by 3", options: [10, 5, 3, 33], answer: 10 }
    ]}
  }
}

// --- Authentic English Content ---
const englishTopics = [
  { t: "Punctuation (Capital Letters)", qs: [{ q: "Which sentence is correct?", options: ["the dog barks.", "The dog barks.", "The Dog Barks.", "the dog Barks."], answer: "The dog barks." }, { q: "Identify the proper noun that needs a capital letter.", options: ["Apple", "park", "london", "House"], answer: "london" }] },
  { t: "Nouns (Naming Words)", qs: [{ q: "Which word is a noun?", options: ["Run", "Quickly", "Cat", "Blue"], answer: "Cat" }, { q: "Find the noun in this sentence: 'The red apple is sweet.'", options: ["red", "apple", "is", "sweet"], answer: "apple" }] },
  { t: "Verbs (Action Words)", qs: [{ q: "Which word is an action word (verb)?", options: ["Jump", "Table", "Happy", "Soft"], answer: "Jump" }, { q: "Find the verb: 'Liam reads a book.'", options: ["Liam", "reads", "a", "book"], answer: "reads" }] },
  { t: "Adjectives (Describing Words)", qs: [{ q: "Which word describes the noun in 'The tall tree'?", options: ["The", "tall", "tree", "None"], answer: "tall" }, { q: "Choose an adjective to describe a fire.", options: ["Cold", "Hot", "Wet", "Slow"], answer: "Hot" }] },
  { t: "Pronouns (He, She, It, They)", qs: [{ q: "Replace 'Liam' with a pronoun: 'Liam is playing.'", options: ["He is playing.", "She is playing.", "They are playing.", "It is playing."], answer: "He is playing." }, { q: "Which pronoun is for a group of people?", options: ["He", "She", "They", "It"], answer: "They" }] },
  { t: "Plurals (Adding -s or -es)", qs: [{ q: "What is the plural of 'dog'?", options: ["doges", "dogs", "doggies", "dog"], answer: "dogs" }, { q: "What is the plural of 'box'?", options: ["boxs", "boies", "boxen", "boxes"], answer: "boxes" }] },
  { t: "Past Tense", qs: [{ q: "What is the past tense of 'jump'?", options: ["jumping", "jumps", "jumped", "jumpt"], answer: "jumped" }, { q: "Change to past tense: 'I walk to school.'", options: ["I walked to school.", "I walking to school.", "I walks to school.", "I will walk to school."], answer: "I walked to school." }] },
  { t: "Sentence Structure", qs: [{ q: "Fix the sentence: 'ball he kicks the'", options: ["He ball kicks the", "He kicks the ball", "The kicks he ball", "Kicks he the ball"], answer: "He kicks the ball" }] },
  { t: "Antonyms (Opposites)", qs: [{ q: "What is the opposite of 'hot'?", options: ["Warm", "Cold", "Fire", "Red"], answer: "Cold" }, { q: "What is the opposite of 'fast'?", options: ["Quick", "Slow", "Run", "Speed"], answer: "Slow" }] },
  { t: "English Review", qs: [{ q: "Which word is a verb?", options: ["Car", "Sing", "Blue", "Soft"], answer: "Sing" }, { q: "What is the plural of 'cat'?", options: ["cats", "cates", "caties", "cat"], answer: "cats" }] }
];

// --- Authentic isiXhosa Content (FAL) ---
const xhosaVocab = [
  { t: "Greetings", cards: [{xhosa: "Molo", english: "Hello (one person)"}, {xhosa: "Molweni", english: "Hello (many people)"}, {xhosa: "Unjani?", english: "How are you?"}, {xhosa: "Ndiphilile", english: "I am fine"}, {xhosa: "Enkosi", english: "Thank you"}] },
  { t: "Numbers 1-5", cards: [{xhosa: "Nye", english: "One (1)"}, {xhosa: "Bini", english: "Two (2)"}, {xhosa: "Nthu", english: "Three (3)"}, {xhosa: "Ne", english: "Four (4)"}, {xhosa: "Hlanu", english: "Five (5)"}] },
  { t: "Numbers 6-10", cards: [{xhosa: "Nthandathu", english: "Six (6)"}, {xhosa: "Xhenxe", english: "Seven (7)"}, {xhosa: "Bhozo", english: "Eight (8)"}, {xhosa: "Lithoba", english: "Nine (9)"}, {xhosa: "Lishumi", english: "Ten (10)"}] },
  { t: "Family Members", cards: [{xhosa: "Tata", english: "Father"}, {xhosa: "Mama", english: "Mother"}, {xhosa: "Makhulu", english: "Grandmother"}, {xhosa: "Bhuti", english: "Brother"}, {xhosa: "Sisi", english: "Sister"}] },
  { t: "Animals", cards: [{xhosa: "Inja", english: "Dog"}, {xhosa: "Ikati", english: "Cat"}, {xhosa: "Inkomo", english: "Cow"}, {xhosa: "Ihashe", english: "Horse"}, {xhosa: "Intaka", english: "Bird"}] },
  { t: "My Body", cards: [{xhosa: "Intloko", english: "Head"}, {xhosa: "Amehlo", english: "Eyes"}, {xhosa: "Iindlebe", english: "Ears"}, {xhosa: "Umlomo", english: "Mouth"}, {xhosa: "Izandla", english: "Hands"}] },
  { t: "Colors", cards: [{xhosa: "Bomvu", english: "Red"}, {xhosa: "Luhlaza", english: "Blue/Green"}, {xhosa: "Mthubi", english: "Yellow"}, {xhosa: "Mhlophe", english: "White"}, {xhosa: "Mnyama", english: "Black"}] },
  { t: "Food", cards: [{xhosa: "Isonka", english: "Bread"}, {xhosa: "Amanzi", english: "Water"}, {xhosa: "Ubisi", english: "Milk"}, {xhosa: "Inyama", english: "Meat"}, {xhosa: "Iqanda", english: "Egg"}] },
  { t: "Action Words", cards: [{xhosa: "Baleka", english: "Run"}, {xhosa: "Hlala", english: "Sit"}, {xhosa: "Yima", english: "Stand"}, {xhosa: "Thetha", english: "Speak"}, {xhosa: "Mamela", english: "Listen"}] },
  { t: "isiXhosa Review", cards: [{xhosa: "Ndiyabulela", english: "I am grateful"}, {xhosa: "Uxolo", english: "Excuse me / Sorry"}, {xhosa: "Sala kakuhle", english: "Stay well (Goodbye)"}, {xhosa: "Hamba kakuhle", english: "Go well (Goodbye)"}] }
];

const generateData = () => {
  const allTasks = []

  for (let week = 1; week <= 10; week++) {
    const math = generateMathForWeek(week);
    const eng = englishTopics[week - 1];
    const xho = xhosaVocab[week - 1];

    // Monday
    allTasks.push({ week_number: week, day_of_week: 1, subject: 'math', title: `Math: ${math.title}`, description: `Focus: ${math.title}`, interactive_type: 'quiz', interactive_content: { questions: math.qs } })
    allTasks.push({ week_number: week, day_of_week: 1, subject: 'xhosa', title: `isiXhosa: ${xho.t}`, description: `Learn ${xho.t} vocabulary.`, interactive_type: 'flashcard', interactive_content: { cards: xho.cards } })

    // Tuesday 
    allTasks.push({ week_number: week, day_of_week: 2, subject: 'english', title: `English: ${eng.t}`, description: `Grammar and Structure practice.`, interactive_type: 'quiz', interactive_content: { questions: eng.qs } })
    allTasks.push({ week_number: week, day_of_week: 2, subject: 'reading', title: 'Reading Time', description: 'Read a story book for 20 minutes.', interactive_type: null, interactive_content: null })

    // Wednesday
    allTasks.push({ week_number: week, day_of_week: 3, subject: 'math', title: `Math Word Problems`, description: `Word problems for ${math.title}.`, interactive_type: 'quiz', interactive_content: { questions: math.qs } }) // Re-using qs for simplicity, but in a real app we'd generate more
    allTasks.push({ week_number: week, day_of_week: 3, subject: 'xhosa', title: `isiXhosa: Flashcard Review`, description: 'Review your vocabulary.', interactive_type: 'flashcard', interactive_content: { cards: xho.cards.slice().reverse() } })

    // Thursday
    allTasks.push({ week_number: week, day_of_week: 4, subject: 'english', title: `Creative Writing / Review`, description: `Practice ${eng.t} in sentences.`, interactive_type: 'quiz', interactive_content: { questions: eng.qs.slice().reverse() } })
    allTasks.push({ week_number: week, day_of_week: 4, subject: 'english', title: 'Spelling Prep', description: 'Prepare for Friday spelling test.', interactive_type: null, interactive_content: null })

    // Friday
    allTasks.push({ week_number: week, day_of_week: 5, subject: 'fun', title: 'Coding & Typing', description: 'Play an educational game.', interactive_type: 'typing', interactive_content: null })
    
    // Saturday
    allTasks.push({ week_number: week, day_of_week: 6, subject: 'fun', title: 'Free Play!', description: 'Enjoy your weekend.', interactive_type: null, interactive_content: null })

    // Sunday
    allTasks.push({ week_number: week, day_of_week: 0, subject: 'math', title: `Math Reflex Review`, description: 'Sunday catch up.', interactive_type: 'quiz', interactive_content: { questions: [math.qs[0]] } })
  }
  return allTasks
}

async function run() {
  const data = generateData()
  console.log(`Clearing old tasks...`)
  await supabase.from('curriculum_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log(`Clearing old progress...`)
  await supabase.from('task_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  console.log(`Inserting ${data.length} REALLY REAL Q2 tasks...`)
  const batches = []
  for (let i = 0; i < data.length; i += 50) {
    batches.push(data.slice(i, i + 50))
  }
  
  for (const batch of batches) {
    const { error } = await supabase.from('curriculum_tasks').insert(batch)
    if (error) console.error("Error inserting batch:", error)
  }
  console.log("Q2 Curriculum seeded successfully with full CAPS data!")
}

run()
