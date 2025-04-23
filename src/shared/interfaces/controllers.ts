import { FastifyRequest, FastifyReply } from 'fastify';

export interface BaseController {
  create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  findById(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  findAll(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  update(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  delete(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}