const { exec } = require("child_process");

const PORT = process.env.PORT || 5000;

const platform = process.platform;

if (platform === "win32") {
  exec(`netstat -ano | findstr :${PORT}`, (error, stdout, stderr) => {
    if (stdout) {
      const pid = stdout.split(" ").filter(Boolean).pop();
      exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error killing process: ${error}`);
          return;
        }
        console.log(`Process on port ${PORT} killed`);
      });
    }
  });
} else {
  exec(
    `lsof -i :${PORT} | grep LISTEN | awk '{print $2}'`,
    (error, stdout, stderr) => {
      if (stdout) {
        const pid = stdout.trim();
        exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error killing process: ${error}`);
            return;
          }
          console.log(`Process on port ${PORT} killed`);
        });
      }
    }
  );
}
