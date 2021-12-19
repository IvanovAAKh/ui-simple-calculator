import React from 'react';
import Typography from '@material-ui/core/Typography';

const ExpressionForm = ({
  classes,
  expression,
}) => (
  <Typography variant="h4">
    {expression || '0'}
  </Typography>
);

export default ExpressionForm;