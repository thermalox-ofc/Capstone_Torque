# DAX Measures

Create these measures after importing the CSV files and building relationships.

## Date Table

Create the date table first:

```DAX
DimDate =
ADDCOLUMNS(
    CALENDAR(DATE(2026, 1, 1), DATE(2026, 12, 31)),
    "Year", YEAR([Date]),
    "Quarter", "Q" & FORMAT([Date], "Q"),
    "MonthNumber", MONTH([Date]),
    "Month", FORMAT([Date], "MMM"),
    "Week", WEEKNUM([Date], 2),
    "DayName", FORMAT([Date], "DDD")
)
```

Mark `DimDate` as the date table using the `Date` column.

## Core Measures

```DAX
Total Miles =
SUM(FactVehicleDailyUsage[MilesDriven])

Active Vehicles =
CALCULATE(
    DISTINCTCOUNT(DimVehicle[VehicleKey]),
    DimVehicle[Status] = "Active"
)

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

Avg Miles Per Vehicle =
DIVIDE([Total Miles], [Active Vehicles])

Speeding Events Per 1K Miles =
DIVIDE([Speeding Event Count] * 1000, [Total Miles])

Service Cost Per Mile =
DIVIDE([Total Service Cost], [Total Miles])
```

## Current Odometer

Use this for vehicle-level service comparisons:

```DAX
Current Odometer =
MAX(FactVehicleDailyUsage[EndOdometer])
```

## Overdue Service Measures

These measures assume one open service row per due item.

```DAX
Vehicles Overdue By Date =
CALCULATE(
    DISTINCTCOUNT(FactServiceEvents[VehicleKey]),
    FactServiceEvents[NextServiceDueDate] < TODAY(),
    FactServiceEvents[ServiceStatus] <> "Completed"
)

Vehicles Overdue By Mileage =
COUNTROWS(
    FILTER(
        VALUES(DimVehicle[VehicleKey]),
        CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer])) >
            CALCULATE(
                MAX(FactServiceEvents[NextServiceDueMileage]),
                FactServiceEvents[ServiceStatus] <> "Completed"
            )
    )
)

Vehicles Overdue Total =
COUNTROWS(
    FILTER(
        VALUES(DimVehicle[VehicleKey]),
        CALCULATE(
            MAX(FactServiceEvents[NextServiceDueDate]),
            FactServiceEvents[ServiceStatus] <> "Completed"
        ) < TODAY()
            ||
        CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer])) >
            CALCULATE(
                MAX(FactServiceEvents[NextServiceDueMileage]),
                FactServiceEvents[ServiceStatus] <> "Completed"
            )
    )
)
```

## Company Comparison Measures

```DAX
Miles Per Company =
[Total Miles]

Overdue Vehicles Per Company =
[Vehicles Overdue Total]

Severe Events Per 1K Miles =
DIVIDE([Severe Speeding Event Count] * 1000, [Total Miles])
```

## Optional Severity Label

If you want a text label in a card or table:

```DAX
Service Status Label =
VAR DueDate =
    CALCULATE(
        MAX(FactServiceEvents[NextServiceDueDate]),
        FactServiceEvents[ServiceStatus] <> "Completed"
    )
VAR DueMileage =
    CALCULATE(
        MAX(FactServiceEvents[NextServiceDueMileage]),
        FactServiceEvents[ServiceStatus] <> "Completed"
    )
VAR CurrentMileage =
    CALCULATE(MAX(FactVehicleDailyUsage[EndOdometer]))
RETURN
SWITCH(
    TRUE(),
    ISBLANK(DueDate) && ISBLANK(DueMileage), "No Open Service",
    DueDate < TODAY() || CurrentMileage > DueMileage, "Overdue",
    DueDate <= TODAY() + 14 || CurrentMileage >= DueMileage - 500, "Due Soon",
    "On Schedule"
)
```
