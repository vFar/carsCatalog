import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="catalog" element={<Catalog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
