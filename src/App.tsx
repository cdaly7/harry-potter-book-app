import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/book-list/BookList';
import BookDetails from './components/book-details/BookDetails';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/book/works/:workKey" element={<BookDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
