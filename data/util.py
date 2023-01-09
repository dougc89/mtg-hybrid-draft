import logging
def create_logger(log_name, file, level='INFO'):
    # @script_name (string): pass in the calling script name, for debugging (__name__)
    # @file (string): where do you want logs to be saved? Be specific, relative paths can get ugly with web-initiated executions
    # @level (string): from ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'] >> default to WARNING

    # get/create the logger
    logger = logging.getLogger(log_name)

    # set the log level
    if level == 'DEBUG':
        logger.setLevel(logging.DEBUG)
    elif level == 'INFO':
        logger.setLevel(logging.INFO)
    elif level == 'WARNING':
        logger.setLevel(logging.WARNING)
    elif level == 'ERROR':
        logger.setLevel(logging.ERROR)
    elif level == 'CRITICAL':
        logger.setLevel(logging.CRITICAL)
    else: # if the level argument doesn't match any logging level, just set it to WARNING (default)
        logger.setLevel(logging.WARNING)

    # define the log format, as well as file location
    file_handler = logging.FileHandler(file)
    formatter    = logging.Formatter('%(asctime)s %(name)s %(levelname)s: %(message)s', '%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(formatter)

    # attach the format
    logger.addHandler(file_handler)

    # pass it back
    return logger