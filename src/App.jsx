 import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Projects from './components/Projects';
import Specs from './components/Specs';
import Terminal from './components/Terminal';
import Footer from './components/Footer';
import SecretGate from './components/SecretGate';
import ContestCalendar from './pages/ContestCalendar';
import CommandCenter from './pages/CommandCenter';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { FEATURE_FLAGS } from './utils/featureFlags';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Projects />
      <Specs />
      <Terminal />
      <Footer />
    </>
  );
}

function App() {
  return (
    <SubscriptionProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contest_calendar" element={
            <SecretGate>
              <ContestCalendar />
            </SecretGate>
          } />
          <Route path="/contest_calendar/command" element={
            <SecretGate>
              <CommandCenter />
            </SecretGate>
          } />
        </Routes>
      </Layout>
    </SubscriptionProvider>
  );
}

export default App;
