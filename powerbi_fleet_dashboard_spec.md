# Fleet Operations Power BI Dashboard

## Goal

Build a Power BI report that tracks:

- vehicle mileage,
- overdue service,
- speeding events,
- and rollups per company.

Use this design when the source data comes from fleet telematics, maintenance systems, spreadsheets, SQL exports, or API dumps.

## Recommended Data Model

Use a simple star schema.

### Fact tables

#### `FactVehicleDailyUsage`

One row per vehicle per day.

Columns:

- `DateKey`
- `VehicleKey`
- `CompanyKey`
- `DriverKey` optional
- `StartOdometer`
- `EndOdometer`
- `MilesDriven`
- `EngineHours` optional
- `TripCount`
- `MaxSpeed`
- `AvgSpeed`
- `IdleMinutes` optional

#### `FactServiceEvents`

One row per service job or inspection.

Columns:

- `ServiceEventKey`
- `VehicleKey`
- `CompanyKey`
- `ServiceTypeKey`
- `ServiceDate`
- `OdometerAtService`
- `NextServiceDueDate`
- `NextServiceDueMileage`
- `ServiceStatus`
- `ServiceCost`
- `VendorName`

#### `FactSpeedingEvents`

One row per speeding incident.

Columns:

- `SpeedingEventKey`
- `DateKey`
- `VehicleKey`
- `CompanyKey`
- `DriverKey` optional
- `SpeedLimit`
- `ActualSpeed`
- `OverLimitBy`
- `DurationSeconds` optional
- `Latitude` optional
- `Longitude` optional
- `SeverityBand`

### Dimension tables

#### `DimVehicle`

- `VehicleKey`
- `VehicleID`
- `PlateNumber`
- `VIN`
- `Make`
- `Model`
- `Year`
- `VehicleType`
- `Status`

#### `DimCompany`

- `CompanyKey`
- `CompanyName`
- `Region`
- `BusinessUnit` optional

#### `DimDriver`

- `DriverKey`
- `DriverName`
- `EmployeeID`
- `LicenseType`
- `Status`

#### `DimServiceType`

- `ServiceTypeKey`
- `ServiceTypeName`
- `IntervalDays`
- `IntervalMiles`
- `Priority`

#### `DimDate`

- `Date`
- `Year`
- `Quarter`
- `Month`
- `Week`
- `DayName`

## Key Relationships

- `FactVehicleDailyUsage[VehicleKey]` -> `DimVehicle[VehicleKey]`
- `FactVehicleDailyUsage[CompanyKey]` -> `DimCompany[CompanyKey]`
- `FactVehicleDailyUsage[DriverKey]` -> `DimDriver[DriverKey]`
- `FactVehicleDailyUsage[DateKey]` -> `DimDate[Date]`
- `FactServiceEvents[VehicleKey]` -> `DimVehicle[VehicleKey]`
- `FactServiceEvents[CompanyKey]` -> `DimCompany[CompanyKey]`
- `FactServiceEvents[ServiceTypeKey]` -> `DimServiceType[ServiceTypeKey]`
- `FactSpeedingEvents[VehicleKey]` -> `DimVehicle[VehicleKey]`
- `FactSpeedingEvents[CompanyKey]` -> `DimCompany[CompanyKey]`
- `FactSpeedingEvents[DriverKey]` -> `DimDriver[DriverKey]`
- `FactSpeedingEvents[DateKey]` -> `DimDate[Date]`

Keep filters single-direction from dimensions to facts unless there is a proven need for bi-directional filtering.

## Power Query Preparation

Clean the data before building measures:

- convert all date fields to proper date types,
- ensure odometer and mileage columns are numeric,
- standardize vehicle IDs across usage, service, and speeding sources,
- remove duplicate speeding events,
- normalize company names,
- create severity bands for speeding thresholds,
- and flag inactive vehicles separately from active fleet assets.

If multiple systems report mileage, define one trusted mileage source for reporting.

## Core Measures

Use these DAX measures as the starting set.

```DAX
Total Miles =
SUM(FactVehicleDailyUsage[MilesDriven])

Active Vehicles =
DISTINCTCOUNT(DimVehicle[VehicleKey])

Avg Miles Per Vehicle =
DIVIDE([Total Miles], [Active Vehicles])

Total Service Cost =
SUM(FactServiceEvents[ServiceCost])

Speeding Event Count =
COUNTROWS(FactSpeedingEvents)

Severe Speeding Event Count =
CALCULATE(
    [Speeding Event Count],
    FactSpeedingEvents[OverLimitBy] >= 15
)

Avg Over Speed Limit =
AVERAGE(FactSpeedingEvents[OverLimitBy])
```

## Overdue Service Logic

Track overdue service by both date and mileage.

