import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const pads = sqliteTable('pads', {
    id: text('id').primaryKey(),
    content: text('content'),
    root: text('root'),
    lastUpdate: integer('last_update'),
    lastTransaction: integer('last_transaction'),
});
