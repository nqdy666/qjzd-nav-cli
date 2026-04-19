# QJZD Nav CLI Skills

This directory is a flat skill namespace for QJZD Nav CLI.

Recommended loading order for agents:

1. `qjzd-nav-cli` when the task is broad or mixed.
2. `qjzd-nav-cli-auth` when authentication or profile setup is needed.
3. `qjzd-nav-cli-content` for links, categories, and tags management.
4. `qjzd-nav-cli-operations` for backup, restore, and settings management.

Design goals:

- trigger-oriented descriptions for better skill discovery
- minimal frontmatter for Codex-compatible loading
- command-accurate examples aligned with the current CLI
- explicit routing between skills instead of hidden coupling
