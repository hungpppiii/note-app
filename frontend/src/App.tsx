import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { useEffect, useState } from 'react';
import SignUpModal from './components/SignUpModal';
import { User } from './models/users';
import SignInModal from './components/SignInModal';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotesPageLoggedInView from './components/NotesPageLoggedInView';
import * as authApi from './network/auth_api';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './styles/App.module.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NotesPageLoggedInView />,
  },
]);

function App() {
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchAuthenticateUser = async () => {
      try {
        const user = await authApi.getAuthenticatedUser();
        setLoggedInUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuthenticateUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onSignInClicked={() => setShowSignInModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessfully={(user: User) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
        )}
        {showSignInModal && (
          <SignInModal
            onDismiss={() => setShowSignInModal(false)}
            onSignInSuccessfully={(user: User) => {
              setLoggedInUser(user);
              setShowSignInModal(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
