{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs = {nixpkgs, ...}: let
    forAllSystems = function:
      nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
        system: function nixpkgs.legacyPackages.${system}
      );
  in {
    formatter = forAllSystems (pkgs: pkgs.alejandra);
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShellNoCC {
        packages = with pkgs; [
          corepack
          nodejs_26
        ];

        shellHook = ''
          export COREPACK_HOME="$PWD/.corepack"
          export PATH="$COREPACK_HOME/bin:$PATH"
          if [[ ! -x "$COREPACK_HOME/bin/pnpm" ]]; then
            mkdir -p "$COREPACK_HOME/bin"
            corepack enable --install-directory "$COREPACK_HOME/bin" pnpm
          fi
        '';
      };
    });
  };
}
