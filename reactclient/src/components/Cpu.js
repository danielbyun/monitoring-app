import React from "react";
import { Grid, Typography } from "@material-ui/core";
import drawCircle from "../utils/canvasLoadAnimation";

const Cpu = ({ cpuData: { cpuLoad, cpuWidgetId } }) => {
  const canvas = document.querySelector(`.${cpuWidgetId}`);
  drawCircle(canvas, cpuLoad);

  return (
    <Grid item container xs={3} sm={3} className="cpu">
      <Grid item className="canvas-wrapper">
        <Typography variant="h6">Cpu Load</Typography>
        <canvas className={cpuWidgetId} width={200} height={200}></canvas>
        <Typography
          color="textSecondary"
          variant="body2"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "45%",
            left: "50%",
          }}
        >
          {cpuLoad}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Cpu;
