# Nation Location Data

This folder stores state-wise location data for admission dropdowns.

## Current files

- `karnataka_villages.json`: Karnataka state dropdown data in the order state -> district -> taluk -> hobli -> village. Districts and taluks are seeded; hoblis and villages should be completed from verified government data.
- `states_index.json`: India state and union territory index with district seed lists. Karnataka points to the active state file for deeper data.
- `tools/build_karnataka_villages.py`: Import helper to generate the Karnataka JSON from a verified CSV export.

## Completing Karnataka Hoblis And Villages

Taluk-level data is available for Karnataka. To complete hobli and village dropdowns, use an official or verified source export that includes these columns:

- `district`
- `taluk`
- `hobli`
- `village`

Useful official/verified sources to collect data from:

- Local Government Directory, Government of India: https://lgdirectory.gov.in/
- Karnataka SSLR Revenue Maps Online: https://landrecords.karnataka.gov.in/service3
- Karnataka Panchatantra Village Master: https://panchatantra.karnataka.gov.in/USER_MODULE/commonMaster/loadMstVillage

After preparing a CSV, generate the JSON with:

```powershell
python Nation/tools/build_karnataka_villages.py path/to/karnataka_verified_locations.csv
```

The script writes to `Nation/karnataka_villages.json` by default.

## Data rules

- Add one JSON file per state when more states are needed.
- Keep the same schema so the webpage can load each state file without custom code.
- Keep state and district lists in `states_index.json` for first-level dropdown support.
- Expand taluk, hobli, and village data only from official or verified government sources.
- Do not add student or enquiry response data in this folder.
