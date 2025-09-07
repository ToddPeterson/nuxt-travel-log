import type { DrizzleError } from 'drizzle-orm';

import { LibsqlError } from '@libsql/client';
import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import slugify from 'slug';

import db from '../db';
import { InsertLocation, location } from '../db/schema';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

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

  const locationExists = await db.query.location.findFirst({
    where: and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  });

  if (locationExists) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'A location with that name already exists',
    }));
  }

  let slug = slugify(result.data.name);
  const checkExisting = async (s: string) => !!(await db.query.location.findFirst({
    where: eq(location.slug, s),
  }));
  let existing = await checkExisting(slug);

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = await checkExisting(idSlug);
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      userId: event.context.user.id,
      slug,
    }).returning();
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
