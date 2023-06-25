import os from "node:os";

const MHzinGHz = 1000;

export const dispatchOSOperation = (operation) => {
  switch (operation) {
    case "--EOL": {
      console.log(JSON.stringify(os.EOL));
      break;
    }

    case "--cpus": {
      const cpuInfo = os.cpus().map((cpuEntry) => ({
        model: cpuEntry.model,
        clockRate: cpuEntry.speed / MHzinGHz,
      }));

      console.log(`Total number of CPUs: ${cpuInfo.length}${os.EOL}`);

      cpuInfo.forEach((cpu, idx) => {
        console.log(`CPU №${idx + 1}`);
        console.log(`CPU Model: ${cpu.model}`);
        console.log(`CPU Clock Rate: ${cpu.clockRate} GHz${os.EOL}`);
      });
      break;
    }

    case "--homedir": {
      console.log(os.homedir());
      break;
    }

    case "--username": {
      const { username } = os.userInfo();

      console.log(username);
      break;
    }

    case "--architecture": {
      console.log(os.arch());
      break;
    }

    default: {
      throw new Error("Invalid OS operation");
    }
  }
};
