import './App.css'
import { Route, Routes } from 'react-router-dom'
import PageNotFound from './components/utils/PageNotFOund'
import Home from './components/home/Home'
import About from './components/about/About'
import Navbar from './components/utils/Navbar'
import { Footer } from './components/utils/footer'
import { BrowserRouter as Router } from 'react-router-dom'
import { Productpage } from './components/products/Productpage'
import { Signup } from './components/user/Signup'
import Login from './components/user/Login'
import Contact from './components/contact/Contact'
import { OrderForm } from './components/user/OrderForm'

function App() {

  return (
    <Router>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path='*' element={<PageNotFound />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<Productpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order/form" element={< OrderForm/>} />
            <Route path="https://merchant.razorpay.com/policy/RIXtLRgSKLM6aX/shipping" element={< OrderForm/>} />
            <Route path="https://merchant.razorpay.com/policy/RIXtLRgSKLM6aX/terms" element={< OrderForm/>} />
            <Route path="https://merchant.razorpay.com/policy/RIXtLRgSKLM6aX/refund" element={< OrderForm/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
