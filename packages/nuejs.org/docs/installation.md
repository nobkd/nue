
# Get started with Nue

## 1. Install Bun
First, install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

Nue uses Bun for its superior web standards support, including native CSS parsing. Check details on why Nue prefers Bun over Node.js from our [FAQ](faq.html).


## 2. Install Nue
Next, install Nue globally:

```sh
# Install Nue
bun install nuekit --global
```

Nue uses global installation because it is a command line tool like Git or Docker. Just go to a directory and type `nue` to develop.


## 3. Install app
Create your first app with:

```sh
nue create simple-blog
```

Alternatively, start with a multi-page app

```sh
nue create simple-mpa
```

Done! Your browser should now open to: `http://localhost:8083/`:


- - -

## Details

### System Requirements

- **Bun 1.0.10** or later. Recommended for *macOS* and *Linux*.
- **Node.js 18.0.2** or later. Recommended for *Windows* or if you prefer not to use Bun.


### Windows support
Our Windows tests pass, the support is uncertain. Nobody on our team uses it actively.


### Having Problems?
Please post an [issue](//github.com/nuejs/nue/issues)


## Node Setup
If you prefer to install Nue with `pnpm`, `npm`, or `yarn`, use:

```sh
pnpm install nuekit --global
```

The default engine is Bun, so the command line interface starts with `#!/usr/bin/env bun`. To override the shebang with Node, run:

```sh
node $(which nue)
```

To make this command permanent, add the following alias to your `~/.bashrc` or `~/.zshrc` file:

```sh
alias node-nue="node $(which nue)"
```
