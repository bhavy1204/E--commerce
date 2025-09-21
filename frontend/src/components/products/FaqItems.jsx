import { useState } from 'react';

export const FaqItems = ({question, answer}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='flex flex-col'>
            <div className="faq-container ">
                <div className="question flex justify-between px-10 bg-purple-300 rounded-sm py-2 font-semibold" onClick={handleClick}>
                    <span>{question}</span>
                    <span className="faq-toggle-button">{isOpen ? 'x' : '+'}</span>
                </div>
            </div>
            {isOpen && <div className="bg-purple-200 px-10 py-2">{answer}</div>}
        </div>
    )
}


