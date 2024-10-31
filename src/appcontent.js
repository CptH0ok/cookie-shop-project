import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import HomePage from './pages/homepage';
import Login from './pages/login';
import Signup from './pages/signup';
import LoginSuccess from './components/loginsuccess';
import ProtectedRoute from './components/protectedroute';
import ShopPage from './pages/shoppage';
import Branches from './pages/branches';
import Reviews from './pages/reviews';
import Admin from './pages/admin';
import ErrorPage from './pages/error';
import AboutUsPage from './pages/aboutus';
import ContactUsPage from './pages/contactus';

function AppContent() {
  const location = useLocation();

  const pathsWithLayout = [
    "/", "/login/success",
    "/shop", "/branches", "/reviews", "/admin", "/aboutus", "/contactus"
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/reviews" element={<ProtectedRoute element={<Reviews />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {showLayout && <Footer />}
    </>
  );
}

export default AppContent;
