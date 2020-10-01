import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";

import { formatDistance } from "date-fns";

const Info = ({
  infoData: { macA, osType, upTime, cpuModel, cpuSpeed, cpuNumCores },
}) => {
  return (
    <Grid container item xs={3} sm={3}>
      <Grid item>
        <Typography variant="h6">Operating System</Typography>
        <Typography variant="subtitle2">{cpuModel}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">Time Online</Typography>
        <Typography variant="subtitle2">{formatDistance(upTime, 0)}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">Processor Information</Typography>
        <Typography variant="subtitle2">
          <Box fontWeight="fontWeightBold" display="inline">
            Type:
          </Box>{" "}
          {osType}
        </Typography>
        <Typography variant="subtitle2">
          <Box fontWeight="fontWeightBold" display="inline">
            # of cores:
          </Box>{" "}
          {cpuNumCores}
        </Typography>
        <Typography variant="subtitle2">
          <Box fontWeight="fontWeightBold" display="inline">
            Clock Speed:
          </Box>{" "}
          {cpuSpeed}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Info;
