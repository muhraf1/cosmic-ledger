import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayer from './components/UI/base'
import Deck from './components/UI/deck'
import WalletProvider from './components/UI/WalletContext';
import './App.css'

function App() {

  return (
    <Router>
      <WalletProvider>
        <BaseLayer>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
      
                </>
              }
            />
          </Routes>
        </BaseLayer>
      </WalletProvider>
    </Router>


  )
}

export default App
