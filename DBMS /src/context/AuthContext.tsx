import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'participant' | 'team_manager';
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/auth/login', { email, password });
      
      // Mock login for demo purposes
      const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
        { id: 2, name: 'Organizer', email: 'organizer@example.com', password: 'password', role: 'organizer' },
        { id: 3, name: 'Participant', email: 'participant@example.com', password: 'password', role: 'participant' },
        { id: 4, name: 'Team Manager', email: 'manager@example.com', password: 'password', role: 'team_manager' },
      ];

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // In a real app, we would call the API
      // const response = await api.post('/auth/register', userData);
      
      // Mock registration for demo purposes
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 5,
        name: userData.name,
        email: userData.email,
        role: 'participant',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};