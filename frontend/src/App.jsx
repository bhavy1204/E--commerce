import './App.css'
import { Route, Routes } from 'react-router-dom'
import PageNotFound from './components/utils/PageNotFOund'
import Home from './components/home/Home'
import About from './components/about/About'
import Navbar from './components/utils/Navbar'
import { Footer } from './components/utils/Footer'
import { BrowserRouter as Router } from 'react-router-dom'
import { Productpage } from './components/products/Productpage'
import { Signup } from './components/user/Signup'
import Login from './components/user/Login'
import Contact from './components/contact/Contact'
import { Products } from './components/products/Products'
import { Cart } from './components/user/Cart'
import { Checkout } from './components/user/Checkout'
import { Orders } from './components/user/Orders'
import OrderDetail from './components/user/OrderDetail'
import { AdminPanel } from './components/admin/AdminPanel'

function App() {

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path='*' element={<PageNotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Productpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
