import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { ParoquiaProvider } from './contexts/ParoquiaContext';
import { Toaster } from './components/ui/toaster';
import { 
  Home,
  Dizimo,
  CheckoutDizimo,
  CadastroDizimista,
  Oferta,
  CheckoutOferta,
  Campanha,
  HorarioMissa,
  Agradecimento,
  NotFound
} from './pages';

function App() {
  return (
    <Router>
      <EnvironmentProvider>
        <ParoquiaProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dizimo" element={<Dizimo />} />
              <Route path="/oferta" element={<Oferta />} />
              <Route path="/agradecimento" element={<Agradecimento />} />
              <Route path="/cadastro-dizimista" element={<CadastroDizimista />} />
              <Route path="/campanha" element={<Campanha />} />
              <Route path="/campanha/:id" element={<Campanha />} />
              <Route path="/campanhas" element={<Campanha />} />
              <Route path="/horario-missa" element={<HorarioMissa />} />
              <Route path="/checkout-oferta" element={<CheckoutOferta />} />
              <Route path="/checkout-dizimo" element={<CheckoutDizimo />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </ParoquiaProvider>
      </EnvironmentProvider>
    </Router>
  );
}

export default App;
