import React from "react";
import { Grid, Typography } from "@material-ui/core";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";

import "./Widget.css";

const Widget = ({
  data: {
    freeMem,
    totalMem,
    usedMem,
    memUsage,
    osType,
    upTime,
    cpuModel,
    cpuSpeed,
    cpuNumCores,
    cpuLoad,
    macA,
    isActive,
  },
}) => {
  const cpuWidgetId = `cpu-widget-${macA}`;
  const memWidgetId = `mem-widget-${macA}`;
  const cpu = { cpuLoad, cpuWidgetId };
  const mem = { totalMem, usedMem, memUsage, freeMem, memWidgetId };
  const info = { macA, osType, upTime, cpuModel, cpuSpeed, cpuNumCores };

  return (
    <Grid container justify="space-evenly">
      {!isActive && (
        <Grid item>
          <Typography
            variant="h6"
            color="error"
            style={{ position: "absolute", fontSize: "5rem", zIndex: 3000 }}
          >
            Offline
          </Typography>
        </Grid>
      )}
      <Cpu cpuData={cpu} />
      <Mem memData={mem} />
      <Info infoData={info} />
    </Grid>
  );
};

export default Widget;
