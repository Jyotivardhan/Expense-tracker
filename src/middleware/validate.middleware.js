import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const data = source === 'query' ? req.query : req[source];
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => issue.message)
      .join(', ');
    return next(new ApiError(400, message));
  }

  if (source === 'query') {
    req.validatedQuery = result.data;
  } else {
    req[source] = result.data;
  }

  next();
};
