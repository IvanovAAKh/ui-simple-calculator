import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CalculatorForm from '../components/CalculatorForm.jsx'
import ExpressionForm from '../components/ExpressionForm.jsx'
import HistoryForm from '../components/HistoryForm.jsx';

import importedMathProblemActions from '../actions/mathProblems';
import * as mathErrorTypes from '../constants/mathErrorTypes';
import * as operationTypes from '../constants/operationTypes.js';
import operatorsToOperationTypes from '../constants/operatorsToOperationTypes.js';

const sum = (a, b) => {
  return a + b;
};
const diff = (a, b) => {
  return a - b;
};
const mult = (a, b) => {
  return a * b;
};
const div = (a, b) => {
  if (b === 0) throw mathErrorTypes.DIVISION_BY_ZERO;
  return a / b;
};

const getErrorText = errorType => `Error: ${errorType}`;

const OPERATORS_DIVIDER = ' ';

const funcToOperators = {
  [operatorsToOperationTypes[operationTypes.DIFF]]: diff,
  [operatorsToOperationTypes[operationTypes.DIV]]: div,
  [operatorsToOperationTypes[operationTypes.MULT]]: mult,
  [operatorsToOperationTypes[operationTypes.SUM]]: sum,
};

const calculate = (operand1, operator, operand2) => {
  const func = funcToOperators[operator];
  if (!func) throw mathErrorTypes.NOT_SUPPORTED_OPERATION;
  return func(operand1, operand2);
};

const expressionToArray = expression => expression
  .split(OPERATORS_DIVIDER)
  .map(exprPart => {
    if (!exprPart) return exprPart;
    const number = Number(exprPart);
    return Number.isNaN(number)
      ? exprPart
      : number
  });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: '',
      history: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      mathProblemsList
    } = this.props;
    if (mathProblemsList !== prevProps.mathProblemsList) {
      this.calculateMathProblems(mathProblemsList);
    }
  };

  calculateMathProblems = (mathProblems = []) => {
    const {
      history,
    } = this.state;
    const newHistoryItems = [];

    mathProblems.forEach((problem) => {
      let historyItem = `${
        problem}${
        OPERATORS_DIVIDER}${
        operatorsToOperationTypes[operationTypes.EQUAL]}${
        OPERATORS_DIVIDER}`;
      const [operand1, exprOperator, operand2] = expressionToArray(problem);
      const isValidExpression = [operand1, operand2]
        .every(operand => typeof operand === 'number');
      if (!isValidExpression) {
        historyItem = `${historyItem}${getErrorText(mathErrorTypes.INCORRECT_EXPRESSION_FORMAT)}`;
      } else {
        try {
          const result = calculate(operand1, exprOperator, operand2);
          historyItem = `${historyItem}${result}`;
        } catch (err) {
          historyItem = `${historyItem}${getErrorText(err)}`;
        }
      }
      newHistoryItems.push(historyItem);
    });

    this.setState({
      history: history.concat(newHistoryItems),
    });
  };

  render() {
    const {
      actionFetchMathProblems,
      isFailedLoadMathProblems,
      isFetchingMathProblems,
    } = this.props;
    const {
      expression,
      history,
    } = this.state;
    return (
      <Grid
        container
        spacing={1}
        wrap="nowrap"
      >
        <Grid
          container
          direction="column"
          item
          style={{
            width: 'fit-content',
          }}
        >
          <Grid item>
            <CalculatorForm
              onNumberInput={number => this.setState({
                expression: expression + number,
              })}
              onOperatorInput={(inputOperator) => {
                const [operand1, exprOperator, operand2] = expressionToArray(expression);
                const isExpressionReady = [operand1, operand2]
                  .every(operand => typeof operand === 'number');

                let updatedExpression = expression;
                let newHistoryItems = [];
                if (isExpressionReady) {
                  let result;
                  let error;
                  try {
                    result = calculate(operand1, exprOperator, operand2);
                    updatedExpression = inputOperator === operatorsToOperationTypes[operationTypes.EQUAL]
                      ? `${result}`
                      : `${result}${OPERATORS_DIVIDER}${inputOperator}${OPERATORS_DIVIDER}`;
                  } catch(err) {
                    error = getErrorText(err);
                    updatedExpression = '';
                  }
                  newHistoryItems.push(`${
                    expression}${
                    OPERATORS_DIVIDER}${
                    operatorsToOperationTypes[operationTypes.EQUAL]}${
                    OPERATORS_DIVIDER}${
                    error || result}`
                  );
                } else if (inputOperator !== operatorsToOperationTypes[operationTypes.EQUAL]) {
                  if (typeof operand1 !== 'number') {
                    if (inputOperator === operatorsToOperationTypes[operationTypes.DIFF]
                      || (inputOperator === operatorsToOperationTypes[operationTypes.SUM]
                        && operand1 === operatorsToOperationTypes[operationTypes.DIFF]
                      )
                    ) {
                      updatedExpression = inputOperator;
                    }
                  } else if (!exprOperator) {
                    updatedExpression = `${operand1}${OPERATORS_DIVIDER}${inputOperator}${OPERATORS_DIVIDER}`;
                  } else if (typeof operand2 !== 'number') {
                    updatedExpression = `${operand1}${OPERATORS_DIVIDER}${exprOperator}${OPERATORS_DIVIDER}`;
                    if (inputOperator === operatorsToOperationTypes[operationTypes.DIFF]
                      || (inputOperator === operatorsToOperationTypes[operationTypes.SUM]
                        && operand2 === operatorsToOperationTypes[operationTypes.DIFF]
                      )
                    ) {
                      updatedExpression = `${updatedExpression}${inputOperator}`;
                    }
                  }
                }

                this.setState({
                  expression: updatedExpression,
                  history: newHistoryItems.length
                    ? history.concat(newHistoryItems)
                    : history,
                });
              }}
            />
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            <ExpressionForm
              expression={expression}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" />
        </Grid>
        <Grid
          container
          direction="column"
          item
          spacing={1}
        >
          <Grid item>
            <Button
              disabled={isFetchingMathProblems}
              onClick={() => actionFetchMathProblems({
                problemsCount: 5,
              })}
            >
              <Typography>
                {isFetchingMathProblems && `Загрузка...`}
                {!isFetchingMathProblems && `Получить и решить примеры`}
              </Typography>
            </Button>
          </Grid>
          {isFailedLoadMathProblems && (
            <Grid item>
              <Typography color="error">
                {`Ошибка загрузки`}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <HistoryForm
              historyItems={history}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const mapReduxStateToProps = state => ({
  mathProblemsList: state.mathProblems.list,
  isFailedLoadMathProblems: state.mathProblems.isFailed,
  isFetchingMathProblems: state.mathProblems.isFetching,
});

const mapDispatchToProps = (dispatch) => {
  const {
    fetchMathProblems,
  } = bindActionCreators(importedMathProblemActions, dispatch);
  return {
    actionFetchMathProblems: fetchMathProblems,
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(App);