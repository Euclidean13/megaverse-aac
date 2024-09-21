import axios from 'axios';
import axiosRetry from 'axios-retry';
import { logger } from './logsHelper.js';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => {
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    // Retry on 429 (Too Many Requests) or 5xx errors
    return (
      error.response?.status === 429 || // Too Many Requests
      (error.response?.status >= 500 && error.response?.status < 600) || // Server errors
      error.code === 'ECONNABORTED' || // Connection timeout
      error.code === 'ECONNREFUSED' || // Connection refused
      error.message.includes('Client network socket disconnected') // TLS connection issue
    );
  },
  onRetry: (retryCount, error) => {
    logger.warn(
      `Retrying request... Attempt ${retryCount}. Error: ${error.message}`,
    );
  },
});

export default axiosInstance;
