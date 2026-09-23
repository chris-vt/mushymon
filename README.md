# Mushymon

Mushymon is a Next.js web application built with React, Tailwind CSS, and Drizzle ORM. It integrates a local SQLite database and uses Leaflet for mapping features.

## Architecture & Tech Stack

- **Framework**: Next.js 16
- **Database**: SQLite (via `better-sqlite3`)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet / React-Leaflet

## Installation (NixOS Flake)

Mushymon is packaged as a Nix Flake, allowing you to easily deploy it directly to your declarative NixOS systems or containers.

1. Add the repository to your flake `inputs`:
```nix
inputs = {
  # ... your other inputs
  mushymon.url = "github:chris-vt/mushymon?ref=v1.0.0";
};
```

2. Add the package to your system or container configuration and set up a systemd service to run the Next.js standalone server:
```nix
{ config, pkgs, inputs, ... }: {
  # Deploy inside a declarative NixOS Container (or direct system)
  containers.mushymon = {
    autoStart = true;
    config = {
      environment.systemPackages = [
        inputs.mushymon.packages.${pkgs.system}.default
      ];

      # Launch the Next.js standalone app
      systemd.services.mushymon = {
        description = "Mushymon Next.js App";
        wantedBy = [ "multi-user.target" ];
        after = [ "network.target" ];
        environment = {
          PORT = "3000";
          NODE_ENV = "production";
        };
        serviceConfig = {
          # The derivation creates a convenient wrapper script in /bin/mushymon
          ExecStart = "${inputs.mushymon.packages.${pkgs.system}.default}/bin/mushymon";
          Restart = "always";
        };
      };
      
      networking.firewall.allowedTCPPorts = [ 3000 ];
    };
  };
}
```

## Local Development

If you'd like to develop or contribute to Mushymon locally, this project provides a Nix `devShell` containing all the necessary tools.

1. Enter the development environment using `nix develop` (or by allowing the included `.envrc` via `direnv`).
2. Switch to the `dev` branch to access the test database fixture (`fixtures/dev.db`).
3. Install the dependencies and start the Next.js dev server:
   ```bash
   npm install
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Branching Strategy

- `main`: Stable release branch. Deploys hermetically via Nix.
- `dev`: Development branch. All new features and DB fixtures merge here first.
