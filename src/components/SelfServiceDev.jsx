import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WizardSection from './WizardSection'

const subtabs = [
  { key: 'wizard', label: 'Wizard' },
  { key: 'more', label: 'More Coming' },
]

export default function SelfServiceDev() {
  const [activeSubtab, setActiveSubtab] = useState('wizard')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {subtabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSubtab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSubtab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubtab === 'wizard' && (
          <motion.div key="wizard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <WizardSection />
            </div>
          </motion.div>
        )}
        {activeSubtab === 'more' && (
          <motion.div key="more" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-12 shadow-sm text-center">
              <p className="text-lg text-gray-400 font-medium">Stay tuned for future AI development.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
