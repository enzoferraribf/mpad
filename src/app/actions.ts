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

  const resultSet = await transaction.execute({
    sql: "INSERT INTO pad_history (id, change) VALUES (?, ?) RETURNING created_at",
    args: [pad, commaSeparatedArray],
  });

  const lastUpdate = resultSet.rows[0]["created_at"] as number;

  const utcLastUpdate = lastUpdate ? lastUpdate + "Z" : "";

  console.log(utcLastUpdate);

  await transaction.commit();

  return {
    lastUpdate: utcLastUpdate,
  };
}

export async function getInitialPageContent(pad: string) {
  const set = await client.execute({
    sql: "SELECT change, created_at FROM pad_history WHERE id = ? ORDER BY created_at DESC",
    args: [pad],
  });

  if (!set.rows)
    return {
      buffer: null,
      lastUpdate: null,
    };

  const changeSet = new Array<Uint8Array>();

  let lastUpdate: number | null = null;

  for (const row of set.rows) {
    if (!row) continue;

    const change = row["change"] as string;
    lastUpdate = row["created_at"] as number;

    const buffer = stringToBuffer(change);

    changeSet.push(buffer);
  }

  const buffer = Array.from(mergeUpdatesV2(changeSet));

  const utcLastUpdate = lastUpdate ? lastUpdate + "Z" : "";

  return {
    buffer,
    lastUpdate: utcLastUpdate,
  };
}

function stringToBuffer(change: string) {
  const array: number[] = [];

  for (const char of change.split(",")) {
    array.push(Number.parseInt(char));
  }

  const buffer = new Uint8Array(array);

  return buffer;
}
