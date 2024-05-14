const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

module.exports = logger;