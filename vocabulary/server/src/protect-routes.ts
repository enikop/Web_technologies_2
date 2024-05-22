import { UnauthorizedError, expressjwt } from "express-jwt";
import jwt, { JwtPayload } from 'jsonwebtoken';

export const checkUser = expressjwt({
  secret: "8sxYVG3yJG",
  algorithms: ["HS256"]
});

export const checkUserIdentity = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    throw new UnauthorizedError('credentials_required', { message: 'Unauthorized.' });
  }
  const decoded = jwt.verify(token, "8sxYVG3yJG") as JwtPayload;
  const bearerUsername = decoded.username;
  const requestedUsername = req.params.username;
  if (bearerUsername != requestedUsername) {
    throw new UnauthorizedError('invalid_token', { message: 'Cannot access data of another user.' });
  }
  next();
}

export const getAuthenticatedUsername = (req) => {
  const token = getToken(req);
  const decoded = jwt.verify(token, "8sxYVG3yJG") as JwtPayload;
  return decoded?.username ?? '';
}

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

export const handleAuthorizationError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    if (err.message == "Cannot access data of another user.") {
      return res.status(403).send({ error: 'Cannot access data of another user.' });
    }
    return res.status(401).send({ error: 'Authentication is required for this operation.' });
  } else {
    next(err);
  }
};
