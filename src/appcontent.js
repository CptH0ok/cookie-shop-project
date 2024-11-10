import Admin from './pages/admin';
import Login from './pages/login';
import Signup from './pages/signup';
import ErrorPage from './pages/error';
import Reviews from './pages/reviews';
import HomePage from './pages/homepage';
import ShopPage from './pages/shoppage';
import AboutUsPage from './pages/aboutus';
import ContactUsPage from './pages/contactus';
import CartPage from './pages/cartpage';
import CheckoutPage from './pages/checkoutpage';
import Branches from './pages/branches';
import Footer from './components/footer';
import Navbar from './components/navbar';
import GlutenFreePage from './pages/glutenfreepage';
import ProtectedRoute from './components/protectedroute';
import CookieDetailPage from './components/cookiedetailpage';
import { Routes, Route, useLocation } from 'react-router-dom';



function AppContent() {
  const location = useLocation();

  const pathsWithLayout = [
    "/",
    "/shop", "/branches", "/reviews", "/admin", "/glutenfree", "/cart", "/checkout",
    "/aboutus", "/contactus"
  ];

  const showLayout = pathsWithLayout.includes(location.pathname);

  return (
    <>
      {showLayout && (
        <div className='w-full sticky top-0 z-20'>
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/glutenfree" element={<GlutenFreePage />} />
        <Route path="/cookie/:name" element={<CookieDetailPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        <Route path="/reviews" element={<ProtectedRoute element={<Reviews />} />} />
      </Routes>
      {showLayout && <Footer />}
    </>
  );
}

export default AppContent;
