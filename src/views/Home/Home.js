import React, { Component } from 'react';
import Dashboard from '../Dashboard/Dashboard';
import Coins from '../Coins/Coins';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Dashboard />
        <Coins />
      </div>
    );
  }
}
