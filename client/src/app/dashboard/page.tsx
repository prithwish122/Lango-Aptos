"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Clock, Trophy, Star, Book, ChevronRight, X, CheckCircle, Settings } from "lucide-react"
import { ethers, BrowserProvider } from "ethers"
import Link from "next/link"
import lingPro from "../contractInfo/lingPro.json"
import { WalletSelector } from "../components/WalletSelector"
import { useQueryClient } from "@tanstack/react-query"
import { aptosClient } from "@/utils/aptosClient"
import { LANGO_ABI } from "@/utils/lango"
import { toast } from "../components/ui/use-toast"
import { useWalletClient } from "@thalalabs/surf/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react"

interface Lesson {
  title: string
  level: string
  duration: string
  tokens: number
  progress: number
  status: "Start" | "Continue"
}

interface NativeSpeaker {
  name: string
  language: string
  time: string
  available: boolean
}

interface Reward {
  title: string
  tokens: number
  description?: string
}

interface ExamSettings {
  language: string
  difficulty: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

interface ExamState {
  questions: Question[]
  currentQuestionIndex: number
  userAnswers: (string | null)[]
  timeRemaining: number
  examInProgress: boolean
  examCompleted: boolean
  score: number
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
    }
  }
}

const DashboardPage = () => {

  const { account, connected, disconnect, wallet } = useWallet();


  // Uncomment and use the wallet client hook to get the client instance
  const { client } = useWalletClient();

  // const queryClient = useQueryClient();

  const [messageContent, setMessageContent] = useState<string>();
  const [newMessageContent, setNewMessageContent] = useState<string>();


  const address = "0x5a5d125b5d1c3b57cc8b0901196139bff53c53d7d27dc8c27edea4190fa7f381";




 







  const [walletConnected, setWalletConnected] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showAIExamModal, setShowAIExamModal] = useState(false)
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    language: "Spanish",
    difficulty: "Intermediate",
  })
  const [isGeneratingExam, setIsGeneratingExam] = useState(false)
  const [generatedExam, setGeneratedExam] = useState<any>(null)
  const [examMarkdown, setExamMarkdown] = useState<string>("")

  // Exam state
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    timeRemaining: 10,
    examInProgress: false,
    examCompleted: false,
    score: 0,
  })

  // Timer effect for question countdown
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (examState.examInProgress && examState.timeRemaining > 0) {
      timer = setTimeout(() => {
        setExamState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
    } else if (examState.examInProgress && examState.timeRemaining === 0) {
      // Time's up for this question, move to next or record no answer
      handleTimeUp()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [examState.timeRemaining, examState.examInProgress])

  // const connectWallet = async () => {
  //   if (typeof window.ethereum !== "undefined") {
  //     try {
  //       const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
  //       setWalletAddress(accounts[0])
  //       setWalletConnected(true)
  //     } catch (error) {
  //       console.error("Error connecting to wallet:", error)
  //     }
  //   } else {
  //     alert("MetaMask is not installed. Please install it to use this feature.")
  //   }
  // }

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setShowConfirmation(true)
  }

  // const handleConfirm = () => {
  //   setShowConfirmation(false)
  //   donateInititate()
  //   // Additional logic for starting the lesson
  // }
const handleConfirm = async () => {
  setShowConfirmation(false);
  await donateInititate(); // Wait for this to finish
  setShowAIExamModal(true); // Now show the AI modal
};



// ethereum func

  // const donateInititate = async () => {
  //   const claimAmt = 10
  //   const contractAddress = "0xF63cFCE89397a98a53FC0eb347eFb1E2DA87346D"
  //   if (typeof window.ethereum === "undefined") {
  //     console.log("Ethereum provider is not available.")
  //     return
  //   }

  //   const provider = new BrowserProvider(window.ethereum)

  //   const signer = await provider.getSigner()
  //   const address = await signer.getAddress()
  //   console.log("Wallet Address:", address)
  //   const humorTokenContract = new ethers.Contract(contractAddress, lingPro.abi, signer)
  //   console.log(claimAmt, "========inside withdraw===")

  //   await (
  //     await humorTokenContract.donate(
  //       address,
  //       "0x94A7Af5edB47c3B91d1B4Ffc2CA535d7aDA8CEDe",
  //       ethers.parseUnits(claimAmt.toString(), 18),
  //     )
  //   ).wait()
  // }


   const donateInititate = async () => {
    if (!client) {
      return;
    }

    try {
      const committedTransaction = await client.useABI(LANGO_ABI).transfer({
        type_arguments: [],
        arguments: [address,5000000000],
      });
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["message-content"],
      // });
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  };



  // const withdrawInititate = async () => {
  //   setShowDropdown(!showDropdown)
  //   const claimAmt = 25
  //   const contractAddress = "0xF63cFCE89397a98a53FC0eb347eFb1E2DA87346D"
  //   if (typeof window.ethereum === "undefined") {
  //     console.log("Ethereum provider is not available.")
  //     return
  //   }

  //   const provider = new BrowserProvider(window.ethereum)

  //   const signer = await provider.getSigner()
  //   const address = await signer.getAddress()
  //   console.log("Wallet Address:", address)
  //   const humorTokenContract = new ethers.Contract(contractAddress, lingPro.abi, signer)
  //   console.log(claimAmt, "========inside withdraw===")

  //   await (await humorTokenContract.mint(address, ethers.parseUnits(claimAmt.toString(), 18))).wait()
  // }

   const withdrawInititate = async () => {
    if (!account || !client) {
      return;
    }

    try {
      const committedTransaction = await client.useABI(LANGO_ABI).mint({
        type_arguments: [],
        arguments: [account.address.toString(),10000000000],
      });
      const executedTransaction = await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["message-content"],
      // });
      toast({
        title: "Success",
        description: `Transaction succeeded, hash: ${executedTransaction.hash}`,
      });
    } catch (error) {
      console.error(error);
    }
  }







  const handleExamGeneration = async () => {
    setIsGeneratingExam(true)

    try {
      const response = await fetch("https://aiedu-ok8q.onrender.com/ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: examSettings.language,
          level: examSettings.difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate exam")
      }

      const responseText = await response.text()

      // Remove any markdown formatting (backticks) that might be in the response
      const cleanedText = responseText.replace(/```json|```/g, "").trim()
      console.log("API Response:", cleanedText)

      try {
        // Attempt to parse the cleaned text as JSON
        const data = JSON.parse(cleanedText)
        setGeneratedExam(data)

        // Extract questions from the response and format them for our interface
        const formattedQuestions = formatExamQuestions(data)

        // Initialize exam state with the questions
        setExamState({
          questions: formattedQuestions,
          currentQuestionIndex: 0,
          userAnswers: Array(formattedQuestions.length).fill(null),
          timeRemaining: 10,
          examInProgress: false,
          examCompleted: false,
          score: 0,
        })

        // Create markdown representation
        const markdown = `# ${examSettings.language} ${examSettings.difficulty} Exam\n\n${JSON.stringify(data, null, 2)}`
        setExamMarkdown(markdown)
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError, responseText)
        // If JSON parsing fails, just use the text response directly
        setGeneratedExam({ content: responseText })
        setExamMarkdown(`# ${examSettings.language} ${examSettings.difficulty} Exam\n\n${responseText}`)
      }
    } catch (error) {
      console.error("Error generating exam:", error)
      alert("Failed to generate exam. Please try again later.")
    } finally {
      setIsGeneratingExam(false)
    }
  }

  // Function to format exam questions from the API response
  const formatExamQuestions = (examData: any): Question[] => {
    console.log("Formatting exam data:", examData)

    try {
      // Check if the response has a questions array
      if (examData.questions) {
        return examData.questions.map((q: any, index: number) => {
          // Determine the correct answer

          let correctAnswer = q.correct_answer || q.answer || ""

          // If correctAnswer is a number (index), convert it to the actual option
          if (typeof correctAnswer === "number" && q.options && q.options[correctAnswer]) {
            correctAnswer = q.options[correctAnswer]
          }

          // If no correct answer is provided, default to the first option
          if (!correctAnswer && q.options && q.options.length > 0) {
            correctAnswer = q.options[0]
          }

          return {
            id: index,
            question: q.question,
            options: q.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: correctAnswer,
          }
        })
      }

      // Check if the response has a different structure
      if (examData.data && examData.data.questions) {
        return examData.data.questions.map((q: any, index: number) => {
          let correctAnswer = q.correctAnswer || q.answer || ""

          if (typeof correctAnswer === "number" && q.options && q.options[correctAnswer]) {
            correctAnswer = q.options[correctAnswer]
          }

          if (!correctAnswer && q.options && q.options.length > 0) {
            correctAnswer = q.options[0]
          }

          return {
            id: index,
            question: q.question,
            options: q.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: correctAnswer,
          }
        })
      }

      // Fallback: Generate sample questions with correct answers clearly indicated
      console.warn("Could not find questions in API response, using fallback questions")
      return [
        {
          id: 0,
          question: `Sample ${examSettings.language} question 1: What is the correct translation for "Hello"?`,
          options: ["Hola", "Adiós", "Gracias", "Por favor"],
          correctAnswer: "Hola",
        },
        {
          id: 1,
          question: `Sample ${examSettings.language} question 2: Which verb tense is used in "I was eating"?`,
          options: ["Present", "Past continuous", "Future", "Present perfect"],
          correctAnswer: "Past continuous",
        },
        {
          id: 2,
          question: `Sample ${examSettings.language} question 3: What is the correct article for a feminine noun?`,
          options: ["El", "La", "Los", "Las"],
          correctAnswer: "La",
        },
      ]
    } catch (error) {
      console.error("Error formatting questions:", error)
      return []
    }
  }

  // Start the exam with timed questions
  const startExam = () => {
    setExamState((prev) => ({
      ...prev,
      examInProgress: true,
      timeRemaining: 10,
      userAnswers: Array(prev.questions.length).fill(null),
      currentQuestionIndex: 0,
      examCompleted: false,
      score: 0,
    }))
  }

  // Handle when time runs out for a question
  const handleTimeUp = () => {
    const { currentQuestionIndex, questions, userAnswers } = examState

    // Check if this was the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Calculate final score
      calculateFinalScore()
    } else {
      // Move to next question
      setExamState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: 10,
      }))
    }
  }

  // Handle user answer selection
  const handleAnswerSelect = (answer: string) => {
    const { currentQuestionIndex, questions, userAnswers } = examState

    // Record user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answer

    // Check if this was the last question
    if (currentQuestionIndex === questions.length - 1) {
      setExamState((prev) => ({
        ...prev,
        userAnswers: newUserAnswers,
        timeRemaining: 0,
      }))

      // Calculate final score
      calculateFinalScore()
    } else {
      // Move to next question
      setExamState((prev) => ({
        ...prev,
        userAnswers: newUserAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: 10,
      }))
    }
  }

  // Calculate the final score
  const calculateFinalScore = () => {
    const { questions, userAnswers } = examState

    // Count correct answers and track performance per question
    let correctCount = 0
    const questionResults = questions.map((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer
      if (isCorrect) correctCount++
      return {
        question: question.question,
        userAnswer: userAnswers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
      }
    })

    const finalScore = (correctCount / questions.length) * 100

    // Log detailed results for debugging
    console.log("Exam Results:", {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: finalScore,
      detailedResults: questionResults,
    })

    // Update exam state
    setExamState((prev) => ({
      ...prev,
      examInProgress: false,
      examCompleted: true,
      score: finalScore,
    }))

    // If score is good, award tokens (optional feature)
    if (finalScore >= 70) {
      // You could implement token rewards here
      console.log(`User earned tokens for scoring ${finalScore}%`)
    }
  }

  // Function to export the markdown exam
  const exportExam = () => {
    const blob = new Blob([examMarkdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${examSettings.language}_${examSettings.difficulty}_exam.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const lessons: Lesson[] = [
    {
      title: "Mastering Spanish ",
      level: "Intermediate",
      duration: "20 min",
      tokens: 50,
      progress: 0,
      status: "Start",
    },
    {
      title: "Essential Vocabulary",
      level: "Beginner",
      duration: "15 min",
      tokens: 30,
      progress: 25,
      status: "Continue",
    },
    {
      title: "Common Phrases",
      level: "Advanced",
      duration: "25 min",
      tokens: 60,
      progress: 75,
      status: "Continue",
    },
  ]

  const nativeSpeakers: NativeSpeaker[] = [
    {
      name: "Maria Garcia",
      language: "Spanish",
      time: "2:00 PM",
      available: true,
    },
    {
      name: "Hans Weber",
      language: "German",
      time: "3:30 PM",
      available: true,
    },
    {
      name: "Yuki Tanaka",
      language: "Japanese",
      time: "5:00 PM",
      available: false,
    },
  ]

  const rewards: Reward[] = [
    {
      title: "Extra Tokens",
      tokens: 50,
      description: "Get bonus tokens for your next lesson",
    },
    {
      title: "Free Lesson",
      tokens: 100,
      description: "Unlock a premium lesson for free",
    },
    {
      title: "1-on-1 Session",
      tokens: 250,
      description: "30-minute private session with a native speaker",
    },
  ]

  const languageOptions = ["Spanish", "French", "German", "Japanese", "Italian", "Chinese", "Russian", "Portuguese"]
  const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"]

  // Component for Native Speaker Card
  const NativeSpeakerCard: React.FC<{ speaker: NativeSpeaker }> = ({ speaker }) => (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:bg-white/50 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
          {speaker.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800">{speaker.name}</h3>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{speaker.language}</span>
            <span>•</span>
            <span>{speaker.time}</span>
          </div>
        </div>
        <div>
          {speaker.available ? (
            <button className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-xs font-medium hover:bg-green-500/20 transition-colors duration-300">
              Available
            </button>
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Not Available</span>
          )}
        </div>
      </div>
    </div>
  )

  // Component for Reward Card
  const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:bg-white/50 transition-all duration-300">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-800">{reward.title}</h3>
          <div className="flex items-center space-x-2">
            <Trophy size={14} className="text-yellow-600" />
            <span className="text-sm font-semibold text-gray-900">{reward.tokens}</span>
          </div>
        </div>
        {reward.description && <p className="text-xs text-gray-500">{reward.description}</p>}
      </div>
    </div>
  )

  // Component for Question Display
  const QuestionDisplay = () => {
    const { questions, currentQuestionIndex, timeRemaining, userAnswers } = examState
    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion) return null

    return (
      <div className="space-y-6">
        {/* Timer and Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-700" />
            <span className={`text-sm font-bold ${timeRemaining <= 3 ? "text-red-600" : "text-gray-700"}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="bg-white/60 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-800 mb-4">{currentQuestion.question}</h4>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full text-left p-3 rounded-lg bg-white/70 hover:bg-white border border-gray-200 hover:border-purple-300 transition-colors duration-300"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Component for Exam Results
  const ExamResults = () => {
    const { questions, userAnswers, score } = examState

    // Calculate correct answers count
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length

    // Calculate grade based on score
    const getGrade = (score: number) => {
      if (score >= 90) return "A"
      if (score >= 80) return "B"
      if (score >= 70) return "C"
      if (score >= 60) return "D"
      return "F"
    }

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy size={24} className="text-purple-600" />
            <h4 className="font-medium text-xl text-purple-900">Exam Completed</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-md text-purple-700">Your final score:</p>
              <div className="flex items-center">
                <span className="font-bold text-lg">{score.toFixed(0)}%</span>
                <span className="ml-2 px-2 py-1 bg-purple-200 text-purple-800 rounded-md font-bold">
                  Grade: {getGrade(score)}
                </span>
              </div>
            </div>
            <p className="text-md text-purple-700">
              Correct answers: <span className="font-bold">{correctAnswers}</span> out of{" "}
              <span className="font-bold">{questions.length}</span>
            </p>
            {score >= 80 ? (
              <div className="flex items-center mt-2 text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Excellent! You've mastered this level.</span>
              </div>
            ) : score >= 60 ? (
              <div className="flex items-center mt-2 text-yellow-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Good job! Keep practicing to improve.</span>
              </div>
            ) : (
              <div className="flex items-center mt-2 text-orange-600">
                <Book className="w-5 h-5 mr-2" />
                <span className="font-medium">You might need more practice with this material.</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary of answers */}
        <div className="bg-white/60 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Question Summary</h4>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <p className="font-medium text-gray-800 mb-2">
                  {index + 1}. {question.question}
                </p>

                {/* Show all options with indicators */}
                <div className="space-y-2 mt-3 pl-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded-md ${
                        option === question.correctAnswer && option === userAnswers[index]
                          ? "bg-green-100 border border-green-300"
                          : option === question.correctAnswer
                            ? "bg-green-50 border border-green-200"
                            : option === userAnswers[index]
                              ? "bg-red-100 border border-red-300"
                              : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span>{option}</span>
                        {option === question.correctAnswer && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-col space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Your answer:</span>
                    {userAnswers[index] ? (
                      <span
                        className={`text-sm font-medium ${
                          userAnswers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {userAnswers[index]}
                        {userAnswers[index] === question.correctAnswer ? " ✓" : " ✗"}
                      </span>
                    ) : (
                      <span className="text-sm text-orange-600 font-medium">No answer provided</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Correct answer:</span>
                    <span className="text-sm font-medium text-green-600">{question.correctAnswer}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Points:</span>
                    <span className="text-sm font-medium">
                      {userAnswers[index] === question.correctAnswer ? (
                        <span className="text-green-600">1/1</span>
                      ) : (
                        <span className="text-red-600">0/1</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall score summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">Score Breakdown</h5>
            <div className="flex justify-between items-center">
              <span>Total Questions:</span>
              <span className="font-medium">{questions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Correct Answers:</span>
              <span className="font-medium text-green-600">{correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Incorrect Answers:</span>
              <span className="font-medium text-red-600">{questions.length - correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="font-medium">Final Score:</span>
              <span className="font-bold text-lg">{score.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowAIExamModal(false)
              setGeneratedExam(null)
              setExamMarkdown("")
              setExamState((prev) => ({
                ...prev,
                examCompleted: false,
                examInProgress: false,
              }))
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
          >
            Close
          </button>
          <button
            onClick={startExam}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-shadow duration-300"
          >
            Retry Exam
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f8f4f1] via-[#e8e6f4] to-[#f8e6e6]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-thin tracking-wide text-gray-900">
              LangEdu
            </Link>
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div
                  onClick={handleToggleDropdown}
                  className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-1 cursor-pointer"
                >
                  <Trophy size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">100 LG</span>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-4">
                    <button
                      onClick={withdrawInititate}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:bg-red-600 transition duration-300"
                    >
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
             <WalletSelector/>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Daily Progress */}
        <div className="mb-12">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-800">Today's Progress</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500">45 mins studied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm text-gray-500">120 tokens earned</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        {/* AI Exam Generator Button */}
        <div className="mb-12">
          <div
            // onClick={() => setShowAIExamModal(true)}
            className="w-full bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:bg-white/50 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Book size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-800">AI Language Exam Generator</h2>
                <p className="text-sm text-gray-600">Generate custom language exams with AI</p>
              </div>
            </div>
            <button
                      onClick={() =>{
                        handleStartLesson(lessons[0])
                        // setShowAIExamModal(true)
                      }
                      } 
                      
                      className="px-4 py-2 ml-[500px] bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300"
                      
                    >
                     Start Assesment
                    </button>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Daily Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{lesson.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{lesson.level}</span>
                        <span>•</span>
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span>{lesson.tokens} tokens</span>
                      </div>
                    </div>
                    <button
                      onClick={() => (lesson.status === "Start" ? handleStartLesson(lesson) : null)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300"
                    >
                      {lesson.status}
                    </button>
                  </div>
                  {lesson.progress > 0 && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-1 rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Native Speakers and Rewards */}
          <div className="space-y-8">
            {/* Native Speakers */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">Native Speakers</h2>
              <div className="space-y-4">
                {nativeSpeakers.map((speaker, index) => (
                  <NativeSpeakerCard key={index} speaker={speaker} />
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">Rewards</h2>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <RewardCard key={index} reward={reward} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowConfirmation(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Start Lesson</h3>
            {selectedLesson && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">You are about to start:</p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">{selectedLesson.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{selectedLesson.level}</span>
                    <span>•</span>
                    <span>{selectedLesson.duration}</span>
                    <span>•</span>
                    <span>{selectedLesson.tokens} tokens</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Starting this lesson will use {selectedLesson?.tokens} tokens from your wallet.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-shadow duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Exam Modal */}
      {showAIExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAIExamModal(false)
                setGeneratedExam(null)
                setExamMarkdown("")
                setExamState((prev) => ({
                  ...prev,
                  examCompleted: false,
                  examInProgress: false,
                }))
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-medium text-gray-800 mb-6">AI Language Exam Generator</h3>

            {!generatedExam && !examState.examInProgress && !examState.examCompleted && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={examSettings.language}
                      onChange={(e) => setExamSettings({ ...examSettings, language: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white/80"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={examSettings.difficulty}
                      onChange={(e) => setExamSettings({ ...examSettings, difficulty: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white/80"
                    >
                      {difficultyOptions.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleExamGeneration}
                    disabled={isGeneratingExam}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300 flex items-center space-x-2"
                  >
                    {isGeneratingExam ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Settings size={16} />
                        <span>Generate Exam</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {generatedExam && !examState.examInProgress && !examState.examCompleted && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    {examSettings.language} {examSettings.difficulty} Exam
                  </h4>
                  <p className="text-sm text-purple-700">{examState.questions.length} questions generated</p>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={startExam}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-shadow duration-300"
                  >
                    Start Exam
                  </button>

                  <button
                    onClick={exportExam}
                    className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Export Exam
                  </button>

                  <button
                    onClick={() => {
                      setShowAIExamModal(false)
                      setGeneratedExam(null)
                      setExamMarkdown("")
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {examState.examInProgress && <QuestionDisplay />}

            {examState.examCompleted && <ExamResults />}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Languages</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Spanish
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    French
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Japanese
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-purple-600">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 LangEdu. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage



