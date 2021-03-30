export default new Map([
    {
        "options": [
            {
                "label": "All Settings",
                "value": 0
            },
            {
                "label": "Ambulatory Care",
                "value": 2
            },
            {
                "label": "Correctional Facility",
                "value": 8
            },
            {
                "label": "Home Health/Hospice",
                "value": 4
            },
            {
                "label": "Hospital",
                "value": 1
            },
            {
                "label": "Mental Health Hospital/Facility",
                "value": 7
            },
            {
                "label": "Nursing Education",
                "value": 6
            },
            {
                "label": "Nursing Home/Extended Care/Assistive Living",
                "value": 3
            },
            {
                "label": "Community and Population Health",
                "value": 5
            }
        ],
        "label": "Setting",
        "name": "setting"
    },
    {
        "options": [
            { "value": 0, "label": "State" },
            { "value": 8, "label": "Medicaid Region" },
            { "value": 5, "label": "AHEC" },
            { "value": 7, "label": "Metro/Nonmetro" },
        ], "label": "Location Type", "name": "locationType"
    },
    {
        "options": [
            { "value": "supply", "label": "Supply" },
            { "value": "demand", "label": "Demand" },
            { "value": "ratio", "label": "Supply / Demand" },
            { "value": "difference", "label": "Supply - Demand" },
        ], "label": "Calculation", "name": "calculation"
    },
    {
        "options": [
            {
                "value": 0,
                "label": "All NC"
            },
            {
                "value": 800,
                "label": "Western NC (1)"
            },
            {
                "value": 801,
                "label": "Northwest / Triad (2)"
            },
            {
                "value": 802,
                "label": "Southcentral / Charlotte (3)"
            },
            {
                "value": 803,
                "label": "Piedmont / Triangle (4)"
            },
            {
                "value": 804,
                "label": "Southeast / Wilmington (5)"
            },
            {
                "value": 805,
                "label": "Eastern NC (6)"
            },
            {
                "value": 500,
                "label": "Area L"
            },
            {
                "value": 501,
                "label": "Charlotte AHEC"
            },
            {
                "value": 503,
                "label": "Eastern"
            },
            {
                "value": 504,
                "label": "Greensboro"
            },
            {
                "value": 505,
                "label": "Mountain"
            },
            {
                "value": 506,
                "label": "Northwest"
            },
            {
                "value": 502,
                "label": "South East"
            },
            {
                "value": 507,
                "label": "Southern Regional"
            },
            {
                "value": 508,
                "label": "Wake AHEC"
            },
            {
                "value": 700,
                "label": "Metropolitan"
            },
            {
                "value": 701,
                "label": "Nonmetropolitan"
            }
        ],
        "label": "Location",
        "name": "location"
    },
    {
        "options": [
            {
                "value": 51,
                "label": "Baseline Supply"
            },
            {
                "value": 33,
                "label": "Early Leavers"
            },
            {
                "value": 35,
                "label": "Delayed Leavers"
            },
            {
                "value": 40,
                "label": "Reduction in Out-of-State Supply by 2.5%"
            },
            {
                "value": 41,
                "label": "2% Increase in Graduate Supply"
            },
        ],
        "label": "Supply Scenario",
        "name": "supplyScenario"
    },
    {
        "options": [
            {
                "value": 1,
                "label": "Baseline Demand"
            }
        ],
        "label": "Demand Scenario",
        "name": "demandScenario"
    },
    {
        "options": [
            {
                "value": 0,
                "label": "LPN & RN"
            },
            {
                "value": 1,
                "label": "LPN"
            },
            {
                "value": 2,
                "label": "RN"
            },
        ],
        "name": "type",
        "label": "Nurse Type"
    }, {
        "options": [
            {
                "value": 0,
                "label": "All Education"
            },
            {
                "value": 4,
                "label": "BS & MS"
            },
            {
                "value": 5,
                "label": "ADN & Diploma"
            },
        ],
        "name": "education",
        "label": "Education"
    }, {
        "options": [
            {
                "value": 0,
                "label": "Rate per 10K population"
            },
            {
                "value": 1,
                "label": "Total"
            }
        ],
        "name": "rateOrTotal",
        "label": "Rate Or Total"
    },
    {
        "options": [
            {
                "value": 0,
                "label": "Headcount"
            },
            {
                "value": 1,
                "label": "FTE"
            }
        ],
        "name": "fteOrHeadcount",
        "label": "FTE or Headcount"
    }
].map(d => [d.name, Object.assign({ optionsMap: new Map(d.options.map(e => [e.value, e.label])) }, d)]))