import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import slugify from 'slug';

import type { InsertLocation } from '../schema';

import db from '..';
import { location as locationTable } from '../schema';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5);

export async function findLocationByName(location: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(locationTable.name, location.name),
      eq(locationTable.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return db.query.location.findFirst({
    where: eq(locationTable.slug, slug),
  });
}

export async function generateUniqueLocationSlug(name: string) {
  let slug = slugify(name);
  let existing = !!(await findLocationBySlug(slug));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findLocationBySlug(idSlug));
    if (!existing) {
      slug = idSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(locationTable).values({
    ...insertable,
    userId,
    slug,
  }).returning();
  return created;
}
