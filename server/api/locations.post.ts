import type { DrizzleError } from 'drizzle-orm';

import { LibsqlError } from '@libsql/client';

import { findLocationByName, generateUniqueLocationSlug, insertLocation } from '../db/queries/location';
import { InsertLocation } from '../db/schema';

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join('')}: ${issue.message}`).join('; ');

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join('')] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const locationExists = await findLocationByName(result.data, event.context.user.id);

  if (locationExists) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists',
    }));
  }

  const slug = await generateUniqueLocationSlug(result.data.name);

  try {
    const created = await insertLocation(result.data, slug, event.context.user.id);
    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (error.cause instanceof LibsqlError) {
      if (error.cause.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug') {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'Slug must be unique (the location name is used to generate the slug)',
        }));
      }
      if (error.cause.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.name, location.user_id') {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'Location name must be unique',
        }));
      }
    }
    throw error;
  }
});
