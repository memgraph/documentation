<h1 align="center"><a href="https://memgraph.com/docs/">Memgraph Documentation</a></h1>

<p align="center">
  <a href="https://memgraph.com/documentation/" alt="Documentation">
    <img src="https://img.shields.io/badge/documentation-Memgraph-orange" />
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
- [pnpm](https://pnpm.io/installation) 

### Run the development server

To preview your changes as you edit the files, you can run a local development
server that will serve your website and reflect the latest changes.

First instal `node` and `pnpm`. After that clone this repository:

```
git clone https://github.com/memgraph/documentation.git
```

Change the working directory to the one of the cloned repotitory and install the dependencies:

```bash
pnpm i
```

Now you can start the server:

```bash
pnpm dev
```

Open the URL [http://localhost:3000](http://localhost:3000) in your browser.

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
an [issue](https://github.com/memgraph/documentation/issues).

### Contributing guide

If you want to change the documentation, create a new branch and make
the appropriate changes. Then, create a pull request to merge these changes into the
`main` branch.

The pull request should describe the changes it's proposing and all checks must be completed. 

Add an appropriate label to the PR, either `status: draft` if you are still working on the PR, or `status: ready` if the PR is ready for review. 

When the PR is reviewed and approved, the label will be changed to `status: ship it` and merged into the main by the repo admins.

If the PR requires changes, the label will be changed to `status: change`. Address the comments and change the documentation appropriately, then re-request a review and change the label to `status: ready` again. 