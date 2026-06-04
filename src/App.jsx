import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Architecture & Environments components
import InteractiveArchitecture from './components/InteractiveArchitecture'
import EnvironmentsSection from './components/EnvironmentsSection'
import ProjectArchitectureVisual from './components/ProjectArchitectureVisual'

// Development Workflow components
import TypicalWorkflow from './components/TypicalWorkflow'
import DevelopmentWorkflow from './components/DevelopmentWorkflow'

// Models components
import DbtModels from './components/DbtModels'

// Data Modeling components
import DataModeling from './components/DataModeling'

// Orchestration components
import PreDbtOrchestration from './components/PreDbtOrchestration'
import HowDbtWorks from './components/HowDbtWorks'
import DbtRunAnimation from './components/DbtRunAnimation'
import TestingExplanation from './components/TestingExplanation'
import SettingUpTests from './components/SettingUpTests'
import DbtBuildSimulator from './components/DbtBuildSimulator'
import StateAwareOrchestration from './components/StateAwareOrchestration'

// Mesh components
import DbtMesh from './components/DbtMesh'

// Semantic Layer components
import SemanticLayer from './components/SemanticLayer'

const topTabs = [
  { key: 'architecture', label: 'Architecture & Environments' },
  { key: 'models', label: 'dbt Models' },
  { key: 'modeling', label: 'Data Modeling' },
  { key: 'development', label: 'Development Workflow' },
  { key: 'orchestration', label: 'Orchestration' },
  { key: 'mesh', label: 'Mesh' },
  { key: 'semantic', label: 'Semantic Layer' },
]

// Orchestration sub-config
const phase1Tabs = [
  { key: 'problem', label: 'Manual Orchestration' },
  { key: 'how', label: 'How dbt Works' },
  { key: 'solution', label: 'How dbt Helps' },
]

const phase1Descs = {
  problem: 'Without dbt, you have to manually declare the order every model runs in.',
  how: <>
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">ref()</code> replaces hardcoded table names and tells dbt about dependencies between models.
  </>,
  solution: <>dbt reads <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">ref()</code> functions and automatically determines the correct build order.</>,
}

const phase2Tabs = [
  { key: 'concept', label: 'How Testing Works' },
  { key: 'setup', label: 'Setting Up Tests' },
  { key: 'simulator', label: 'See It In Action' },
]

const phase2Descs = {
  concept: 'dbt tests your data at every layer so bad data never reaches downstream models.',
  setup: 'Start with simple assertions, then layer on severity, thresholds, and stored failures.',
  simulator: <>Watch <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">dbt build</code> run each model, test it, then proceed. If a test fails, downstream models are skipped.</>,
}

function ArchitecturePage() {
  return (
    <>
      {/* Architecture */}
      <InteractiveArchitecture />

      {/* Environments & dbt Code */}
      <div className="section-container py-4">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Context: Environments &amp; dbt Code</h2>
          <p className="text-sm text-gray-500 mt-1">How environments define where code runs and where data lands.</p>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
            <EnvironmentsSection />
          </div>
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
            <ProjectArchitectureVisual />
          </div>
        </div>
      </div>
    </>
  )
}

function DevelopmentPage() {
  return (
    <>
      {/* Common Development Workflow */}
      <div className="section-container py-4">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Common Development Workflow</h2>
          <p className="text-sm text-gray-500 mt-1">The typical flow from feature branch to production.</p>
        </div>
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
          <TypicalWorkflow />
        </div>
      </div>

      {/* Development Process */}
      <div className="section-container py-4 pb-16">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Development Process</h2>
          <p className="text-sm text-gray-500 mt-1">Follow the end-to-end workflow across development, QA, and production phases.</p>
        </div>
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
          <DevelopmentWorkflow />
        </div>
      </div>
    </>
  )
}

function OrchestrationPage() {
  const [phase1View, setPhase1View] = useState('problem')
  const [phase2View, setPhase2View] = useState('concept')

  return (
    <>
      {/* Phase 1: Dependency Management */}
      <div className="section-container py-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">Phase 1</span>
            <h2 className="text-2xl font-bold text-gray-900">Dependency Management</h2>
          </div>
          <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
            {phase1Tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setPhase1View(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  phase1View === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={phase1View} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              <p className="text-sm text-gray-500">{phase1Descs[phase1View]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {phase1View === 'problem' && (
              <motion.div key="problem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <PreDbtOrchestration />
              </motion.div>
            )}
            {phase1View === 'how' && (
              <motion.div key="how" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <HowDbtWorks />
              </motion.div>
            )}
            {phase1View === 'solution' && (
              <motion.div key="solution" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <DbtRunAnimation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Phase 2: Automated Testing */}
      <div className="section-container py-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full">Phase 2</span>
            <h2 className="text-2xl font-bold text-gray-900">Automated Testing</h2>
          </div>
          <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
            {phase2Tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setPhase2View(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  phase2View === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={phase2View} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              <p className="text-sm text-gray-500">{phase2Descs[phase2View]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {phase2View === 'concept' && (
              <motion.div key="test-concept" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <TestingExplanation />
              </motion.div>
            )}
            {phase2View === 'setup' && (
              <motion.div key="test-setup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <SettingUpTests />
              </motion.div>
            )}
            {phase2View === 'simulator' && (
              <motion.div key="test-sim" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <DbtBuildSimulator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Phase 3: dbt State */}
      <div className="section-container py-4 pb-16">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-base font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">Phase 3</span>
            <h2 className="text-2xl font-bold text-gray-900">dbt State</h2>
          </div>
          <p className="text-sm text-gray-500 mt-2">dbt can detect which sources have new data and only rebuild what's necessary.</p>
        </div>
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
          <StateAwareOrchestration />
        </div>
      </div>
    </>
  )
}

const tabDescriptions = {
  architecture: 'How dbt connects Git, transformation logic, and your data platform.',
  models: 'What dbt models offer and why they change how you build data pipelines.',
  modeling: 'The four layers of a well-structured dbt project: sources, staging, intermediate, and marts.',
  development: 'The end-to-end workflow from feature branch to production deployment.',
  orchestration: 'How dbt orchestration makes data pipelines simpler, faster, and cheaper.',
  mesh: 'Scale from one project to many with governed model sharing, scoped lineage, and safe versioning.',
  semantic: 'A governed metrics layer that turns questions into correct SQL for LLMs, apps, and BI.',
}

export default function App() {
  const [activeTab, setActiveTab] = useState('architecture')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-emerald-950 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08)_0%,_transparent_60%)]" />
        <div className="section-container py-10 md:py-14 text-center">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              The dbt Interactive Guide
            </h1>

            {/* Top-level navigation tabs */}
            <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-4">
              {topTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed"
              >
                {tabDescriptions[activeTab]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        {activeTab === 'architecture' && (
          <motion.div key="arch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ArchitecturePage />
          </motion.div>
        )}
        {activeTab === 'models' && (
          <motion.div key="models" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <DbtModels />
          </motion.div>
        )}
        {activeTab === 'modeling' && (
          <motion.div key="modeling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <DataModeling />
          </motion.div>
        )}
        {activeTab === 'development' && (
          <motion.div key="dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <DevelopmentPage />
          </motion.div>
        )}
        {activeTab === 'orchestration' && (
          <motion.div key="orch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <OrchestrationPage />
          </motion.div>
        )}
        {activeTab === 'mesh' && (
          <motion.div key="mesh" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <DbtMesh />
          </motion.div>
        )}
        {activeTab === 'semantic' && (
          <motion.div key="semantic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SemanticLayer />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
