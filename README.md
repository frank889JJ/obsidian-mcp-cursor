# Obsidian MCP for Cursor

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server implementation for Cursor IDE, enabling AI assistants to interact with Obsidian vaults, providing tools for reading, creating, editing and managing notes and tags.

[中文文档](README_CN.md)

## Warning!!!

This MCP has read and write access to your Obsidian vault. Please make sure to backup your vault before using this tool. We recommend using git or any other backup method you prefer. While the tools have been tested, they are still in development.

## Features

- Read and search notes in your vault
- Create new notes and directories
- Edit existing notes
- Move and delete notes
- Manage tags (add, remove, rename)
- Search vault contents
- Seamless integration with Cursor IDE
- Customizable prompt system

## Requirements

- Python 3.8 or higher
- An Obsidian vault
- Cursor IDE

## Installation

1. Clone the repository:
```bash
git clone https://github.com/frank889JJ/obsidian-mcp-cursor.git
cd obsidian-mcp-cursor
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure settings:
- Copy `config/cline_mcp_settings.example.json` to `config/cline_mcp_settings.json`
- Edit the configuration file with your settings:
  ```json
  {
      "obsidian": {
          "vault_path": "/path/to/your/vault",
          "api_port": 27124
      },
      "cursor": {
          "api_port": 27125,
          "host": "localhost"
      },
      "server": {
          "host": "0.0.0.0",
          "port": 27126,
          "debug": false
      }
  }
  ```
  Replace `/path/to/your/vault` with the absolute path to your Obsidian vault. For example:

  MacOS/Linux:
  ```json
  "/Users/username/Documents/MyVault"
  ```

  Windows:
  ```json
  "C:\\Users\\username\\Documents\\MyVault"
  ```

## Usage

1. Start the MCP server:
```bash
python src/server.py
```

2. Configure Cursor IDE to connect to the MCP server:
- Open Cursor IDE settings
- Set up the MCP connection parameters
- Test the connection

3. Start using AI features with your knowledge base:
- Access your notes through AI commands
- Use enhanced context in conversations
- Leverage your knowledge base for better AI interactions

## Available Tools

- `read-note` - Read the contents of a note
- `create-note` - Create a new note
- `edit-note` - Edit an existing note
- `delete-note` - Delete a note
- `move-note` - Move a note to a different location
- `create-directory` - Create a new directory
- `search-vault` - Search notes in the vault
- `add-tags` - Add tags to a note
- `remove-tags` - Remove tags from a note
- `rename-tag` - Rename a tag across all notes
- `manage-tags` - List and organize tags

## Security

This server requires access to your Obsidian vault directory. When configuring the server, make sure to:
- Only provide access to your intended vault directory
- Review tool actions before approving them
- Keep your configuration file secure

## Troubleshooting

Common issues:

1. **Server Connection Issues**
   - Verify your configuration file syntax
   - Make sure the vault path is absolute and exists
   - Check if the specified ports are available

2. **Permission Errors**
   - Ensure the vault path is readable/writable
   - Check file permissions in your vault

3. **Tool Execution Failures**
   - Check server logs for detailed error messages
   - Verify your Python environment setup
   - Ensure all dependencies are correctly installed

## Note

This project was modified and enhanced with the assistance of Cursor AI, adapting the original Obsidian MCP implementation for the Cursor IDE environment.

## Acknowledgments

This project is based on [StevenStavrakis/obsidian-mcp](https://github.com/StevenStavrakis/obsidian-mcp). Special thanks to the original author [@StevenStavrakis](https://github.com/StevenStavrakis) for their outstanding work. The original project provides an excellent MCP server implementation for Obsidian, enabling AI assistants to interact with Obsidian knowledge bases.

Improvements made in this project include:
- Adaptation for Cursor IDE environment
- Optimized configuration process
- Added Chinese documentation support
- Enhanced error handling mechanisms

## License

MIT 