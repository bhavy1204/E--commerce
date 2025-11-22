import { useEffect, useState } from 'react'
import { FaqItems } from './FaqItems'
import { apiClient } from '../../utils/api'

export const FaqList = () => {
    const [faqs, setFaqs] = useState([])

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await apiClient.getSiteContent()
                if (response.success) {
                    setFaqs(response.data.faqs || [])
                }
            } catch (error) {
                console.error('Failed to load FAQs', error)
            }
        }
        fetchFaqs()
    }, [])

    if (!faqs.length) {
        return <p className="text-sm text-gray-500">No FAQs available yet.</p>
    }

    return (
        <div className="container flex flex-col gap-3">
            {faqs.map((faq, idx) => (
                <FaqItems key={`${faq.question}-${idx}`} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    )
}
