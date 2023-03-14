import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import Header from './Navbar/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import AllTodoes from './Todo/AllTodoes';

const Index: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Header />
      <BrowserRouter>
        {user ? (
          <Routes>
            <Route path="/" element={<AllTodoes />}></Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
};

export default Index;
