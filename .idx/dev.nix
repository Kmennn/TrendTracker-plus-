{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.vite
    pkgs.git
    pkgs.firebase-tools
    pkgs.google-cloud-sdk
  ];
  idx = {
    extensions = ["dbaeumer.vscode-eslint"];
    workspace = {
      onCreate = {npm-install = "npm install";};
      onStart = {
        dev-server = "npm run dev";
        backend-service = "node backend/server.js"; # New line to start the backend
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
