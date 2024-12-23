import React, { useEffect, useState } from 'react';
import Header from './components/MainPage/Header/Header';
import General from './components/MainPage/Page/General';

const App = () => {

  return (

    <div className="wrap">
      <div className="MainPage">

        <Header />
        <General />

      </div>



      <div className="HomePage">
        
      </div>

    </div>





  );
};

export default App;
