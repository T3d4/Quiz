const QUIZ_STATE = {
    LOADING: "loading",
    ANSWERING: "answering",
    COMPLETED: "completed",
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentIndex = 0;
        this.score = 0;
        this.quizState = QUIZ_STATE.LOADING;
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    checkAnswer(selectedOption) {
        const currentQuestion = this.getCurrentQuestion();
        if (currentQuestion.correct === selectedOption) {
            this.score++;
            return true;
        }
        return false;
    }

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            return true;
        }
        return false;
    }
}

const questions = [
    {
        question: "What is the capital city of Nigeria?",
        options: ["Lagos", "Abuja", "Kano", "Ibadan"],
        correct: 1,
    },
    {
        question: "Who is the Nigerian Nobel laureate in Literature?",
        options: ["Chinua Achebe", "Wole Soyinka", "Chimamanda Ngozi Adichie", "Ben Okri"],
        correct: 1,
    },
    {
        question: "What is the largest ethnic group in Nigeria?",
        options: ["Yoruba", "Igbo", "Hausa", "Fulani"],
        correct: 2,
    },
    {
        question: "Who is the current President of Nigeria?",
        options: ["Bola Tinubu", "Goodluck Jonathan", "Olusegun Obasanjo", "Ngozi Okonjo-Iweala"],
        correct: 0,
    },
    {
        question: "What is the official language of Nigeria?",
        options: ["English", "Yoruba", "Igbo", "Hausa"],
        correct: 0,
    },
    {
        question: "Which Nigerian musician is known as the 'African Giant'?",
        options: ["Wizkid", "Davido", "Burna Boy", "Tiwa Savage"],
        correct: 2,
    },
    {
        question: "In Nigerian culture, what occasions are Jollof rice often served at?",
        options: ["Weddings and celebrations", "Funerals", "Religious ceremonies", "Daily meals"],
        correct: 0,
    }, {
        question: "What is Jollof rice?",
        options: ["A traditional Nigerian rice dish", "A type of dessert", "A famous Nigerian river", "A popular Nigerian song"],
        correct: 0,
    },
    {
        question: "Which Nigerian ethnic group is known for its special recipe of Jollof rice?",
        options: ["Yoruba", "Igbo", "Hausa", "Tiv"],
        correct: 0,
    },
    {
        question: "Which Nigerian city is famous for its ancient walls and gates?",
        options: ["Kano", "Lagos", "Ife", "Benin City"],
        correct: 0,
    },
];

shuffleArray(questions);

const quiz = new Quiz(questions);

const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const optionsList = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const resultText = document.getElementById("result");

function loadQuestion() {
    try {
        const currentQuestion = quiz.getCurrentQuestion();
        if (!currentQuestion || !currentQuestion.options || currentQuestion.options.length < 4) {
            throw "Invalid question data.";
        }

        questionText.textContent = currentQuestion.question;
        optionsList.innerHTML = "";

        currentQuestion.options.forEach((option, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = option;
            listItem.addEventListener("click", () => handleOptionClick(index));
            optionsList.appendChild(listItem);
        });

        quiz.quizState = QUIZ_STATE.ANSWERING;
    } catch (error) {
        console.error("Error:", error);
        questionText.textContent = "Error loading question";
        optionsList.innerHTML = "";
        nextButton.style.display = "none";
    }
}

function handleOptionClick(selectedIndex) {
    try {
        switch (quiz.quizState) {
            case QUIZ_STATE.ANSWERING:
                if (quiz.checkAnswer(selectedIndex)) {
                    resultText.textContent = "Correct!";
                } else {
                    resultText.textContent = "Wrong!";
                }

                if (quiz.nextQuestion()) {
                    loadQuestion();
                } else {
                    quiz.quizState = QUIZ_STATE.COMPLETED;
                    questionContainer.style.display = "none";
                    nextButton.style.display = "block"; // Display the next button
                    nextButton.textContent = "Restart Quiz"; // Change the button text
                    resultText.textContent = `Quiz Completed! Your Score: ${quiz.score}/${questions.length}`;
                }

                break;

            default:
                console.log("Quiz is not in the answering state.");
        }
    } catch (error) {
        console.error("Error:", error);
        resultText.textContent = "An error occurred during the quiz.";
        questionContainer.style.display = "none";
        nextButton.style.display = "none";
    }
}

function resetQuiz() {
    shuffleArray(questions);

    quiz.currentIndex = 0;
    quiz.score = 0;
    quiz.quizState = QUIZ_STATE.LOADING;

    loadQuestion();
    resultText.textContent = "";
    questionContainer.style.display = "block";
    nextButton.style.display = "block";
    nextButton.textContent = "Next";
}

nextButton.addEventListener("click", () => {
    if (quiz.quizState === QUIZ_STATE.COMPLETED) {
        resetQuiz();
    }
});

loadQuestion();
