/* ==========================================
   VAULT
   DEFAULT DATA
========================================== */

let appData = {
    balance: 0,

    goals: [
        {
            id: 1,
            title: "Gloves",
            category: "Gear",
            icon: "front_hand",
            target: 200,
            dueDate: "2026-10-23",
            purchased: false,
            color: "blue"
        },
        {
            id: 2,
            title: "Back Protector",
            category: "Gear",
            icon: "health_and_safety",
            target: 190,
            dueDate: "2026-11-06",
            purchased: false,
            color: "green"
        },
        {
            id: 3,
            title: "Jacket",
            category: "Gear",
            icon: "checkroom",
            target: 500,
            dueDate: "2026-11-20",
            purchased: false,
            color: "purple"
        },
        {
            id: 4,
            title: "Pants",
            category: "Gear",
            icon: "accessibility_new",
            target: 400,
            dueDate: "2026-12-04",
            purchased: false,
            color: "orange"
        },
        {
            id: 5,
            title: "Helmet",
            category: "Gear",
            icon: "sports_motorsports",
            target: 950,
            dueDate: "2026-12-04",
            purchased: false,
            color: "blue"
        },
        {
            id: 6,
            title: "Boots",
            category: "Gear",
            icon: "hiking",
            target: 500,
            dueDate: "2026-12-18",
            purchased: false,
            color: "yellow"
        },
        {
            id: 7,
            title: "Ninja 400",
            category: "Bike",
            icon: "two_wheeler",
            target: 5000,
            dueDate: "2027-04-01",
            purchased: false,
            color: "green"
        }
    ],

    categories: [
        {
            id: 1,
            title: "Bike",
            icon: "two_wheeler",
            target: 5000,
            color: "blue"
        },
        {
            id: 2,
            title: "Gear",
            icon: "sports_motorsports",
            target: 2740,
            color: "purple"
        },
        {
            id: 3,
            title: "Maintenance",
            icon: "build",
            target: 500,
            color: "orange"
        },
        {
            id: 4,
            title: "Insurance",
            icon: "shield",
            target: 1500,
            color: "green"
        },
        {
            id: 5,
            title: "Registration",
            icon: "description",
            target: 300,
            color: "yellow"
        }
    ],

    transactions: [
        {
            id: 1,
            type: "deposit",
            title: "Starting Vault",
            amount: 0,
            date: "2026-07-04"
        }
    ],
    bike: {
    name: "Future Ninja 400",
    make: "Kawasaki",
    model: "Ninja 400",
    year: "2022",
    mileage: 12000,
    purchasePrice: 5000,
    insuranceMonthly: 0,
    image: ""
},    

finance: {
    paycheckAmount: 600,
    lastPaycheckDate: "2026-07-03",
    frequencyDays: 14,

    expenses: [
        {
            id: 1,
            title: "Motorcycle Insurance",
            category: "Insurance",
            amount: 27,
            icon: "shield",
            color: "green",
            paid: false
        },
        {
            id: 2,
            title: "Fuel",
            category: "Transportation",
            amount: 40,
            icon: "local_gas_station",
            color: "orange",
            paid: false
        }
    ]
},
};

