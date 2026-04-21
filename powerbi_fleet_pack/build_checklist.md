# Power BI Desktop Build Checklist

## 1. Import Data

Load these CSV files with `Get Data` -> `Text/CSV`:

- `dim_company.csv`
- `dim_vehicle.csv`
- `dim_driver.csv`
- `dim_service_type.csv`
- `fact_vehicle_daily_usage.csv`
- `fact_service_events.csv`
- `fact_speeding_events.csv`

## 2. Fix Data Types

Confirm these data types:

- all `*Key` columns as whole number except `DateKey`
- `DateKey`, `ServiceDate`, and `NextServiceDueDate` as date
- `MilesDriven`, `StartOdometer`, `EndOdometer`, `ServiceCost`, `SpeedLimit`, `ActualSpeed`, and `OverLimitBy` as decimal or whole number
- latitude and longitude as decimal number

## 3. Create Date Table

Create `DimDate` using the DAX in [dax_measures.md](/Users/beofam/Downloads/automotive-repair-management-system-main/powerbi_fleet_pack/dax_measures.md).

## 4. Build Relationships

Create these relationships:

- `fact_vehicle_daily_usage[VehicleKey]` -> `dim_vehicle[VehicleKey]`
- `fact_vehicle_daily_usage[CompanyKey]` -> `dim_company[CompanyKey]`
- `fact_vehicle_daily_usage[DriverKey]` -> `dim_driver[DriverKey]`
- `fact_vehicle_daily_usage[DateKey]` -> `DimDate[Date]`
- `fact_service_events[VehicleKey]` -> `dim_vehicle[VehicleKey]`
- `fact_service_events[CompanyKey]` -> `dim_company[CompanyKey]`
- `fact_service_events[ServiceTypeKey]` -> `dim_service_type[ServiceTypeKey]`
- `fact_speeding_events[VehicleKey]` -> `dim_vehicle[VehicleKey]`
- `fact_speeding_events[CompanyKey]` -> `dim_company[CompanyKey]`
- `fact_speeding_events[DriverKey]` -> `dim_driver[DriverKey]`
- `fact_speeding_events[DateKey]` -> `DimDate[Date]`

Use single-direction filtering from dimension to fact.

## 5. Add Measures

Create all measures from [dax_measures.md](/Users/beofam/Downloads/automotive-repair-management-system-main/powerbi_fleet_pack/dax_measures.md).

## 6. Build Report Pages

Follow the visual plan in [report_pages.md](/Users/beofam/Downloads/automotive-repair-management-system-main/powerbi_fleet_pack/report_pages.md).

## 7. Apply Formatting

- use red for overdue and severe speeding
- use amber for due soon and medium speeding
- use blue or green for normal fleet KPIs
- enable data labels where helpful
- sort company charts descending by total miles or event count

## 8. Add Slicers

Add these slicers to the main pages:

- company
- date range
- vehicle type
- driver
- severity band
- service type

## 9. Validate Results

Check that the sample data produces these outcomes:

- company 3 has the highest mileage
- company 3 has the most severe speeding incidents
- vehicle 101, 103, and 105 should show overdue service pressure
- inactive vehicle 106 should not inflate active fleet KPIs

## 10. Publish

After validation:

1. save the report locally,
2. publish to Power BI Service,
3. configure scheduled refresh if you replace the sample CSVs with live data,
4. pin key visuals to a dashboard if leadership wants a one-screen summary.
