import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase URL or Anon Key. Please check your .env.local file.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const tasks = [
  // Monday: Math (Grouping) & isiXhosa
  {
    day_of_week: 1,
    subject: 'math',
    title: 'Math: Grouping & Sharing',
    description: 'Practice dividing items into equal groups.',
    interactive_type: 'quiz',
    interactive_content: {
      questions: [
        { q: "If you have 12 apples and share them equally among 3 friends, how many does each get?", options: [3, 4, 5, 6], answer: 4 },
        { q: "Share 20 sweets between 4 children. How many sweets per child?", options: [4, 5, 2, 10], answer: 5 },
        { q: "Group 15 balls into groups of 5. How many groups?", options: [2, 3, 4, 5], answer: 3 },
      ]
    }
  },
  {
    day_of_week: 1,
    subject: 'xhosa',
    title: 'isiXhosa Vocabulary',
    description: 'Learn common greetings.',
    interactive_type: 'flashcard',
    interactive_content: {
      cards: [
        { xhosa: "Molo", english: "Hello (to one person)" },
        { xhosa: "Unjani?", english: "How are you?" },
        { xhosa: "Ndiphilile", english: "I am fine" },
        { xhosa: "Enkosi", english: "Thank you" }
      ]
    }
  },
  // Tuesday: English & Reading
  {
    day_of_week: 2,
    subject: 'english',
    title: 'Creative Writing',
    description: 'Write 3 sentences about your weekend using correct punctuation.',
    interactive_type: 'reading',
    interactive_content: { text: "Remember to use capital letters at the start of your sentences and full stops at the end!" }
  },
  {
    day_of_week: 2,
    subject: 'reading',
    title: 'Reading Time',
    description: 'Read a story book for 15 minutes.',
    interactive_type: null,
    interactive_content: null
  },
  // Wednesday: Math (Addition) & isiXhosa
  {
    day_of_week: 3,
    subject: 'math',
    title: 'Math Word Problems',
    description: 'Solve addition and subtraction word problems.',
    interactive_type: 'quiz',
    interactive_content: {
      questions: [
        { q: "Thabo had 15 marbles. He won 8 more. How many does he have now?", options: [20, 23, 22, 25], answer: 23 },
        { q: "Sarah bought a book for R45. She gave the cashier R50. How much change did she get?", options: [5, 10, 15, 2], answer: 5 }
      ]
    }
  },
  {
    day_of_week: 3,
    subject: 'xhosa',
    title: 'isiXhosa Numbers',
    description: 'Practice counting to 5 in isiXhosa.',
    interactive_type: 'flashcard',
    interactive_content: {
      cards: [
        { xhosa: "Nye", english: "One (1)" },
        { xhosa: "Bini", english: "Two (2)" },
        { xhosa: "Xhathu", english: "Three (3)" },
        { xhosa: "Ne", english: "Four (4)" },
        { xhosa: "Hlanu", english: "Five (5)" }
      ]
    }
  },
  // Thursday: English & Spelling
  {
    day_of_week: 4,
    subject: 'english',
    title: 'Sentence Structure',
    description: 'Fix the mixed-up sentences.',
    interactive_type: 'quiz',
    interactive_content: {
      questions: [
        { q: "dog The barks loudly.", options: ["The dog loudly barks.", "The dog barks loudly.", "Barks loudly the dog.", "The barks dog loudly."], answer: "The dog barks loudly." },
        { q: "cat sleeping is The.", options: ["Sleeping is the cat.", "The cat sleeping is.", "The cat is sleeping.", "The is sleeping cat."], answer: "The cat is sleeping." }
      ]
    }
  },
  {
    day_of_week: 4,
    subject: 'english',
    title: 'Spelling Prep',
    description: 'Get ready for Friday spelling test.',
    interactive_type: null,
    interactive_content: null
  },
  // Friday: Fun
  {
    day_of_week: 5,
    subject: 'fun',
    title: 'Coding & Typing',
    description: 'Play an educational typing game or block coding activity.',
    interactive_type: 'typing',
    interactive_content: null
  },
  // Saturday: Rest
  {
    day_of_week: 6,
    subject: 'fun',
    title: 'Rest Day!',
    description: 'No studying today! Relax and have fun playing.',
    interactive_type: null,
    interactive_content: null
  },
  // Sunday: Review
  {
    day_of_week: 0,
    subject: 'math',
    title: 'Math Review',
    description: 'Quick review of the week\'s math concepts.',
    interactive_type: null,
    interactive_content: null
  },
  {
    day_of_week: 0,
    subject: 'reading',
    title: 'Story Time',
    description: 'Shared reading of a fun story with Mom or Dad.',
    interactive_type: null,
    interactive_content: null
  }
]

async function seedDatabase() {
  console.log("Clearing existing curriculum tasks...")
  const { error: deleteError } = await supabase
    .from('curriculum_tasks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows
  
  if (deleteError) {
    console.error("Error clearing data:", deleteError)
    return
  }

  console.log("Seeding new weekly curriculum data...")
  const { data, error } = await supabase
    .from('curriculum_tasks')
    .insert(tasks)
    .select()

  if (error) {
    console.error("Error inserting data:", error)
  } else {
    console.log(`Successfully inserted ${data.length} tasks!`)
  }
}

seedDatabase()
