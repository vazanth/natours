import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import Header from './pages/home/Header';
import Footer from './pages/home/Footer';
import Tours from './pages/tour/Tours';
import AuthForm from './pages/auth/AuthForm';
import TourDetail from './pages/tourdetail/TourDetail';
import Account from './pages/account/Account';
import { UserProvider } from './context/UserContext';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Header />
            <Switch>
              <Route path="/login" component={AuthForm} />
              <Route path="/signup" component={AuthForm} />
              <Route path="/verify" component={AuthForm} />
              <Route path="/tour" component={Tours} />
              <Route path="/account" component={Account} />
              <Route path="/tour-detail/:tourname" component={TourDetail} />
              <Redirect from="/" to="/tour" />
            </Switch>
            <Footer />
          </UserProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
