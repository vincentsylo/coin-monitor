import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Coin from './Coin';
import styles from './Coins.css';

@connect(state => ({ coins: state.coins }))
export default class Coins extends Component {
  static propTypes = {
    coins: PropTypes.object,
  };

  static defaultProps = {
    coins: {},
  };

  render() {
    const { coins } = this.props;

    return (
      <div className={styles.root}>
        {
          _.map(coins, (coin, symbol) => (
            <Coin key={symbol} coin={{ symbol, ...coin }} />
          ))
        }
        <Coin isNew />
      </div>
    );
  }
}
