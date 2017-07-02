import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import cx from 'classnames';
import { Pie } from 'react-chartjs-2';
import numeral from 'numeral';
import styles from './Dashboard.css';

@connect(state => ({ data: state.data, coins: state.coins }))
export default class Dashboard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    coins: PropTypes.object.isRequired,
  };

  render() {
    const { data, coins } = this.props;

    if (data.currencyChanged) return <div className={styles.loader}><span className="fa fa-2x fa-spin fa-spinner" /></div>;
    const coinsMap = _(coins).mapValues((coin, symbol) => ({ ...coin, symbol })).values().value();
    const currency = _.toUpper(data.currency);
    const totalSpend = _.sumBy(coinsMap, coin => numeral(coin.value).value());
    const totalValue = _.sumBy(coinsMap, coin => numeral(_.get(_.find(data.coins, { symbol: coin.symbol }), `price_${data.currency}`, 0)).value() * numeral(coin.amount).value());
    const totalProfit = totalValue - totalSpend;
    const isUp = totalProfit >= 0;

    return (
      <div className={styles.root}>
        <div className={styles.summary}>
          <div className={styles.card}>
            <div className={styles.header}>
              Total Spend ({currency})
            </div>
            <div className={styles.content}>
              {numeral(totalSpend).format('0.00')}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.header}>
              Total Value ({currency})
            </div>
            <div className={styles.content}>
              {numeral(totalValue).format('0.00')}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.header}>
              Total Profit/Loss ({currency})
            </div>
            <div className={cx(styles.content, isUp ? styles.success : styles.error)}>
              {!isUp ? <span className="fa fa-arrow-down" /> : null}
              <span> {numeral(totalProfit).format('0.00')} </span>
              {isUp ? <span className="fa fa-arrow-up" /> : null}
            </div>
          </div>
        </div>
        <div className={styles.charts}>
          <div className={cx(styles.card, styles.chart)}>
            <div className={styles.header}>Spread</div>
            <div className={styles.content}>
              <Pie
                data={{
                  datasets: [{
                    data: _.map(coinsMap, 'value'),
                    backgroundColor: _.map(coinsMap, 'color'),
                    label: 'hey',
                  }],
                  labels: _.map(coinsMap, 'symbol'),
                }}
              />
            </div>
          </div>
          <div className={cx(styles.card, styles.chart)}>
            <div className={styles.header}>Value</div>
            <div className={styles.content}>
              <Pie
                data={{
                  datasets: [{
                    data: _.map(coinsMap, coin => numeral(_.get(_.find(data.coins, { symbol: coin.symbol }), `price_${data.currency}`, 0)).format('0.00') * numeral(coin.amount).format('0.00')),
                    backgroundColor: _.map(coinsMap, 'color'),
                  }],
                  labels: _.map(coinsMap, 'symbol'),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
