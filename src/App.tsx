import React, {MouseEvent, useState} from 'react';
import {Difficulty, fetchQuizQuestions, QuestionState} from "./API";
import QuestionCard from "./components/QuestionCard";
import {GlobalStyle, Wrapper} from "./App.styles";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
}

const App = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [quizOver, setQuizOver] = useState(true);


    const startQuiz = async () => {
        setLoading(true);
        setQuizOver(false);

        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASE
        );

        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);
    }

    const checkAnswer = (e: MouseEvent<HTMLButtonElement>) => {
        if (!quizOver) {
            // Users answers
            const answer = e.currentTarget.value;
            // Check answer against correct answer
            const correct = questions[number].correct_answer === answer;
            // Add score if answer is correct
            if (correct) setScore(prev => prev + 1)
            // Save answer in the array for user answers
            const answerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer
            };
            setUserAnswers(prev => [...prev, answerObject]);
        }
    }

    const nextQuestion = () => {
        // Move on to the next question if not the last question
        const nextQuestion = number + 1;

        if (nextQuestion === TOTAL_QUESTIONS) {
            setQuizOver(true);
        } else {
            setNumber(nextQuestion);
        }
    }

    return (
        <>
            <GlobalStyle/>
            <Wrapper>
                <h1>QUIZ APPLICATION</h1>
                {quizOver || userAnswers.length === TOTAL_QUESTIONS ? (
                    <button
                        className={'start'}
                        onClick={startQuiz}>
                        Start
                    </button>
                ) : null}
                {!quizOver && <p className={'score'}>Score: {score}</p>}
                {loading && <p>Loading Questions ...</p>}
                {(!loading && !quizOver) && (
                    <QuestionCard
                        questionNumber={number + 1}
                        totalQuestions={TOTAL_QUESTIONS}
                        question={questions[number].question}
                        answers={questions[number].answers}
                        userAnswer={userAnswers ? userAnswers[number] : undefined}
                        callback={checkAnswer}
                    />
                )}
                {!quizOver &&
                !loading &&
                userAnswers.length === number + 1 &&
                number !== TOTAL_QUESTIONS - 1 ? (
                    <button className={'next'} onClick={nextQuestion}>
                        Next Question
                    </button>
                ) : null}

            </Wrapper>
        </>
    );
}

export default App;
