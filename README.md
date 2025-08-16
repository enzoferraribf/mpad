<p align="center">
    <img src="https://imgur.com/UOlIAJE.png">
    <p align="center">
        Share and update documents in real-time
    </p>
</p>

<br>

<p align="center">
    <img src="./assets/demo.png">
</p>

Missopad is a real-time collaborative tool that renders Markdown. You can access any page without the need to authenticate in any way. Simply access a url (e.g https://missopad.com/<any_url>) and start editing!

## Development

Want to contribute to Missopad? Simply follow the steps and you should be good to go. Just make sure you have [Bun](https://bun.sh/docs/installation) installed.

### Installing the local deps

Clone the project and run:

```sh
bun install
```

### Creating the local database

Create a local sqlite file in the application's directory:

```sh
# Linux/Mac
touch database.db
```

or

```ps
# Windows
New-Item -ItemType File -Name "database.db"
```

This file will hold the contents of any pad you create while developing locally.

### Create the env file

In the application's directory, create a .env file with the following contents:

```sh
TURSO_DB=file:database.db
NEXT_PUBLIC_SIGNALING_SERVER=ws://localhost:4000
```

Notice how the `TURSO_DB` variable points to the `.db` file you created previously.

### Create the pads table

The easiest way to do that and not install sqlite-cli locally is just to create a `migration.ts` file at the root of the project, with the following content:

```ts
import { createClient } from '@libsql/client';

const database = createClient({ url: process.env.TURSO_DB! });

await database.executeMultiple(`
    CREATE TABLE IF NOT EXISTS pads (
        id TEXT PRIMARY KEY,
        root TEXT,
        content TEXT,
        last_update INTEGER,
        last_transaction INTEGER
    );

    CREATE UNIQUE INDEX IF NOT EXISTS root_index ON pads(root);
`);
```

and execute it with:

```sh
bun run migration.ts
```

The database should be ready.

### [Optional] Setup the WebRTC signaling server

You'll only need this if you want to test Missopad to the fullest, meaning the real-time collaborative functions. If you to setup, go to the [Mpad WebRTC Server](https://github.com/enzoferraribf/mpad-ws) github page and follow the instructions.

### Run Missopad

Execute:

```sh
bun dev
```

And open [The local version of Missopad](http://localhost:3000)
