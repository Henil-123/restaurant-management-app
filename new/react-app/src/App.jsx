import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FoodList from './pages/FoodList';
import AddFood from './pages/AddFood';
import EditFood from './pages/EditFood';
import BillPage from './pages/BillPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 container mt-4">
        <Routes>
          <Route path="/manager" element={<FoodList />} />
          <Route path="/manager/add" element={<AddFood />} />
          <Route path="/manager/edit/:id" element={<EditFood />} />
          <Route path="/manager/bill" element={<BillPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
