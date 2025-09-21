import { FaqItems } from './FaqItems'

export const FaqList = () => {
    const FaqData = [
        { question: "Question 1 ?", answer: "Answer 1" },
        { question: "Question 2 ?", answer: "Answer 1" },
        { question: "Question 3 ?", answer: "Answer 1" },
        { question: "Question 4 ?", answer: "Answer 1" },
        { question: "Question 5 ?", answer: "Answer 1" },
        { question: "Question 6 ?", answer: "Answer 1" },
    ]

    return (
        <div className="container flex flex-col gap-3">
            {/* <div className="heading">
                <h1>Frequently asked Questions</h1>
            </div> */}
            {FaqData.map((faq, idx) => (
                <FaqItems key={idx} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    )
}
