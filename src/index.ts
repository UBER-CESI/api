import cluster from "node:cluster";
import("./routes").then((routes) => {
  routes.default.spawn();
});
/*
if (cluster.isPrimary) {
  import("node:os").then((os) => {
    const totalCPUs = os.cpus().length;
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  });
} else {
  import("routes").then((routes) => {
    routes.default.spawn();
  });
}
*/
