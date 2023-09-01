<h1 align="center"><a href="https://memgraph.com/docs/">Memgraph Documentation</a></h1>

<p align="center">
  <a href="https://github.com/memgraph/docs">
    <img src="https://img.shields.io/github/actions/workflow/status/memgraph/docs/deploy.yml" alt="build" title="build"/>
  </a>
  <a href="https://memgraph.com/docs/" alt="Documentation">
    <img src="https://img.shields.io/badge/documentation-Memgraph-orange" />
  </a>
  <a href="https://github.com/memgraph/docs/blob/master/CONTRIBUTING.md" alt="PRs Welcome">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  </a>
</p>

<p align="center">
  <a href="https://memgr.ph/join-discord">
    <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"/>
  </a>
  <a href="https://stackoverflow.com/questions/tagged/memgraphdb">
    <img src="https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white" alt="Stack Overflow"/>
  </a>
</p>

<p align="center">
  <a href="https://memgraph.com/docs">
    <img src="https://public-assets.memgraph.com/github-readme-images/docs.memgraph-browser.png" 
         alt="memgraph-docs" 
         title="memgraph-docs"
         style="width: 60%"/>
  </a>
</p>

This repository contains the source files and various generators for the
Memgraph documentation available at
[memgraph.com/docs](https://memgraph.com/docs).

## :hammer_and_wrench: Run docs locally

To run the documentation website locally, you will need to install:

- [Node.js](https://nodejs.org/en/download/) version >= 16.0.0 or above (which
  can be checked by running `node -v`). You can use
  [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node versions on a
  single machine installed.

### Run the development server

To preview your changes as you edit the files, you can run a local development
server that will serve your website and reflect the latest changes.

Install pnpm:

```
npm install -g pnpm
```

Install the dependencies:

```bash
pnpm i
```

Start the server:

```bash
pnpm dev
```

By default, a browser window will open at
[http://localhost:3000](http://localhost:3000).

## :construction: Build

Install the dependencies:

```bash
pnpm i
```

Build the website:

```bash
pnpm build
```

Contents will be generated within the `/build` directory. 

Test your build locally:

```bash
pnpm start
```

## :writing_hand: Contribute

We are grateful for any community contributions to the documentation, as they are
the best way of improving the overall user experience. If at any point you
believe that something is misleading, could be worded better, or is missing
additional information, then please feel free to make a pull request or report
an [issue](https://github.com/memgraph/docs/issues).

### Contributing guide

If you want to contribute to the documentation, please take a look at
[CONTRIBUTING](./CONTRIBUTING.md) guide. It contains a detailed overview of the
documentation structure and instructions on making changes to
the content.

For more information about the writing style and the main ideas behind the
documentation structure, take a look at the [WRITING STYLE](./WRITING_STYLE.md)
guide.



// do we need this

## Quick Start

Click the button to clone this repository and deploy it on Vercel:

[![](https://vercel.com/button)](https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fshuding%2Fnextra-docs-template&showOptionalTeamCreation=false)

## License

This project is licensed under the MIT License.
