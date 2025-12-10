'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0)

    const slides = [
        {
            title: "Welcome to Basaegochi",
            desc: "Raise your own digital pet on the Base blockchain! Feed, play, and train them to evolve into powerful creatures.",
            image: "/icon.png"
        },
        {
            title: "Play Anywhere",
            desc: "Start as a Guest with no wallet! Your pet lives on your device. Connect a wallet later to battle and earn.",
            image: "/sprites/pets/base-bull.png"
        },
        {
            title: "Battle & Earn",
            desc: "Challenge other players in the Arena. Win battles to level up and earn glory on the leaderboard.",
            image: "/sprites/ui/elements.png"
        }
    ]

    const nextStep = () => {
        if (step < slides.length - 1) {
            setStep(step + 1)
        } else {
            onComplete()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white text-black p-6 rounded-2xl max-w-sm w-full text-center border-4 border-base-blue shadow-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-32 h-32 mb-6 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                            <img src={slides[step].image} alt="Slide" className="w-24 h-24 object-contain pixelated" />
                        </div>
                        <h2 className="text-xl font-bold mb-4 font-pixel text-base-blue">{slides[step].title}</h2>
                        <p className="text-sm text-gray-600 mb-8 leading-relaxed h-20">{slides[step].desc}</p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1">
                        {slides.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-base-blue' : 'bg-gray-300'}`} />
                        ))}
                    </div>
                    <button
                        onClick={nextStep}
                        className="bg-base-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        {step === slides.length - 1 ? 'Start Playing' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    )
}