If your service table already has `NextServiceDueDate` and `NextServiceDueMileage`, use these measures:

```DAX
Current Odometer =
SUMX(
    VALUES(DimVehicle[VehicleKey]),
    CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer]))
)

Vehicles Overdue By Date =
CALCULATE(
    DISTINCTCOUNT(FactServiceEvents[VehicleKey]),
    FactServiceEvents[NextServiceDueDate] < TODAY(),
    FactServiceEvents[ServiceStatus] <> "Completed"
)

Vehicles Overdue By Mileage =
CALCULATE(
    DISTINCTCOUNT(FactServiceEvents[VehicleKey]),
    FILTER(
        FactServiceEvents,
        FactServiceEvents[NextServiceDueMileage] <
            CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer]))
            &&
        FactServiceEvents[ServiceStatus] <> "Completed"
    )
)

Vehicles Overdue Total =
DISTINCTCOUNT(
    UNION(
        SELECTCOLUMNS(
            FILTER(
                FactServiceEvents,
                FactServiceEvents[NextServiceDueDate] < TODAY()
                    &&
                FactServiceEvents[ServiceStatus] <> "Completed"
            ),
            "VehicleKey", FactServiceEvents[VehicleKey]
        ),
        SELECTCOLUMNS(
            FILTER(
                FactServiceEvents,
                FactServiceEvents[NextServiceDueMileage] <
                    CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer]))
                    &&
                FactServiceEvents[ServiceStatus] <> "Completed"
            ),
            "VehicleKey", FactServiceEvents[VehicleKey]
        )
    )
)
```

If your source stores only last service date and interval values, calculate due date and due mileage in Power Query first to keep the DAX cleaner.

## Company-Level Measures

These are useful for comparison across companies.

```DAX
Miles Per Company =
[Total Miles]

Overdue Vehicles Per Company =
[Vehicles Overdue Total]

Speeding Events Per 1K Miles =
DIVIDE([Speeding Event Count] * 1000, [Total Miles])

Service Cost Per Mile =
DIVIDE([Total Service Cost], [Total Miles])
```

## Report Pages

### 1. Executive Overview

Purpose: Give fleet managers a fast company-level status check.

Visuals:

- KPI cards for `Total Miles`, `Active Vehicles`, `Vehicles Overdue Total`, `Speeding Event Count`
- clustered bar chart for miles by company
- stacked bar chart for overdue vehicles by company
- line chart for monthly total miles
- line chart for monthly speeding events
- slicers for company, vehicle type, date range

### 2. Mileage Tracking

Purpose: Show fleet usage intensity and identify high-mileage vehicles.

Visuals:

- line chart for miles over time
- bar chart for top 10 vehicles by miles driven
- matrix for company -> vehicle -> month
- scatter plot for miles vs service cost if cost data is reliable

### 3. Overdue Service

Purpose: Surface maintenance risk before downtime increases.

Visuals:

- KPI cards for overdue by date and overdue by mileage
- table with vehicle, company, current odometer, next due mileage, next due date, overdue status
- bar chart for overdue vehicles by service type
- donut chart for overdue severity bands such as due soon, overdue, critically overdue

### 4. Speeding Report

Purpose: Identify risky behavior by company, vehicle, or driver.

Visuals:

- KPI cards for total speeding events, severe speeding events, average over speed limit
- bar chart for speeding events by company
- bar chart for top vehicles with speeding incidents
- bar chart for top drivers with speeding incidents if driver data exists
- line chart for speeding trend over time
- map for event hotspots if latitude and longitude are present

### 5. Company Comparison

Purpose: Benchmark operating performance across companies.

Visuals:

- matrix with company, miles, overdue vehicles, speeding events, service cost, events per 1K miles
- scatter plot for miles vs speeding rate
- scatter plot for miles vs service cost per mile
- conditional formatting to highlight the worst-performing companies

## Slicers

Add these slicers to most pages:

- company,
- date range,
- vehicle type,
- vehicle status,
- service type,
- severity band.

## Suggested Alerts and Thresholds

Use conditional formatting to highlight:

- overdue by more than 30 days,
- overdue by more than 1,000 miles,
- speeding over limit by 15 mph or more,
- companies with speeding events per 1,000 miles above target.

## Data Quality Risks

Watch for these issues:

- odometer resets or rollovers,
- duplicate telematics events,
- vehicles moved between companies without history handling,
- missing service due dates,
- and speeding events without matched vehicle keys.

## Build Order

1. Load and clean the source data in Power Query.
2. Build dimensions first, then fact tables.
3. Create relationships and validate filter behavior.
4. Add core measures.
5. Build the Executive Overview page first.
6. Add detail pages for mileage, service, and speeding.
7. Finish with company comparison and conditional formatting.
