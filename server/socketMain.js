const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Machine = require("./models/Machine");

const socketMain = (io, socket) => {
  let macA;
  // console.log(`A socket connected`, socket.id);
  // console.log("someone called me, socketMain");
  socket.on("clientAuth", (key) => {
    if (key === "alskdfj235987") {
      // valid nodeClient
      socket.join("clients");
    } else if (key === "asldfkjasldkfj") {
      // valid ui client has joined
      socket.join("ui");
      console.log("A react client has joined");
      Machine.find({}, (err, docs) => {
        docs.forEach((aMachine) => {
          // on load, assume that all machines are offline
          aMachine.isActive = false;
          io.to("ui").emit("data", aMachine);
        });
      });
    } else {
      // an invalid client has joined. terminate.
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", () => {
    Machine.find({ macA: macA }, (err, docs) => {
      if (docs.length > 0) {
        // send one last emit to react
        docs[0].isActive = false;
        io.to("ui").emit("data", docs[0]);
      }
    });
  });

  // a machine has connected, check to see if it's new,
  // if it, add it!
  socket.on("initPerfData", async (data) => {
    // update our socket.connect function scoped variable
    macA = data.macA;

    // now go check mongo
    const mongooseResponse = await checkAndAdd(data);

    console.log("response", mongooseResponse);
  });

  socket.on("perfData", (data) => {
    console.log("Tick...", data);
    io.to("ui").emit("data", data);
  });
};

const checkAndAdd = (data) => {
  // bc we are doing db stuff, js wont wait for the db.
  // so we need to make a new promise
  return new Promise((resolve, reject) => {
    Machine.findOne(
      { macA: data.macA }, // query
      (err, doc) => {
        console.log(doc);
        // callback
        if (err) {
          reject(err);
          throw err;
        } else if (doc === null) {
          // these are the droids we're looking for
          // the record is not in the db, so add it!
          let newMachine = new Machine(data);
          newMachine.save(); // actually save it
          resolve("added");
        } else {
          // it is in the db, just resolve
          resolve("found");
        }
      }
    );
  });
};

module.exports = socketMain;
