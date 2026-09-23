{
  description = "Mushymon - Mushroom Tracker Development Environment and Package";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages.default = pkgs.buildNpmPackage {
          pname = "mushymon";
          version = "0.1.0";

          src = ./.;

          # We can use a fake hash to get the real one, or run prefetch-npm-deps
          npmDepsHash = "sha256-k5J2fNslPZazPlDmEzgUNjeb4xAOAChJnBcqyCAH5AU=";

          nativeBuildInputs = with pkgs; [
            python3
            pkg-config
            gnumake
            gcc
          ];

          buildInputs = with pkgs; [
            sqlite
            openssl
          ];

          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            runHook preInstall
            
            mkdir -p $out/share/mushymon
            cp -r .next/standalone/* $out/share/mushymon/
            
            # Next.js standalone doesn't include the public folder or static folder by default
            cp -r .next/static $out/share/mushymon/.next/static
            cp -r public $out/share/mushymon/public

            # Create a wrapper script to run it
            mkdir -p $out/bin
            cat <<SCRIPT > $out/bin/mushymon
            #!/bin/sh
            cd $out/share/mushymon
            exec ${pkgs.nodejs_22}/bin/node server.js "\$@"
            SCRIPT
            chmod +x $out/bin/mushymon
            
            runHook postInstall
          '';
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            sqlite
            openssl
            python3
            pkg-config
            gnumake
            gcc
          ];

          shellHook = ''
            echo "🍄 Mushymon development environment loaded!"
          '';
        };
      }
    );
}
