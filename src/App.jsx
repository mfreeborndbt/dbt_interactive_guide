import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Architecture & Environments components
import DbtEcosystem from './components/DbtEcosystem'
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

const archTabs = [
  { key: 'ecosystem', label: 'dbt in Data Ecosystem' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'environments', label: 'Environments' },
]

const archTabDescs = {
  ecosystem: 'Where dbt sits in the modern data stack, from ingestion to analytics.',
  architecture: 'How Git, dbt, and your data platform work together.',
  environments: 'How environments define where code runs and where data lands.',
}

const envInnerTabs = [
  { key: 'define', label: 'What They Define' },
  { key: 'interact', label: 'How They Interact' },
]

const envInnerDescs = {
  define: 'Every environment specifies the same four groups of settings, then you create multiple for specific purposes.',
  interact: 'Data flows from raw sources through layers of transformation, scoped by environment.',
}

function ArchitecturePage() {
  const [activeArch, setActiveArch] = useState('ecosystem')
  const [activeEnvInner, setActiveEnvInner] = useState('define')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Architecture &amp; Environments</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {archTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveArch(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeArch === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeArch} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{archTabDescs[activeArch]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeArch === 'ecosystem' && (
          <motion.div key="ecosystem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <DbtEcosystem />
          </motion.div>
        )}
        {activeArch === 'architecture' && (
          <motion.div key="architecture" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <InteractiveArchitecture />
          </motion.div>
        )}
        {activeArch === 'environments' && (
          <motion.div key="environments" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-4">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                {envInnerTabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveEnvInner(t.key)}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeEnvInner === t.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 text-center">
              <AnimatePresence mode="wait">
                <motion.p key={activeEnvInner} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-gray-500">
                  {envInnerDescs[activeEnvInner]}
                </motion.p>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {activeEnvInner === 'define' && (
                <motion.div key="define" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                    <EnvironmentsSection />
                  </div>
                </motion.div>
              )}
              {activeEnvInner === 'interact' && (
                <motion.div key="interact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                    <ProjectArchitectureVisual />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const devTabs = [
  { key: 'flow', label: 'Development Flow Architecture' },
  { key: 'process', label: 'Development Process Walkthrough' },
]

const devTabDescs = {
  flow: 'The typical flow from feature branch to production.',
  process: 'Follow the end-to-end workflow across development, QA, and production phases.',
}

function DevelopmentPage() {
  const [activeDev, setActiveDev] = useState('flow')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Development Workflow</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {devTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveDev(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeDev === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activeDev} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{devTabDescs[activeDev]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activeDev === 'flow' && (
          <motion.div key="flow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <TypicalWorkflow />
            </div>
          </motion.div>
        )}
        {activeDev === 'process' && (
          <motion.div key="process" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <DevelopmentWorkflow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const orchPhases = [
  { key: 'deps', label: 'Phase 1: Dependency Management' },
  { key: 'testing', label: 'Phase 2: Testing Automation' },
  { key: 'state', label: 'Phase 3: dbt State' },
]

const orchPhaseDescs = {
  deps: 'How dbt automatically determines the correct build order from model references.',
  testing: 'Automated data quality checks that run as part of every build.',
  state: 'dbt can detect which sources have new data and only rebuild what is necessary.',
}

function OrchestrationPage() {
  const [activePhase, setActivePhase] = useState('deps')
  const [phase1View, setPhase1View] = useState('problem')
  const [phase2View, setPhase2View] = useState('concept')

  return (
    <div className="section-container py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orchestration</h2>
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mt-4">
          {orchPhases.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePhase(p.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePhase === p.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={activePhase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
            <p className="text-sm text-gray-500">{orchPhaseDescs[activePhase]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {activePhase === 'deps' && (
          <motion.div key="deps" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-5">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
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
          </motion.div>
        )}

        {activePhase === 'testing' && (
          <motion.div key="testing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-5">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
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
          </motion.div>
        )}

        {activePhase === 'state' && (
          <motion.div key="state" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
              <StateAwareOrchestration />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
