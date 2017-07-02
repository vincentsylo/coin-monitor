import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addCoin, updateCoin, removeCoin } from 'stores/coins';
import styles from './Coin.css';

@connect(state => ({ data: state.data, coins: state.coins }))
export default class Coin extends Component {
  static propTypes = {
    isNew: PropTypes.bool,
    data: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    coins: PropTypes.object.isRequired,
    coin: PropTypes.object,
  };

  static defaultProps = {
    isNew: false,
    data: null,
    coin: null,
  };

  state = {
    editing: false,
    showAutoComplete: false,
    coin: '',
    amount: '',
    value: '',
    name: '',
  };

  componentWillMount() {
    const { coin } = this.props;

    if (coin) {
      this.setState({
        coin: coin.symbol,
        amount: coin.amount,
        value: coin.value,
        name: coin.name,
      });
    }
  }

  onBlur = () => {
    const { data, coins } = this.props;
    const { coin } = this.state;

    const foundCoin = _.find(data.coins, c => !coins[c.symbol] && c.symbol === _.toUpper(coin));

    if (foundCoin) {
      this.setState({
        showAutoComplete: false,
        coin: foundCoin.symbol,
        name: foundCoin.name,
      });
    } else {
      this.setState({
        showAutoComplete: false,
        coin: '',
      });
    }
  };

  selectSuggestion = (suggestion) => {
    this.setState({ coin: suggestion.symbol, name: suggestion.name, showAutoComplete: false });
  };

  updateCoin = (e) => {
    this.setState({ coin: e.target.value });
  };

  updateAmount = (e) => {
    this.setState({ amount: e.target.value });
  };

  updateValue = (e) => {
    this.setState({ value: e.target.value });
  };

  submit = (update = false) => {
    const { dispatch } = this.props;
    const { coin, amount, value, name } = this.state;

    if (!update) {
      dispatch(addCoin(coin, amount, value, name));
      this.setState({ coin: '', amount: '', value: '', name: '' });
    } else {
      dispatch(updateCoin(coin, amount, value));
    }
  };

  remove = () => {
    const { dispatch } = this.props;
    const { coin } = this.state;

    dispatch(removeCoin(coin));
  };

  render() {
    const { isNew, data, coins } = this.props;
    const { editing, coin, value, amount, name, showAutoComplete } = this.state;

    const currency = _.toUpper(data.currency);
    const filteredSuggestions = _.filter(data.coins, c => !coins[c.symbol] && _.includes(c.symbol, _.toUpper(coin)));
    const suggestions = filteredSuggestions.length > 0 ? (
      _.map(filteredSuggestions, suggestion => <div key={suggestion.id} className={styles.suggestion} onClick={() => this.selectSuggestion(suggestion)}>{suggestion.symbol}</div>)
    ) : <div className={styles.noSuggestion}>No suggestions available.</div>;

    const disabled = showAutoComplete || !coin || !amount || !value;
    const activeInput = isNew || editing;
    const updateOrSave = !editing ? (
      <button
        type="submit"
        className={styles.submit}
        onClick={() => this.setState({ editing: true })}
        disabled={disabled}
      >
        Update {coin} <i className="fa fa-pencil" />
      </button>
    ) : [
      <button
        type="submit"
        key="remove"
        className={styles.submit}
        onClick={this.remove}
      >
        Remove <i className="fa fa-minus" />
      </button>,
      <button
        type="submit"
        key="save"
        className={styles.submit}
        onClick={() => this.setState({ editing: false }, () => this.submit(true))}
      >
        Save <i className="fa fa-check" />
      </button>,
    ];

    return (
      <div className={styles.coin}>
        <span className={styles.title}>{ isNew ? 'New coin' : name }</span>
        <form>
          <div className={styles.container}>
            <div className={styles.inputContainer}>
              <label htmlFor="coin" className={styles.label}>Coin</label>
              <input
                type="text"
                id="coin"
                className={styles.input}
                value={coin}
                disabled={!isNew}
                onChange={this.updateCoin}
                autoComplete="off"
                onFocus={() => this.setState({ showAutoComplete: true })}
                onBlur={() => setTimeout(this.onBlur, 300)}
              />
              {
                coin.length > 0 && showAutoComplete ?
                  <div className={styles.autoComplete}>
                    {suggestions}
                  </div>
                : null
              }
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="amount" className={styles.label}>Amount</label>
              <input type={activeInput ? 'number' : 'text'} id="amount" disabled={!activeInput} className={styles.input} value={amount} onChange={this.updateAmount} autoComplete="off" />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="value" className={styles.label}>Value ({currency})</label>
              <input type={activeInput ? 'number' : 'text'} id="value" disabled={!activeInput} className={styles.input} value={value} onChange={this.updateValue} autoComplete="off" />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            {
              isNew ? (
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={disabled}
                  onClick={() => this.submit(false)}
                >
                  Add coin <i className="fa fa-plus" />
                </button>
              ) : updateOrSave
            }
          </div>
        </form>
      </div>
    );
  }
}
