{ pkgs, ... }:
{
  # Using stable-24.05 for a reliable build.
  channel = "stable-24.05";

  # The configuration has been stripped down to a minimal Node.js environment
  # to isolate the source of the persistent 'bwrap' build error.
  packages = [
    pkgs.nodejs_20
  ];

  idx = {
    extensions = [
      "vscodevim.vim"
      "dbaeumer.vscode-eslint"
      "ms-python.python"
    ];

    workspace = {
      onCreate = {
        install-npm-deps = "npm install --legacy-peer-deps";
      };

      onStart = {
        start-backend = "npm run start:backend";
        start-frontend = "npm run dev";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
