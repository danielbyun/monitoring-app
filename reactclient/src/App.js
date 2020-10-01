import React, { useEffect, useState } from "react";

import socket from "./utils/socketConnection";

import { Card, Grid } from "@material-ui/core";
import Widget from "./components/Widget";

const App = () => {
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    socket.on("data", (data) => {
      const newState = { [data.macA]: data };

      setPerformanceData(newState);
    });
  }, []);

  return (
    <Grid container direction="column" justify="space-evenly">
      {Object.entries(performanceData).map(([key, value]) => (
        <Card key={key}>
          <Widget objectKey={key} data={value} />
        </Card>
      ))}
    </Grid>
  );
};

export default App;
