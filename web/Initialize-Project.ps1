(Invoke-WebRequest -UseBasicParsing -Uri https://raw.githubusercontent.com/microsoft/TypeScript/master/lib/lib.dom.d.ts).Content > ./src/lib.dom.d.ts

deno eval "import { getTsConfig } from 'https://raw.githubusercontent.com/Baavgai/deno-funcs/master/mod.ts'; console.log(await getTsConfig());" > tsconfig.json

