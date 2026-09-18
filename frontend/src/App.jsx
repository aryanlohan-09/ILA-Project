import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import SyllabusPage from './pages/SyllabusPage';
import PriorityPage from './pages/PriorityPage';
import StudyPlanPage from './pages/StudyPlanPage';
import QuizPage from './pages/QuizPage';
import RevisionPage from './pages/RevisionPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ flex: 1, minWidth: 0, padding: '48px 56px' }}>
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'syllabus' && <SyllabusPage />}
        {activeTab === 'priority' && <PriorityPage />}
        {activeTab === 'studyplan' && <StudyPlanPage />}
        {activeTab === 'quiz' && <QuizPage />}
        {activeTab === 'revision' && <RevisionPage />}
      </main>
    </div>
  );
}

export default App;