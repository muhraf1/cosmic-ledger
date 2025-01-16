import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BaseLayer from './components/UI/base'
import Deck from './components/UI/deck'
import './App.css'

function App() {


  return (
<Router>
    <BaseLayer>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Deck></Deck>
            </>
          }
        />
      </Routes>
    </BaseLayer>
    </Router> 

  )
}

export default App
