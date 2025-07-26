{
  description = "A nix-flake-based ghost-shell development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-root.url = "github:srid/flake-root";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{
      self,
      nixpkgs,
      flake-parts,
      flake-root,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ 
        flake-root.flakeModule 
      ];

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      perSystem =
        {
          pkgs,
          lib,
          config,
          system,
          ...
        }:
        {
          _module.args.pkgs = import nixpkgs {
            inherit system;
            config = {
              allowUnfree = true;
            };
          };

          devShells.default = pkgs.mkShell {
            inputsFrom = [ config.flake-root.devShell ];

            packages = with pkgs; [
              bun
            ];

            env = {
            };

            shellHook = ''
              echo "GhostShell Development Environment"
            '';
          };
        };
    };
}
