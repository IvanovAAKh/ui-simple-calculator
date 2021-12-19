import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import * as OPERATION_TYPES from '../constants/operationTypes.js';
import OPERATORS_TO_OPERATION_TYPES from '../constants/operatorsToOperationTypes.js';

const styles = () => ({
  mainContainer: {
    display: 'flex',
  },
  cellsContainer: {
    display: 'flex',
  },
  rowsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  btnContainer: {
    height: '40px',
    width: '40px',
  },
  btn: {
    minHeight: '40px',
    minWidth: '40px',
    padding: 0,
  }
});

const numbers = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null]
];

const operators = [
  [OPERATORS_TO_OPERATION_TYPES[OPERATION_TYPES.SUM], OPERATORS_TO_OPERATION_TYPES[OPERATION_TYPES.DIFF]],
  [OPERATORS_TO_OPERATION_TYPES[OPERATION_TYPES.MULT], OPERATORS_TO_OPERATION_TYPES[OPERATION_TYPES.DIV]],
  [OPERATORS_TO_OPERATION_TYPES[OPERATION_TYPES.EQUAL]],
];

const CalculatorForm = ({
  classes,
  onOperatorInput,
  onNumberInput,
}) => (
  <div className={classes.mainContainer}>
    {/* Numbers */}
    <div className={classes.rowsContainer}>
      {numbers.map(numbersRow => (
        <div className={classes.cellsContainer}>
          {numbersRow.map(number => (
            <div className={classes.btnContainer}>
              {typeof number === 'number' && (
                <Button
                  classes={{
                    root: classes.btn,
                  }}
                  onClick={() => onNumberInput(number)}
                >
                  <Typography variant="h5">
                    {number}
                  </Typography>
                </Button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
    {/* Operators */}
    <div className={classes.rowsContainer}>
      {operators.map(operatorsRow => (
        <div className={classes.cellsContainer}>
          {operatorsRow.map(operator => (
            <Button
              classes={{
                root: classes.btn,
              }}
              onClick={() => onOperatorInput(operator)}
            >
              <Typography
                variant="h6"
              >
                {operator}
              </Typography>
            </Button>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default withStyles(styles)(CalculatorForm);