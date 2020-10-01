import React from "react";
import { Grid, Typography } from "@material-ui/core";
import drawCircle from "../utils/canvasLoadAnimation";

const Mem = ({
  memData: { totalMem, usedMem, memUsage, freeMem, memWidgetId },
}) => {
  const canvas = document.querySelector(`.${memWidgetId}`);
  drawCircle(canvas, memUsage * 100);

  const totalMemInGB = ((totalMem / 1073741824) * 100) / 100;
  const freeMemInGB = Math.floor((freeMem / 1073741824) * 100) / 100;
  const memUsedInGB = Math.floor((usedMem / 1073741824) * 100) / 100;

  const percentageLeft = 100 - memUsage * 100;

  return (
    <Grid container item sm={3} className="mem">
      <Grid item className="canvas-wrapper">
        <Typography variant="h6">Memory Usage</Typography>
        <canvas className={memWidgetId} width="200" height="200"></canvas>
        <Typography
          color="textSecondary"
          variant="body2"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "55%",
            left: "50%",
          }}
        >
          {memUsage * 100}%
        </Typography>
      </Grid>
      <Grid container>
        <Grid>
          <Typography variant="subtitle2" color="textSecondary">
            Total Memory: {totalMemInGB} GB
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="subtitle2" color="textSecondary">
            Memory Used: {memUsedInGB} GB
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="subtitle2" color="textSecondary">
            Free Memory: {freeMemInGB} GB
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="subtitle2" color="textSecondary">
            Memry Left: {percentageLeft} %
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Mem;
