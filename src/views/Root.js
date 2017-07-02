import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import { connect } from 'react-redux';
import { updateCurrency } from 'stores/data';
import styles from './Root.css';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';
import Coins from './Coins/Coins';
import NoMatch from './NoMatch/NoMatch';

@withRouter
@connect(state => ({ currency: state.data.currency }))
export default class Root extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currency: PropTypes.string.isRequired,
  };

  changeCurrency = (e) => {
    const { dispatch } = this.props;

    dispatch(updateCurrency(e.target.value));
  };

  render() {
    const { currency } = this.props;

    return (
      <div className={styles.root}>
        <nav className={styles.navigation}>
          <h1 className={styles.title}><Link to="/" className={styles.title}>Coin Monitor</Link></h1>
          <Link to="dashboard" className={styles.link}><i className={cx(styles.linkIcon, 'fa fa-tachometer')} />Dashboard</Link>
          <Link to="coins" className={styles.link}><i className={cx(styles.linkIcon, 'fa fa-btc')} />Coins</Link>
        </nav>

        <div className={styles.main}>
          <div className={styles.header}>
            <select className={styles.currency} value={currency} onChange={this.changeCurrency}>
              <option value="usd">USD</option>
              <option value="aud">AUD</option>
              <option value="brl">BRL</option>
              <option value="cad">CAD</option>
              <option value="chf">CHF</option>
              <option value="cny">CNY</option>
              <option value="eur">EUR</option>
              <option value="gdp">GBP</option>
              <option value="hkd">HKD</option>
              <option value="idr">IDR</option>
              <option value="inr">INR</option>
              <option value="jpy">JPY</option>
              <option value="krw">KRW</option>
              <option value="mxn">MXN</option>
              <option value="rub">RUB</option>
            </select>
          </div>
          <div className={styles.content}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/coins" component={Coins} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
