import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Projects from './components/Projects';
import Specs from './components/Specs';
import Terminal from './components/Terminal';
import Footer from './components/Footer';

function App() {
  return (
    <Layout>
      <Navbar />
      <Hero />
      <Marquee />
      <Projects />
      <Specs />
      <Terminal />
      <Footer />
    </Layout>
  );
}

export default App;
