/*
  the node program that captures local performance data
  and sends it up to the socket.io server
  
  Req:
    - farmhash
    - socket.io-client
*/

const os = require("os");
const io = require("socket.io-client");
let socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  // console.log("i connected to the socket server. yay");

  // need a way to identify this machine to whomever is concerned
  const networkInterfaces = os.networkInterfaces();
  let macA;

  // loop through all the network interfaces for this machine and find non-internal one
  for (let key in networkInterfaces) {
    // FOR TESTING PURPOSES
    macA = Math.floor(Math.random() * 3) + 1;
    break;
    // FOR TESTING PURPOSES
    if (networkInterfaces[key][0].internal) {
      if (networkInterfaces[key][0].mac === "00:00:00:00:00:00") {
        macA = Math.random().toString(36).substring(2, 15);
      } else {
        // if internal is true
        macA = networkInterfaces[key][0].mac;
      }
      break;
    }
  }

  // client auth with single key value
  socket.emit("clientAuth", "alskdfj235987");

  performanceData().then((allPerformanceData) => {
    allPerformanceData.macA = macA;
    socket.emit("initPerfData", allPerformanceData);
  });

  // start sending over data on interval
  let perfDataInterval = setInterval(() => {
    performanceData().then((allPerformanceData) => {
      allPerformanceData.macA = macA;

      // console.log(allPerformanceData);
      socket.emit("perfData", allPerformanceData);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

const cpus = os.cpus();

const performanceData = () => {
  /*
  what do we need to know from node about performance?
  1) CPU load (current)
  2) Memory usage
    a) free
    b) total
  3) OS type
  4) uptime
  5) CPU info
    1) type
    2) number of cores
    3) clock of speed
*/

  return new Promise(async (resolve, reject) => {
    // os type
    const osType = os.type() === "Darwin" ? "Mac" : os.type();
    // console.log(osType);

    // uptime
    const upTime = os.uptime();
    // console.log(upTime);

    // ========== memory ==========
    const freeMem = os.freemem();
    // total memory
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    // console.log(memUsage);

    // ========== cpu info ==========
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
    const cpuNumCores = cpus.length;

    const cpuLoad = await getCpuLoad();
    const isActive = true;

    resolve({
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
      isActive,
    });
  });
};

// ========== load average ==========
// cpu is all cpuNumCores. we need the average of all the cores which will give us the cpu average
const cpuAverage = () => {
  const cpus = os.cpus();

  // get ms in each mode, BUT this number is since reboot,
  // so get it now and get it again in 100ms to compare
  let idleMs = 0;
  let totalMs = 0;

  // loop through each core
  cpus.forEach((core) => {
    // loop through each property of the current core
    for (type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });

  return {
    idle: Number((idleMs / cpus.length).toFixed(2)),
    total: Number((totalMs / cpus.length).toFixed(2)),
  };
};

// because the times property is time since boot, we will get now times, and 100ms from now times. Compare them, that will give us current Load
const getCpuLoad = () => {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();

      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // console.log("getCpuLoad -> idleDifference", idleDifference);
      // console.log("getCpuLoad -> totalDifference", totalDifference);

      // calculate the % of used cpu
      const percentageCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCpu);
    }, 100);
  });
};
