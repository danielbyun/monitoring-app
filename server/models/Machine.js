const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Machine = new Schema({
  macA: String,
  freeMem: String,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModel: String,
  cpuNumCores: Number,
  cpuSpeed: Number,
});

module.exports = mongoose.model("Machine", Machine);
