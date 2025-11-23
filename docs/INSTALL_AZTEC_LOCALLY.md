# Installing Aztec Locally

This document explains how to install and set up Aztec tooling for Hidden Garden development, following the official Aztec starter patterns.

## Prerequisites

- Node.js v22.15.0 (see `.nvmrc`)
- Docker (for running sandbox/devnet)
- `nvm` (Node Version Manager) - recommended

## Installation Steps

### 1. Install Aztec CLI

Run the official Aztec installer:

```bash
bash -i <(curl -s https://install.aztec.network)
```

This will install the `aztec` CLI tool globally.

### 2. Pin Aztec Version

For Hidden Garden, we use Aztec v3.0.0-devnet.5. Set the version:

```bash
export VERSION=3.0.0-devnet.5
aztec-up && docker pull aztecprotocol/aztec:$VERSION && docker tag aztecprotocol/aztec:$VERSION aztecprotocol/aztec:latest
```

### 3. Verify Installation

Check that Aztec CLI is installed:

```bash
aztec --version
```

You should see version information for the installed Aztec CLI.

## Running Aztec Sandbox/Devnet

### Option 1: Docker (Recommended for Demo)

Run the public sandbox image:

```bash
docker run -it -p 8080:8080 aztecprotocol/sandbox:latest
```

This starts a sandbox instance accessible at `http://localhost:8080`.

### Option 2: Aztec CLI

Use the Aztec CLI to start a sandbox:

```bash
aztec start --sandbox
```

Or for devnet:

```bash
aztec start --devnet
```

## Environment Variables

After installation, set these environment variables:

```bash
# For sandbox (default)
export AZTEC_ENV=sandbox
export AZTEC_PXE_URL=http://localhost:8080
export NEXT_PUBLIC_AZTEC_PXE_URL=http://localhost:8080

# For devnet
export AZTEC_ENV=devnet
export AZTEC_PXE_URL=<devnet-pxe-url>
export NEXT_PUBLIC_AZTEC_PXE_URL=<devnet-pxe-url>
```

## Troubleshooting

### PXE Connection Issues

If you can't connect to the PXE:

1. Verify Docker is running: `docker ps`
2. Check if sandbox container is running: `docker ps | grep aztec`
3. Test PXE endpoint: `curl http://localhost:8080`
4. Check logs: `docker logs <container-id>`

### Node Version Issues

Ensure you're using Node v22.15.0:

```bash
nvm use  # Uses .nvmrc
node --version  # Should show v22.15.0
```

### CLI Not Found

If `aztec` command is not found:

1. Restart your terminal
2. Check your PATH: `echo $PATH`
3. Re-run the installer if needed

## Next Steps

After installation:

1. Start the sandbox/devnet (see above)
2. Configure environment variables
3. Run `pnpm install` to install project dependencies
4. Start the development server: `pnpm dev:web`

## References

- [Aztec Starter Repository](https://github.com/AztecProtocol/aztec-starter)
- [Aztec Documentation](https://docs.aztec.network)
- [Noir Documentation](https://noir-lang.org)

