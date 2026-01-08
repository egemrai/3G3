import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",  //burdaki level threshhold, şu an info altındaki levelları(debug ve trace) console'a yazmıyor, bunu 'debug' yaparsam sadece trace'i console'a yazmıcak  
  transport: process.env.NODE_ENV !== "production"
    ? {
        targets: [
          {
            target: "pino-pretty",
            level: "debug",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss",
            },
          },
          {
            target: "pino/file",
            level: "info",
            options: {
              destination: "logs/app.log",
            },
          },
        ],
      }
      : undefined
    // : {
    //     target: "pino/file",
    //     options: {
    //       destination: "logs/app.log",
    //     },
    //   },
})

export default logger