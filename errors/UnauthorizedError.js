class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statsCode = 401;
  }
}

module.exports = UnauthorizedError;
