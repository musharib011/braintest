import { Difficulty } from './types';

export interface KnowledgeQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  category: string;
  difficulty: Difficulty;
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  // GEOGRAPHY - Easy
  { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], answer: 'Pacific', explanation: 'The Pacific Ocean covers about 63 million square miles', category: 'Geography', difficulty: 'easy' },
  { question: 'Which continent is Brazil in?', options: ['Africa', 'Europe', 'South America', 'Asia'], answer: 'South America', explanation: 'Brazil is the largest country in South America', category: 'Geography', difficulty: 'easy' },
  { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], answer: 'Paris', explanation: 'Paris has been the capital of France since the 10th century', category: 'Geography', difficulty: 'easy' },
  { question: 'Which country has the most people?', options: ['USA', 'India', 'China', 'Russia'], answer: 'India', explanation: 'India surpassed China as the most populous country in 2023', category: 'Geography', difficulty: 'easy' },
  { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], answer: 'Nile', explanation: 'The Nile River is approximately 6,650 km long', category: 'Geography', difficulty: 'easy' },
  
  // GEOGRAPHY - Medium
  { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], answer: 'Vatican City', explanation: 'Vatican City is only about 44 hectares', category: 'Geography', difficulty: 'medium' },
  { question: 'Which desert is the largest in the world?', options: ['Sahara', 'Gobi', 'Antarctic', 'Arabian'], answer: 'Antarctic', explanation: 'Antarctica is technically the largest desert by area', category: 'Geography', difficulty: 'medium' },
  { question: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: '7', explanation: 'Africa, Antarctica, Asia, Australia, Europe, North America, South America', category: 'Geography', difficulty: 'medium' },
  { question: 'Which mountain is the tallest above sea level?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], answer: 'Mount Everest', explanation: 'Mount Everest is 8,849 meters above sea level', category: 'Geography', difficulty: 'medium' },
  { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 'Canberra', explanation: 'Canberra was chosen as a compromise between Sydney and Melbourne', category: 'Geography', difficulty: 'medium' },
  
  // GEOGRAPHY - Hard
  { question: 'Which country has the most time zones?', options: ['Russia', 'USA', 'France', 'China'], answer: 'France', explanation: 'France has 12 time zones due to its overseas territories', category: 'Geography', difficulty: 'hard' },
  { question: 'What is the deepest point in the ocean?', options: ['Mariana Trench', 'Tonga Trench', 'Puerto Rico Trench', 'Java Trench'], answer: 'Mariana Trench', explanation: 'The Challenger Deep in the Mariana Trench is about 11,034 meters deep', category: 'Geography', difficulty: 'hard' },
  
  // SCIENCE - Easy
  { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars', explanation: 'Mars appears red due to iron oxide (rust) on its surface', category: 'Science', difficulty: 'easy' },
  { question: 'What gas do plants breathe in?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Carbon Dioxide', explanation: 'Plants use CO2 for photosynthesis', category: 'Science', difficulty: 'easy' },
  { question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], answer: '8', explanation: 'Spiders are arachnids with 8 legs', category: 'Science', difficulty: 'easy' },
  { question: 'What is H2O?', options: ['Salt', 'Sugar', 'Water', 'Oxygen'], answer: 'Water', explanation: 'H2O is the chemical formula for water', category: 'Science', difficulty: 'easy' },
  { question: 'What force keeps us on the ground?', options: ['Magnetism', 'Gravity', 'Friction', 'Wind'], answer: 'Gravity', explanation: 'Gravity pulls objects toward the center of the Earth', category: 'Science', difficulty: 'easy' },
  
  // SCIENCE - Medium
  { question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Steel'], answer: 'Diamond', explanation: 'Diamond scores 10 on the Mohs hardness scale', category: 'Science', difficulty: 'medium' },
  { question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], answer: '300,000 km/s', explanation: 'Light travels at approximately 299,792 km/s', category: 'Science', difficulty: 'medium' },
  { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], answer: '206', explanation: 'Adults have 206 bones; babies have about 270', category: 'Science', difficulty: 'medium' },
  { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 'Au', explanation: 'Au comes from the Latin word "aurum"', category: 'Science', difficulty: 'medium' },
  { question: 'Which organ produces insulin?', options: ['Liver', 'Kidney', 'Pancreas', 'Heart'], answer: 'Pancreas', explanation: 'The pancreas produces insulin to regulate blood sugar', category: 'Science', difficulty: 'medium' },
  
  // SCIENCE - Hard
  { question: 'What is the most abundant element in the universe?', options: ['Oxygen', 'Carbon', 'Helium', 'Hydrogen'], answer: 'Hydrogen', explanation: 'Hydrogen makes up about 75% of all matter in the universe', category: 'Science', difficulty: 'hard' },
  { question: 'What particle has a positive charge?', options: ['Electron', 'Neutron', 'Proton', 'Photon'], answer: 'Proton', explanation: 'Protons have positive charge, electrons negative, neutrons neutral', category: 'Science', difficulty: 'hard' },
  
  // HISTORY - Easy
  { question: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], answer: 'George Washington', explanation: 'Washington served from 1789 to 1797', category: 'History', difficulty: 'easy' },
  { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: '1945', explanation: 'WWII ended in 1945 with the surrender of Japan', category: 'History', difficulty: 'easy' },
  { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], answer: 'Leonardo da Vinci', explanation: 'Da Vinci painted the Mona Lisa between 1503 and 1519', category: 'History', difficulty: 'easy' },
  { question: 'Which ancient wonder was in Egypt?', options: ['Colossus', 'Hanging Gardens', 'Great Pyramid', 'Lighthouse'], answer: 'Great Pyramid', explanation: 'The Great Pyramid of Giza is the only surviving ancient wonder', category: 'History', difficulty: 'easy' },
  
  // HISTORY - Medium
  { question: 'Who discovered America in 1492?', options: ['Magellan', 'Columbus', 'Vespucci', 'Drake'], answer: 'Columbus', explanation: 'Christopher Columbus reached the Americas in 1492', category: 'History', difficulty: 'medium' },
  { question: 'What year did the Titanic sink?', options: ['1910', '1912', '1914', '1916'], answer: '1912', explanation: 'The Titanic sank on April 15, 1912', category: 'History', difficulty: 'medium' },
  { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], answer: 'William Shakespeare', explanation: 'Shakespeare wrote it in the early 1590s', category: 'History', difficulty: 'medium' },
  { question: 'Which empire built the Colosseum?', options: ['Greek', 'Roman', 'Egyptian', 'Persian'], answer: 'Roman', explanation: 'The Colosseum was built in Rome between 70-80 AD', category: 'History', difficulty: 'medium' },
  
  // HISTORY - Hard
  { question: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], answer: 'Neil Armstrong', explanation: 'Armstrong walked on the Moon on July 20, 1969', category: 'History', difficulty: 'hard' },
  { question: 'In what year was the Berlin Wall torn down?', options: ['1987', '1988', '1989', '1990'], answer: '1989', explanation: 'The Berlin Wall fell on November 9, 1989', category: 'History', difficulty: 'hard' },
  
  // NATURE - Easy
  { question: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'], answer: 'Blue Whale', explanation: 'Blue whales can reach up to 100 feet long', category: 'Nature', difficulty: 'easy' },
  { question: 'How many wings does a butterfly have?', options: ['2', '4', '6', '8'], answer: '4', explanation: 'Butterflies have two pairs of wings', category: 'Nature', difficulty: 'easy' },
  { question: 'What do bees make?', options: ['Silk', 'Honey', 'Milk', 'Wax only'], answer: 'Honey', explanation: 'Bees make honey from flower nectar', category: 'Nature', difficulty: 'easy' },
  { question: 'Which animal is the tallest?', options: ['Elephant', 'Giraffe', 'Horse', 'Camel'], answer: 'Giraffe', explanation: 'Giraffes can be up to 18 feet tall', category: 'Nature', difficulty: 'easy' },
  
  // NATURE - Medium
  { question: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Pride', 'Flock'], answer: 'Pride', explanation: 'A group of lions is called a pride', category: 'Nature', difficulty: 'medium' },
  { question: 'Which bird can fly backwards?', options: ['Eagle', 'Hummingbird', 'Sparrow', 'Parrot'], answer: 'Hummingbird', explanation: 'Hummingbirds can fly backwards due to their unique wing structure', category: 'Nature', difficulty: 'medium' },
  { question: 'How long does it take Earth to orbit the Sun?', options: ['30 days', '365 days', '100 days', '500 days'], answer: '365 days', explanation: 'Earth takes about 365.25 days to orbit the Sun', category: 'Nature', difficulty: 'medium' },
  
  // NATURE - Hard
  { question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Gazelle'], answer: 'Cheetah', explanation: 'Cheetahs can reach speeds of 70 mph', category: 'Nature', difficulty: 'hard' },
  { question: 'Which animal has the longest pregnancy?', options: ['Whale', 'Elephant', 'Giraffe', 'Rhino'], answer: 'Elephant', explanation: 'Elephants are pregnant for about 22 months', category: 'Nature', difficulty: 'hard' },
  
  // SPACE - Easy
  { question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: '8', explanation: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune', category: 'Space', difficulty: 'easy' },
  { question: 'What is the closest planet to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], answer: 'Mercury', explanation: 'Mercury is the closest planet to the Sun', category: 'Space', difficulty: 'easy' },
  { question: 'What is the name of our galaxy?', options: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'], answer: 'Milky Way', explanation: 'Our solar system is in the Milky Way galaxy', category: 'Space', difficulty: 'easy' },
  { question: 'Which planet has rings?', options: ['Mars', 'Jupiter', 'Saturn', 'Venus'], answer: 'Saturn', explanation: 'Saturn is famous for its prominent ring system', category: 'Space', difficulty: 'easy' },
  
  // SPACE - Medium
  { question: 'What is the hottest planet?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], answer: 'Venus', explanation: 'Venus has a thick atmosphere that traps heat', category: 'Space', difficulty: 'medium' },
  { question: 'How long does light from the Sun take to reach Earth?', options: ['1 minute', '8 minutes', '1 hour', '1 day'], answer: '8 minutes', explanation: 'Sunlight takes about 8 minutes and 20 seconds to reach Earth', category: 'Space', difficulty: 'medium' },
  { question: 'What is a shooting star?', options: ['A star falling', 'A meteor', 'A comet', 'A planet'], answer: 'A meteor', explanation: 'Shooting stars are meteors burning up in the atmosphere', category: 'Space', difficulty: 'medium' },
  
  // SPACE - Hard
  { question: 'What is a neutron star?', options: ['A cold star', 'A collapsed star', 'A new star', 'A fake star'], answer: 'A collapsed star', explanation: 'Neutron stars are incredibly dense remnants of massive stars', category: 'Space', difficulty: 'hard' },
  { question: 'How many moons does Jupiter have?', options: ['16', '53', '79', '95'], answer: '95', explanation: 'Jupiter has 95 confirmed moons as of 2023', category: 'Space', difficulty: 'hard' },
  
  // TECHNOLOGY - Easy
  { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], answer: 'Central Processing Unit', explanation: 'The CPU is the main processor of a computer', category: 'Technology', difficulty: 'easy' },
  { question: 'What does WWW stand for?', options: ['World Wide Web', 'Web World Wide', 'Wide World Web', 'Web Wide World'], answer: 'World Wide Web', explanation: 'WWW is the system of interlinked hypertext documents', category: 'Technology', difficulty: 'easy' },
  { question: 'Who founded Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'], answer: 'Bill Gates', explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975', category: 'Technology', difficulty: 'easy' },
  
  // TECHNOLOGY - Medium
  { question: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], answer: '2007', explanation: 'The first iPhone was released on June 29, 2007', category: 'Technology', difficulty: 'medium' },
  { question: 'What programming language is known as the "language of the web"?', options: ['Python', 'Java', 'JavaScript', 'C++'], answer: 'JavaScript', explanation: 'JavaScript runs in all web browsers', category: 'Technology', difficulty: 'medium' },
  
  // TECHNOLOGY - Hard
  { question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'HyperText Transmission Protocol', 'High Transfer Text Protocol'], answer: 'HyperText Transfer Protocol', explanation: 'HTTP is the foundation of data communication on the web', category: 'Technology', difficulty: 'hard' },
  { question: 'Who is considered the father of computer science?', options: ['Bill Gates', 'Alan Turing', 'Steve Jobs', 'Tim Berners-Lee'], answer: 'Alan Turing', explanation: 'Turing laid the foundations for computer science and AI', category: 'Technology', difficulty: 'hard' },
  
  // ANIMALS - Easy
  { question: 'What is a baby dog called?', options: ['Kitten', 'Puppy', 'Cub', 'Calf'], answer: 'Puppy', explanation: 'Baby dogs are called puppies', category: 'Animals', difficulty: 'easy' },
  { question: 'Which animal says "moo"?', options: ['Pig', 'Cow', 'Sheep', 'Horse'], answer: 'Cow', explanation: 'Cows make a "moo" sound', category: 'Animals', difficulty: 'easy' },
  { question: 'What do pandas eat?', options: ['Meat', 'Fish', 'Bamboo', 'Fruit'], answer: 'Bamboo', explanation: 'Giant pandas primarily eat bamboo', category: 'Animals', difficulty: 'easy' },
  
  // ANIMALS - Medium
  { question: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], answer: '3', explanation: 'Octopuses have 3 hearts: 2 pump blood to gills, 1 to the body', category: 'Animals', difficulty: 'medium' },
  { question: 'What is the largest species of shark?', options: ['Great White', 'Hammerhead', 'Whale Shark', 'Tiger Shark'], answer: 'Whale Shark', explanation: 'Whale sharks can grow up to 40 feet long', category: 'Animals', difficulty: 'medium' },
  
  // ANIMALS - Hard
  { question: 'Which animal has the longest tongue?', options: ['Giraffe', 'Chameleon', 'Anteater', 'Snake'], answer: 'Chameleon', explanation: 'A chameleon\'s tongue can be twice its body length', category: 'Animals', difficulty: 'hard' },
  { question: 'How long can a snail sleep?', options: ['1 day', '1 week', '1 month', '3 years'], answer: '3 years', explanation: 'Snails can sleep for up to 3 years', category: 'Animals', difficulty: 'hard' },
];

export function getKnowledgeQuestion(difficulty: Difficulty, excludeIds: number[] = []): { question: KnowledgeQuestion; id: number } {
  const available = KNOWLEDGE_QUESTIONS
    .map((q, i) => ({ question: q, id: i }))
    .filter(item => item.question.difficulty === difficulty && !excludeIds.includes(item.id));
  
  if (available.length === 0) {
    // If no questions available, pick from any difficulty
    const all = KNOWLEDGE_QUESTIONS
      .map((q, i) => ({ question: q, id: i }))
      .filter(item => !excludeIds.includes(item.id));
    if (all.length === 0) {
      // Reset if all questions used
      const random = KNOWLEDGE_QUESTIONS[Math.floor(Math.random() * KNOWLEDGE_QUESTIONS.length)];
      return { question: random, id: KNOWLEDGE_QUESTIONS.indexOf(random) };
    }
    return all[Math.floor(Math.random() * all.length)];
  }
  
  return available[Math.floor(Math.random() * available.length)];
}

export function calculateKnowledgeRewards(
  questionsAnswered: number,
  correctAnswers: number,
  difficulty: Difficulty
): { coins: number; xp: number } {
  const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  
  let baseCoins = correctAnswers * 4;
  let baseXP = correctAnswers * 6;
  
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3,
  }[difficulty];
  
  baseCoins = Math.round(baseCoins * difficultyMultiplier);
  baseXP = Math.round(baseXP * difficultyMultiplier);
  
  if (accuracy === 1 && questionsAnswered >= 5) {
    baseCoins += 40;
    baseXP += 20;
  }
  
  return { coins: baseCoins, xp: baseXP };
}
