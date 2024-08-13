class DBError extends Error {}
class NotFoundError extends Error {}
class AuthError extends Error {}
class NotEnoughError extends Error {}
class LimitExceededError extends Error {}
class ConflictError extends Error {}

export {
  DBError,
  NotFoundError,
  AuthError,
  NotEnoughError,
  LimitExceededError,
  ConflictError
};
