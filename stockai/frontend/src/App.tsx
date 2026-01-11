import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard, HomePage, ChatPage, ScreenerPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/screener" element={<ScreenerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
