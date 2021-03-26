# Tic Tac Toe Test

Mostly want to test a complete deno project.

## how to bundle

    deno bundle -c ./tsconfig.json ./src/mod.ts ./dist/script.js

## setup

### Need some DOM

```bash
wget https://raw.githubusercontent.com/microsoft/TypeScript/master/lib/lib.dom.d.ts
```

```powershell
(Invoke-WebRequest -UseBasicParsing -Uri https://raw.githubusercontent.com/microsoft/TypeScript/master/lib/lib.dom.d.ts).Content > lib.dom.d.ts
```

### Use our template generator

    deno eval "import { getTsConfig } from 'https://raw.githubusercontent.com/Baavgai/deno-funcs/master/mod.ts'; console.log(await getTsConfig());" > tsconfig.json
