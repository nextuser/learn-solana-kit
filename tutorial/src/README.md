# test

```shell
 pnpm add @solana/kist tsx
 pnpm i --save-dev @types/node
 pnpm install -g typescript@latest
 nvm use lts/krypton


```
- 需要 typescript 5.x

# 配置helius api key，才能访问相关节点

```bash
 cat ./.env
HELIUS_API_KEY=8e3be8c1...

source ./.env
npx tsx src/index.tsx
```