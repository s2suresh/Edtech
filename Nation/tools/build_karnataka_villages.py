import argparse
import csv
import json
from pathlib import Path


FIELD_ALIASES = {
    "district": ["district", "district_name", "zilla", "zilla_name"],
    "taluk": ["taluk", "taluk_name", "sub_district", "sub_district_name", "subdistrict_name"],
    "hobli": ["hobli", "hobli_name", "hobali", "hobali_name"],
    "village": ["village", "village_name", "village_name_english"],
}


def normalize(value):
    return " ".join((value or "").strip().split())


def get_value(row, field):
    for key in FIELD_ALIASES[field]:
        if key in row and normalize(row[key]):
            return normalize(row[key])
    return ""


def find_or_add(items, name, child_key):
    for item in items:
        if item["name"].casefold() == name.casefold():
            return item
    item = {"name": name, child_key: []}
    items.append(item)
    return item


def build_tree(csv_path):
    districts = []

    with csv_path.open(newline="", encoding="utf-8-sig") as csv_file:
        reader = csv.DictReader(csv_file)
        reader.fieldnames = [field.strip().lower().replace(" ", "_") for field in reader.fieldnames]

        for row in reader:
            district_name = get_value(row, "district")
            taluk_name = get_value(row, "taluk")
            hobli_name = get_value(row, "hobli")
            village_name = get_value(row, "village")

            if not district_name or not taluk_name or not village_name:
                continue

            district = find_or_add(districts, district_name, "taluks")
            taluk = find_or_add(district["taluks"], taluk_name, "hoblis")
            hobli = find_or_add(taluk["hoblis"], hobli_name or "Unmapped Hobli", "villages")

            if village_name not in hobli["villages"]:
                hobli["villages"].append(village_name)

    for district in districts:
        district["taluks"].sort(key=lambda item: item["name"])
        for taluk in district["taluks"]:
            taluk["hoblis"].sort(key=lambda item: item["name"])
            for hobli in taluk["hoblis"]:
                hobli["villages"].sort()

    districts.sort(key=lambda item: item["name"])
    return districts


def merge_tree(base_districts, incoming_districts):
    for incoming_district in incoming_districts:
        district = find_or_add(base_districts, incoming_district["name"], "taluks")

        for incoming_taluk in incoming_district["taluks"]:
            taluk = find_or_add(district["taluks"], incoming_taluk["name"], "hoblis")

            for incoming_hobli in incoming_taluk["hoblis"]:
                hobli = find_or_add(taluk["hoblis"], incoming_hobli["name"], "villages")

                for village in incoming_hobli["villages"]:
                    if village not in hobli["villages"]:
                        hobli["villages"].append(village)

    for district in base_districts:
        district["taluks"].sort(key=lambda item: item["name"])
        for taluk in district["taluks"]:
            taluk["hoblis"].sort(key=lambda item: item["name"])
            for hobli in taluk["hoblis"]:
                hobli["villages"].sort()

    base_districts.sort(key=lambda item: item["name"])
    return base_districts


def main():
    parser = argparse.ArgumentParser(description="Build Karnataka admission dropdown JSON from verified CSV data.")
    parser.add_argument("csv", type=Path, help="CSV with district, taluk, hobli, and village columns.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "karnataka_villages.json",
        help="Output JSON path.",
    )
    parser.add_argument(
        "--merge-existing",
        action="store_true",
        help="Merge CSV rows into the existing output JSON instead of replacing the whole Karnataka file.",
    )
    args = parser.parse_args()

    districts = build_tree(args.csv)

    if args.merge_existing and args.output.exists():
        existing = json.loads(args.output.read_text(encoding="utf-8"))
        districts = merge_tree(existing.get("districts", []), districts)

    data = {
        "schemaVersion": "1.0",
        "country": "India",
        "state": {"name": "Karnataka", "code": "KA"},
        "dataStatus": "Generated or merged from verified source data. Review source date and coverage before production use.",
        "dropdownOrder": ["state", "district", "taluk", "hobli", "village"],
        "districts": districts,
    }

    args.output.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
