{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.vite
    pkgs.git
    pkgs.firebase-tools
    pkgs.google-cloud-sdk
  ];
  # Environment variables for the workspace
  env = {
    PROJECT_ID = "trendtracker-48f9a";
    LOCATION = "us-central1";
    # Set the path to the service account credentials file.
    # This is used by the Google Cloud client library to authenticate.
    GOOGLE_APPLICATION_CREDENTIALS = "serviceAccountKey.json";
  };
  idx = {
    extensions = ["dbaeumer.vscode-eslint"];
    workspace = {
      onCreate = {npm-install = "npm install";};
      onStart = {
        dev-server = "npm run dev";
        backend-service = "npm run start:backend > backend.log 2>&1";
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
