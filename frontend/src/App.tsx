import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Cards from './pages/Cards';
import CardDetail from './pages/CardDetail';
import Sets from './pages/Sets';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import SetCards from './pages/SetCards';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:username" element={<UserProfile />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/sets/:id" element={<SetCards />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/:id" element={<CardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
