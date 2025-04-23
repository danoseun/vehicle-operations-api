import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyError } from 'fastify';
import { ApplicationError } from '../shared/errors/application-error';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

const errorHandler: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError | ZodError | ApplicationError, request, reply) => {
    fastify.log.error(error);

    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: validationError.message
      });
    }

    if (error instanceof ApplicationError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message
      });
    }

    // Default Fastify error handling
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message
      });
    }

    // Unexpected errors
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  });
});

export default errorHandler;