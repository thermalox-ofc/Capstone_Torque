# Power BI Fleet Starter Pack

This folder gives you the three things needed to build the fleet dashboard in Power BI Desktop:

- sample CSV data in `data/`
- a DAX measure pack in `dax_measures.md`
- a step-by-step Power BI build checklist in `build_checklist.md`

## Files

- `data/dim_company.csv`
- `data/dim_vehicle.csv`
- `data/dim_driver.csv`
- `data/dim_service_type.csv`
- `data/fact_vehicle_daily_usage.csv`
- `data/fact_service_events.csv`
- `data/fact_speeding_events.csv`
- `dax_measures.md`
- `build_checklist.md`
- `report_pages.md`

## Suggested Import Order

1. Import all `dim_*.csv` files.
2. Import all `fact_*.csv` files.
3. Create a proper `DimDate` table inside Power BI with DAX.
4. Build relationships.
5. Add measures from `dax_measures.md`.
6. Build visuals using `report_pages.md`.

## Notes

- `DateKey` columns use `YYYY-MM-DD`.
- `VehicleKey`, `CompanyKey`, and `DriverKey` are the join keys.
- The sample data includes overdue service and speeding incidents so the dashboard has meaningful results immediately.
