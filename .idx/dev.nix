{ pkgs, ... }: {
  channel = "stable-24.05"; # For consistency

  # Use the latest stable nodejs
  packages = [ pkgs.nodejs_20 ];

  # Set environment variables
  env = {
    # Add your environment variables here
  };

  idx = {
    # VS Code extensions
    extensions = [
      "vscodevim.vim"
      "dbaeumer.vscode-eslint"
    ];

    workspace = {
      # Commands to run when the workspace is created
      onCreate = {
        install-deps = "npm install --legacy-peer-deps"; # Use legacy peer dependency resolution to avoid conflicts
      };

      # Commands to run when the workspace is started
      onStart = {
        # Start the backend server
        start-backend = "npm run start:backend";
        # Start the frontend dev server
        start-frontend = "npm run dev";
      };
    };

    # Previews
    previews = {
      enable = true;
      previews = {
        # The web preview
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
