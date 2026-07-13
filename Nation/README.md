# Nation Location Data

This folder stores state-wise location data for admission dropdowns.

## Current files

- `karnataka_villages.json`: Karnataka state dropdown data in the order state -> district -> taluk -> hobli -> village.

## Data rules

- Add one JSON file per state when more states are needed.
- Keep the same schema so the webpage can load each state file without custom code.
- Expand taluk, hobli, and village data only from official or verified government sources.
- Do not add student or enquiry response data in this folder.
