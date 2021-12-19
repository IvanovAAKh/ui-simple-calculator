import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const HistoryForm = ({
  classes,
  historyItems = []
}) => (
  <Grid
    container
    direction="column"
  >
    {historyItems.map((item, index) => (
      <Grid item>
        <Typography color="textSecondary">
          {`${index + 1}) ${item}`}
        </Typography>
      </Grid>
    ))}
  </Grid>
);

export default HistoryForm;