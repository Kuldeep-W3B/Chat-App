import React from 'react';
import Routes from './Routes';
import axios from 'axios';
import { UserContextProvider } from './UserContext';

export const App = () => {
  axios.defaults.withCredentials = true;
  return (
    <>
    <UserContextProvider>
        <Routes/>
        </UserContextProvider>
    </>
  )
}

export default App; 