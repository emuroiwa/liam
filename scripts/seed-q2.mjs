import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const topics = {
  math: [
    "Grouping Concepts", "Sharing Equally", "Addition Word Problems", 
    "Subtraction Word Problems", "Multiplication by 2 & 5", "Fractions: Halves & Quarters",
    "Time: Reading Analogue Clocks", "Money: Calculating Change", "Data: Simple Bar Graphs",
    "Consolidation & Review"
  ],
  english: [
    "Punctuation (Capital letters & Full stops)", "Creative Writing: Sentences",
    "Punctuation (Question & Exclamation marks)", "Sentence Structure (Nouns & Verbs)",
    "Creative Writing: Short Paragraphs", "Spelling rules (Vowel sounds)",
    "Sentence Structure (Adjectives)", "Reading Comprehension", 
    "Creative Writing: Sequencing", "Term 2 Review"
  ],
  xhosa: [
    "Greetings (Molo, Unjani)", "Numbers 1-5", "Numbers 6-10", "Family Members (Tata, Mama)",
    "Animals (Inja, Ikati)", "Body Parts (Intloko, Amehlo)", "Colors (Bomvu, Luhlaza)",
    "Food (Isonka, Amanzi)", "Action words (Baleka, Hlala)", "Vocabulary Review"
  ]
}

const generateData = () => {
  const allTasks = []

  for (let week = 1; week <= 10; week++) {
    const mathTopic = topics.math[week - 1]
    const engTopic = topics.english[week - 1]
    const xhoTopic = topics.xhosa[week - 1]

    // Monday
    allTasks.push({ week_number: week, day_of_week: 1, subject: 'math', title: `Math: ${mathTopic}`, description: `Q2 Week ${week} practice.`, interactive_type: 'quiz', interactive_content: { questions: [{ q: `Sample question for ${mathTopic}`, options: [1,2,3,4], answer: 1 }] } })
    allTasks.push({ week_number: week, day_of_week: 1, subject: 'xhosa', title: `isiXhosa: ${xhoTopic}`, description: `Q2 Week ${week} practice.`, interactive_type: 'flashcard', interactive_content: { cards: [{ xhosa: "Sample", english: "Sample" }] } })

    // Tuesday 
    allTasks.push({ week_number: week, day_of_week: 2, subject: 'english', title: `English: ${engTopic}`, description: `Q2 Week ${week} practice.`, interactive_type: 'reading', interactive_content: { text: "Focus on your punctuation this week."} })
    allTasks.push({ week_number: week, day_of_week: 2, subject: 'reading', title: 'Reading Time', description: 'Read a book for 20 mins.', interactive_type: null, interactive_content: null })

    // Wednesday
    allTasks.push({ week_number: week, day_of_week: 3, subject: 'math', title: `Math: ${mathTopic} Practice`, description: 'More practice.', interactive_type: 'quiz', interactive_content: { questions: [{ q: `Word problem for ${mathTopic}`, options: [1,2,3,4], answer: 1 }] } })
    allTasks.push({ week_number: week, day_of_week: 3, subject: 'xhosa', title: `isiXhosa Review`, description: 'Review vocab.', interactive_type: null, interactive_content: null })

    // Thursday
    allTasks.push({ week_number: week, day_of_week: 4, subject: 'english', title: `English: ${engTopic}`, description: 'Homework practice.', interactive_type: null, interactive_content: null })
    allTasks.push({ week_number: week, day_of_week: 4, subject: 'english', title: 'Spelling Prep', description: 'Get ready for Friday spelling.', interactive_type: null, interactive_content: null })

    // Friday
    allTasks.push({ week_number: week, day_of_week: 5, subject: 'fun', title: 'Coding & Typing', description: 'Typing game.', interactive_type: 'typing', interactive_content: null })
    
    // Saturday
    allTasks.push({ week_number: week, day_of_week: 6, subject: 'fun', title: 'Rest Day!', description: 'No studying!', interactive_type: null, interactive_content: null })

    // Sunday
    allTasks.push({ week_number: week, day_of_week: 0, subject: 'math', title: `Math: Week ${week} Review`, description: 'Sunday catch up.', interactive_type: null, interactive_content: null })
  }
  return allTasks
}

async function run() {
  const data = generateData()
  console.log(`Clearing old tasks...`)
  await supabase.from('curriculum_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  console.log(`Inserting ${data.length} Q2 tasks...`)
  const batches = []
  for (let i = 0; i < data.length; i += 50) {
    batches.push(data.slice(i, i + 50))
  }
  
  for (const batch of batches) {
    const { error } = await supabase.from('curriculum_tasks').insert(batch)
    if (error) console.error(error)
  }
  console.log("Q2 Curriculum seeded successfully!")
}

run()
