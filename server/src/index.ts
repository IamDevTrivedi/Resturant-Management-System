import config from "@/config/env";
import logger from "@/utils/logger";

logger.info('Hello');
logger.debug(JSON.stringify(config, null, 2));