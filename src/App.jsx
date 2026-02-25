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
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contest_calendar" element={
          <SecretGate>
            <ContestCalendar />
          </SecretGate>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
