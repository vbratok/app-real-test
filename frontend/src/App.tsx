import {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import './App.css';
import Index from './components/Index';
import { User } from './dto/user.dto';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

export const AuthContext = createContext<{
  user: User | null;
  login: (response?: User, token?: string) => void;
}>({
  user: null,
  login: () => {},
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setLoaded] = useState(false);
  const isLoading = useRef(false);

  const login = useCallback((user?: User, token?: string) => {
    if (user) {
      setUser(user);
      if (token) {
        localStorage.setItem('token', token);
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      login,
    }),
    [user, login],
  );

  useEffect(() => {
    if (isLoaded || isLoading.current) return;
    isLoading.current = true;

    axios
      .post<User>(
        'http://localhost:3001/auth',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      .then((data) => {
        setUser(data.data);
        setLoaded(true);
      })
      .catch((error) => {
        const data = error?.response?.data;
        if (data.statusCode === 401 || data.statusCode === 400) {
          //400 ?? TODO: check it
          localStorage.removeItem('token');
          setLoaded(true);
        }
        console.error(error.message);
      });
  }, [isLoaded]);

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoaded ? <Index /> : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}

export default App;
