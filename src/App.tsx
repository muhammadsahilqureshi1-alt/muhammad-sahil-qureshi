import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { AuthModal } from './components/AuthModal.js';

import { LandingPage } from './pages/LandingPage.js';
import { PracticePage } from './pages/PracticePage.js';
import { MockTestsPage } from './pages/MockTestsPage.js';
import { MockExamRunnerPage } from './pages/MockExamRunnerPage.js';
import { ResultCardPage } from './pages/ResultCardPage.js';
import { EssayLabPage } from './pages/EssayLabPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { MistakesNotebookPage } from './pages/MistakesNotebookPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { PricingPage } from './pages/PricingPage.js';
import { AdminPage } from './pages/AdminPage.js';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setCurrentPage('mock-runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishTest = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewResult = (attemptId: string) => {
    setActiveAttemptId(attemptId);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isExamRunnerActive = currentPage === 'mock-runner' && activeTestId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Hide standard navbar when exam is in progress for strict test focus */}
      {!isExamRunnerActive && (
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />
      )}

      {/* Main Page Render */}
      <main className="grow">
        {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}

        {currentPage === 'practice' && <PracticePage />}

        {currentPage === 'mock-tests' && (
          <MockTestsPage onStartTest={handleStartTest} onNavigate={navigateTo} />
        )}

        {isExamRunnerActive && (
          <MockExamRunnerPage
            testId={activeTestId!}
            onFinishTest={handleFinishTest}
            onCancelTest={() => navigateTo('mock-tests')}
          />
        )}

        {currentPage === 'result' && activeAttemptId && (
          <ResultCardPage
            attemptId={activeAttemptId}
            onRetake={() => {
              if (activeTestId) {
                handleStartTest(activeTestId);
              } else {
                navigateTo('mock-tests');
              }
            }}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'essay-lab' && <EssayLabPage />}

        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={navigateTo} onViewResult={handleViewResult} />
        )}

        {currentPage === 'mistakes' && <MistakesNotebookPage />}

        {currentPage === 'leaderboard' && <LeaderboardPage />}

        {currentPage === 'pricing' && <PricingPage />}

        {currentPage === 'admin' && <AdminPage />}
      </main>

      {/* Hide footer during exam runner */}
      {!isExamRunnerActive && <Footer onNavigate={navigateTo} />}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeLanguageProvider>
        <MainApp />
      </ThemeLanguageProvider>
    </AuthProvider>
  );
}
