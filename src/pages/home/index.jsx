import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/global.scss"; //'./style.scss'
import Common from '../../components/Common.jsx';

const Home = () => {
  return (
    <nav>
      <Link to="/home">
          <p style={{color: 'red'}}>HOME</p>
      </Link>
      <Link to="/generator">
          <div style={{color: 'blue'}}>GENERATOR</div>
      </Link>
      <Link to="/about">
          <div style={{color: 'green'}}>ABOUT</div>
      </Link>
      <Common />
    </nav>
  )
}

export default Home
