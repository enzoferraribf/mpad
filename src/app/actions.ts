"use server";

import { createClient } from "@libsql/client";

import { diffUpdateV2, mergeUpdatesV2 } from "yjs";

const client = createClient({
  url: process.env.TURSO_DB!,
  authToken: process.env.TURSO_TOKEN,
});

export async function handleServerSidePersistence(
  pad: string,
  buffer: number[]
) {
  const transaction = await client.transaction("write");

  const set = await transaction.execute({
    sql: "SELECT change FROM pad_history WHERE id = ? ORDER BY created_at DESC LIMIT 1",
    args: [pad],
  });

  let diff: Uint8Array = new Uint8Array(buffer);

  if (set.rows && set.rows[0]) {
    const remote = set.rows[0]["change"] as string;

    const buffer = stringToBuffer(remote);

    diff = diffUpdateV2(diff, buffer);
  }

  const commaSeparatedArray = diff.join(",");

  await transaction.execute({
    sql: "INSERT INTO pad_history (id, change) VALUES (?, ?)",
    args: [pad, commaSeparatedArray],
  });

  await transaction.commit();
}

export async function rebuildPageContent(pad: string) {
  const set = await client.execute({
    sql: "SELECT change FROM pad_history WHERE id = ? ORDER BY created_at DESC",
    args: [pad],
  });

  if (!set.rows) return null;

  const changeSet = new Array<Uint8Array>();

  for (const row of set.rows) {
    if (!row) continue;

    const change = row["change"] as string;

    const buffer = stringToBuffer(change);

    changeSet.push(buffer);
  }

  const mergedChanges = mergeUpdatesV2(changeSet);

  return mergedChanges;
}

function stringToBuffer(change: string) {
  const array: number[] = [];

  for (const char of change.split(",")) {
    array.push(Number.parseInt(char));
  }

  const buffer = new Uint8Array(array);

  return buffer;
}
