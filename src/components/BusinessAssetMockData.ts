/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: 'Construction Equipment' | 'Heavy Machinery' | 'Vehicles' | 'Office Equipment' | 'IT Assets' | 'Electrical Equipment' | 'Safety Equipment' | 'Tools' | 'Furniture' | string;
  subCategory: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  warrantyStatus: 'In Warranty' | 'Out of Warranty' | 'Expiring Soon';
  warrantyExpiryDate: string;
  assignedProjectId?: string; // links to Project
  assignedProjectName?: string;
  assignedDepartment?: string; // links to HR
  assignedEmployeeId?: string; // links to HR
  assignedEmployeeName?: string;
  currentLocation: string;
  vendorName: string; // links to Procurement / CRM
  vendorContact?: string;
  status: 'Available' | 'Assigned' | 'In Use' | 'Under Maintenance' | 'Inactive' | 'Disposed' | 'Archived';
  description: string;
  imagePlaceholderUrl?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  utilizationRate?: number; // percentage, e.g. 85 for 85%
  timeline: {
    id: string;
    date: string;
    type: 'Purchase' | 'Allocation' | 'Transfer' | 'Return' | 'Maintenance' | 'Breakdown' | 'Status Change' | 'Value Update';
    title: string;
    notes: string;
    user: string;
  }[];
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  serviceType: 'Preventive Maintenance' | 'Corrective Maintenance' | 'Emergency Breakdown' | 'Inspection' | 'Calibration' | 'Installation' | 'Warranty Service' | 'AMC Service';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Scheduled' | 'Assigned' | 'In Progress' | 'Waiting for Parts' | 'Completed' | 'Cancelled' | 'Closed';
  description: string;
  assignedTechnicianName: string;
  assignedTechnicianContact?: string;
  scheduledDate: string;
  completedDate?: string;
  serviceCost: number;
  resolutionNotes?: string;
  rootCause?: string;
  downtimeHours?: number; // downtime in hours
  partsUsed?: {
    partId: string;
    partName: string;
    quantity: number;
    unitCost: number;
  }[];
  discussion: {
    id: string;
    user: string;
    role: string;
    message: string;
    timestamp: string;
  }[];
  meetingScheduled?: {
    title: string;
    date: string;
    time: string;
    link?: string;
  };
}

export interface AmcContract {
  id: string;
  contractNumber: string;
  contractName: string;
  vendorName: string;
  vendorContact: string;
  startDate: string;
  endDate: string;
  serviceFrequency: 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';
  cost: number;
  coverageDetails: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Renewed';
  renewalReminderSent: boolean;
  linkedAssetIds: string[];
}

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-101',
    code: 'RC-EQ-TOWER-09',
    name: 'Liebherr 280 EC-H Tower Crane',
    category: 'Heavy Machinery',
    subCategory: 'Cranes',
    manufacturer: 'Liebherr',
    model: '280 EC-H 12 Litronic',
    serialNumber: 'LH-280-99381',
    purchaseDate: '2024-03-12',
    purchaseCost: 12500000,
    currentValue: 9800000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2027-03-12',
    assignedProjectId: 'proj-1',
    assignedProjectName: 'Signature Global Park (Phase 1)',
    assignedDepartment: 'Construction',
    assignedEmployeeId: 'emp-201',
    assignedEmployeeName: 'Anand Deshmukh',
    currentLocation: 'Sector 36, Gurugram - Site A',
    vendorName: 'Global Tech Equipment Ltd',
    vendorContact: 'sales@globaltech-equip.in',
    status: 'In Use',
    description: 'High-capacity top-slewing tower crane. Used for heavy structural concrete lifts and prefabricated block installations.',
    lastServiceDate: '2026-06-15',
    nextServiceDate: '2026-09-15',
    utilizationRate: 88,
    timeline: [
      { id: 'atl-1', date: '2024-03-12 10:00 AM', type: 'Purchase', title: 'Asset Acquired', notes: 'Purchased from Global Tech Equipment Ltd. Warranty registered for 3 years.', user: 'Finance Admin' },
      { id: 'atl-2', date: '2024-03-20 02:00 PM', type: 'Allocation', title: 'Assigned to Project', notes: 'Dispatched to Signature Global Park (Gurugram) under supervision of Anand Deshmukh.', user: 'Logistics Head' },
      { id: 'atl-3', date: '2026-06-15 04:30 PM', type: 'Maintenance', title: 'Quarterly Preventive Maintenance', notes: 'Slewing gear lubricated, load cell calibrated, wire rope inspected.', user: 'Rohan Sharma (Tech)' }
    ]
  },
  {
    id: 'ast-102',
    code: 'RC-EQ-EXCAV-02',
    name: 'Caterpillar 320 Hydraulic Excavator',
    category: 'Construction Equipment',
    subCategory: 'Excavators',
    manufacturer: 'Caterpillar',
    model: 'CAT 320-07A',
    serialNumber: 'CAT-320-HE-5512',
    purchaseDate: '2023-08-18',
    purchaseCost: 6500000,
    currentValue: 4500000,
    warrantyStatus: 'Out of Warranty',
    warrantyExpiryDate: '2025-08-18',
    assignedProjectId: 'proj-2',
    assignedProjectName: 'Metro Line 3 Phase 1',
    assignedDepartment: 'Construction',
    assignedEmployeeId: 'emp-202',
    assignedEmployeeName: 'Deepak Kumar',
    currentLocation: 'Colaba Metro Station Site',
    vendorName: 'BuildCorp Machinery Sales',
    vendorContact: 'machinery@buildcorp.in',
    status: 'Under Maintenance',
    description: 'Hydraulic excavator with high-efficiency bucket and smart hydraulic controls. Currently undergoing hydraulic pump seal repair.',
    lastServiceDate: '2026-07-19',
    nextServiceDate: '2026-08-19',
    utilizationRate: 75,
    timeline: [
      { id: 'atl-4', date: '2023-08-18 11:00 AM', type: 'Purchase', title: 'Asset Acquired', notes: 'Excavator added to central construction fleet.', user: 'Finance Admin' },
      { id: 'atl-5', date: '2026-07-19 09:30 AM', type: 'Breakdown', title: 'Hydraulic Seal Leak Reported', notes: 'Operator reported pressure loss in boom cylinder. Leak confirmed at main valve gasket.', user: 'Deepak Kumar' },
      { id: 'atl-6', date: '2026-07-19 02:00 PM', type: 'Status Change', title: 'Moved to Under Maintenance', notes: 'Moved to onsite maintenance shed. Spare parts ordered from central store.', user: 'Vikram Patel (Eng)' }
    ]
  },
  {
    id: 'ast-103',
    code: 'RC-VEH-MIXER-04',
    name: 'Tata Signa 2825.K Transit Mixer',
    category: 'Vehicles',
    subCategory: 'Transit Mixers',
    manufacturer: 'Tata Motors',
    model: 'Signa 2825.K 7m³',
    serialNumber: 'TATA-SIGNA-MX4402',
    purchaseDate: '2025-01-20',
    purchaseCost: 4800000,
    currentValue: 4200000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2028-01-20',
    assignedProjectId: 'proj-1',
    assignedProjectName: 'Signature Global Park (Phase 1)',
    assignedDepartment: 'Logistics',
    assignedEmployeeId: 'emp-203',
    assignedEmployeeName: 'Rajesh Yadav',
    currentLocation: 'Sector 36 batching plant route',
    vendorName: 'Tata Commercial Vehicles Ltd',
    vendorContact: 'support@tatacommercial.com',
    status: 'In Use',
    description: 'High-performance concrete transit mixer with 7 cubic meter capacity. Equipped with real-time rotation speed telemetry.',
    lastServiceDate: '2026-05-10',
    nextServiceDate: '2026-08-10',
    utilizationRate: 92,
    timeline: [
      { id: 'atl-7', date: '2025-01-20 03:00 PM', type: 'Purchase', title: 'Transit Mixer Procured', notes: 'Added to ready-mix concrete logistics fleet.', user: 'Finance Admin' },
      { id: 'atl-8', date: '2026-05-10 02:30 PM', type: 'Maintenance', title: 'First 5,000 km Service', notes: 'Engine oil replaced, mixer drum wash nozzles cleared, hydraulic drum pump tested.', user: 'Tata Authorized Service' }
    ]
  },
  {
    id: 'ast-104',
    code: 'RC-IT-SRV-02',
    name: 'Dell PowerEdge R760 Server',
    category: 'IT Assets',
    subCategory: 'Servers',
    manufacturer: 'Dell Technologies',
    model: 'PowerEdge R760 Rack Server',
    serialNumber: 'DELL-PE-7762-ASX',
    purchaseDate: '2024-11-05',
    purchaseCost: 950000,
    currentValue: 800000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2027-11-05',
    assignedProjectId: undefined,
    assignedProjectName: 'Corporate HQ Infrastructure',
    assignedDepartment: 'IT Support',
    assignedEmployeeId: 'emp-204',
    assignedEmployeeName: 'Sarah D\'Souza',
    currentLocation: 'Server Room 2B, RealtyConnect HQ, Mumbai',
    vendorName: 'Nexus IT Infrastructure Dealers',
    vendorContact: 'corporate@nexusit.co.in',
    status: 'In Use',
    description: 'Enterprise rack server hosting localized DMS document store, HR records, and active database synchronization mirror.',
    lastServiceDate: '2026-02-18',
    nextServiceDate: '2026-08-18',
    utilizationRate: 98,
    timeline: [
      { id: 'atl-9', date: '2024-11-05 09:00 AM', type: 'Purchase', title: 'IT Rack Server Installed', notes: 'Provisioned, RAID-10 configured with 6x 2TB SSDs, connected to UPS redundancy.', user: 'Sarah D\'Souza' },
      { id: 'atl-10', date: '2026-02-18 10:00 AM', type: 'Maintenance', title: 'Firmware & Security Update', notes: 'BIOS updated, OS security patches applied, backup battery capacity tested.', user: 'Sarah D\'Souza' }
    ]
  },
  {
    id: 'ast-105',
    code: 'RC-OFC-AC-08',
    name: 'Daikin 2.0 Ton VRV Air Conditioner',
    category: 'Office Equipment',
    subCategory: 'Air Conditioning',
    manufacturer: 'Daikin',
    model: 'VRV IV-S Outdoor + 3 Indoor',
    serialNumber: 'DK-VRV-99281',
    purchaseDate: '2022-04-10',
    purchaseCost: 180000,
    currentValue: 110000,
    warrantyStatus: 'Out of Warranty',
    warrantyExpiryDate: '2024-04-10',
    assignedProjectId: undefined,
    assignedProjectName: 'Corporate HQ Infrastructure',
    assignedDepartment: 'Administration',
    assignedEmployeeId: 'emp-205',
    assignedEmployeeName: 'Pooja Hegde',
    currentLocation: 'Executive Cabin Suite, Floor 4, HQ',
    vendorName: 'Elite Coolers & Electricals',
    vendorContact: 'service@elitecoolers.in',
    status: 'In Use',
    description: 'Variable Refrigerant Volume air conditioning system for multi-zone administrative temperature regulation.',
    lastServiceDate: '2026-04-05',
    nextServiceDate: '2026-07-25',
    utilizationRate: 60,
    timeline: [
      { id: 'atl-11', date: '2022-04-10 11:30 AM', type: 'Purchase', title: 'Daikin VRV System Installed', notes: 'Mounted outdoor unit with 3 indoor cassettes.', user: 'Pooja Hegde' },
      { id: 'atl-12', date: '2026-04-05 11:00 AM', type: 'Maintenance', title: 'Periodic Filter Cleaning', notes: 'Cleaned filters, checked refrigerant pressure (130 PSI), verified condensate drains.', user: 'Elite Coolers Tech' }
    ]
  },
  {
    id: 'ast-106',
    code: 'RC-SFT-FIRE-01',
    name: 'Automatic Sprinkler Control Valve Panel',
    category: 'Safety Equipment',
    subCategory: 'Fire Suppression',
    manufacturer: 'Honeywell',
    model: 'FSC-Zone-200',
    serialNumber: 'HW-FSC-88129',
    purchaseDate: '2025-05-14',
    purchaseCost: 350000,
    currentValue: 320000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2028-05-14',
    assignedProjectId: 'proj-3',
    assignedProjectName: 'Apex Premium Tower (Commercial)',
    assignedDepartment: 'Safety & MEP',
    assignedEmployeeId: 'emp-206',
    assignedEmployeeName: 'Rajesh Koothrapali',
    currentLocation: 'MEP Basement Control Room, Apex Tower',
    vendorName: 'SafeGuard Fire Solutions',
    vendorContact: 'info@safeguardfire.in',
    status: 'Available',
    description: 'Main solenoid-activated automatic fire sprinkler zone control and water pressure gauge panel.',
    lastServiceDate: '2026-05-15',
    nextServiceDate: '2026-11-15',
    utilizationRate: 100,
    timeline: [
      { id: 'atl-13', date: '2025-05-14 02:00 PM', type: 'Purchase', title: 'Safety Valve Panel Procured', notes: 'Safety and building code compliance item for Apex Tower.', user: 'Safety Officer' },
      { id: 'atl-14', date: '2026-05-15 11:00 AM', type: 'Maintenance', title: 'Annual Fire Sprinkler Certification', notes: 'Static pressure holding at 145 PSI. Solenoid triggered via fire simulator correctly.', user: 'SafeGuard Inspector' }
    ]
  },
  {
    id: 'ast-107',
    code: 'RC-TL-CONC-05',
    name: 'Schwing Stetter Heavy Concrete Pump',
    category: 'Construction Equipment',
    subCategory: 'Concrete Pumps',
    manufacturer: 'Schwing Stetter',
    model: 'SP-1400 D Heavy Duty',
    serialNumber: 'SS-SP1400D-2201',
    purchaseDate: '2024-08-25',
    purchaseCost: 4200000,
    currentValue: 3400000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2026-08-25',
    assignedProjectId: 'proj-1',
    assignedProjectName: 'Signature Global Park (Phase 1)',
    assignedDepartment: 'Construction',
    assignedEmployeeId: 'emp-201',
    assignedEmployeeName: 'Anand Deshmukh',
    currentLocation: 'Gurugram Sector 36 batching area',
    vendorName: 'Global Tech Equipment Ltd',
    vendorContact: 'sales@globaltech-equip.in',
    status: 'Available',
    description: 'Stationary concrete pump powered by energy-efficient Deutz engine. Delivers up to 55 cubic meters per hour.',
    lastServiceDate: '2026-06-01',
    nextServiceDate: '2026-09-01',
    utilizationRate: 80,
    timeline: [
      { id: 'atl-15', date: '2024-08-25 10:00 AM', type: 'Purchase', title: 'Concrete Pump Acquired', notes: 'Delivered to central depot and checked for commissioning.', user: 'Fleet Manager' }
    ]
  },
  {
    id: 'ast-108',
    code: 'RC-OFC-DESK-42',
    name: 'Ergonomic Modular Desk Set (12 Pack)',
    category: 'Furniture',
    subCategory: 'Desks & Chairs',
    manufacturer: 'Godrej Interio',
    model: 'Godrej Workspace-90',
    serialNumber: 'GI-WS90-4212',
    purchaseDate: '2025-02-15',
    purchaseCost: 240000,
    currentValue: 220000,
    warrantyStatus: 'In Warranty',
    warrantyExpiryDate: '2028-02-15',
    assignedProjectId: undefined,
    assignedProjectName: 'Corporate HQ Infrastructure',
    assignedDepartment: 'Administration',
    assignedEmployeeId: 'emp-205',
    assignedEmployeeName: 'Pooja Hegde',
    currentLocation: 'Open Workspace area, 3rd Floor, HQ',
    vendorName: 'Godrej Commercial Dealers',
    vendorContact: 'b2b@godrejinterio.co.in',
    status: 'In Use',
    description: 'Adjustable height modular workstations with wire routing tracks and flame-retardant panel dividers.',
    lastServiceDate: '2025-02-18',
    nextServiceDate: undefined,
    utilizationRate: 100,
    timeline: [
      { id: 'atl-16', date: '2025-02-15 04:00 PM', type: 'Purchase', title: 'Office Furniture Delivered', notes: 'Godrej team completed assembly and wire grouping on-site.', user: 'Pooja Hegde' }
    ]
  },
  {
    id: 'ast-109',
    code: 'RC-EQ-DISP-01',
    name: 'Old Mahindra Bolero Pickup (Retired)',
    category: 'Vehicles',
    subCategory: 'Utility Vehicles',
    manufacturer: 'Mahindra & Mahindra',
    model: 'Bolero Camper 2WD',
    serialNumber: 'MHM-BOL-88219',
    purchaseDate: '2016-04-12',
    purchaseCost: 750000,
    currentValue: 50000,
    warrantyStatus: 'Out of Warranty',
    warrantyExpiryDate: '2019-04-12',
    assignedProjectId: undefined,
    assignedProjectName: 'None',
    assignedDepartment: 'Disposed',
    assignedEmployeeId: undefined,
    assignedEmployeeName: 'None',
    currentLocation: 'Retired Yard, Navi Mumbai',
    vendorName: 'Mahindra Dealership Mumbai',
    vendorContact: 'support@mahindra.co.in',
    status: 'Disposed',
    description: 'Utility transport vehicle used for site delivery. Decommissioned after 10 years of service due to emission limits.',
    lastServiceDate: '2025-10-12',
    nextServiceDate: undefined,
    utilizationRate: 0,
    timeline: [
      { id: 'atl-17', date: '2016-04-12 10:00 AM', type: 'Purchase', title: 'Utility Pickup Procured', notes: 'Initial logistics purchase.', user: 'Fleet Manager' },
      { id: 'atl-18', date: '2026-03-10 03:00 PM', type: 'Status Change', title: 'Scrap & Disposal Authorized', notes: 'Vehicle sold to authorized metal recycler for scrap value of ₹45,000.', user: 'Finance Admin' }
    ]
  }
];

export const INITIAL_SERVICES: ServiceRequest[] = [
  {
    id: 'srv-201',
    requestNumber: 'REQ-2026-0701',
    assetId: 'ast-102',
    assetName: 'Caterpillar 320 Hydraulic Excavator',
    assetCode: 'RC-EQ-EXCAV-02',
    serviceType: 'Emergency Breakdown',
    priority: 'Critical',
    status: 'In Progress',
    description: 'Main boom cylinder showing drop in pressure. Gasket is completely ruptured, hydraulic fluid leaking heavily on site floor.',
    assignedTechnicianName: 'Vikram Patel',
    assignedTechnicianContact: '+91 98221 00392',
    scheduledDate: '2026-07-19',
    serviceCost: 15500,
    resolutionNotes: 'Awaiting high-pressure replacement gasket from CAT authorized warehouse. Flushed the old contaminated hydraulic oil reservoir.',
    rootCause: 'Elastomer seal fatigue due to high ambient operating temperatures and continuous high-load rock dredging.',
    downtimeHours: 28,
    partsUsed: [
      { partId: 'sp-301', partName: 'Hydraulic Hose kit', quantity: 1, unitCost: 4500 },
      { partId: 'sp-302', partName: 'CAT Diesel Filter HF-82', quantity: 2, unitCost: 1200 }
    ],
    discussion: [
      { id: 'dis-1', user: 'Vikram Patel', role: 'Chief MEP Engineer', message: 'The local depot does not have the CAT-320-gasket. Requesting inventory mirror to check green warehouse.', timestamp: '2026-07-19 11:30 AM' },
      { id: 'dis-2', user: 'Anand Deshmukh', role: 'Project Manager', message: 'Approved. We cannot have this excavator idle for long, it will delay the Metro station dredging milestone.', timestamp: '2026-07-19 12:15 PM' }
    ],
    meetingScheduled: {
      title: 'Excavator Breakdown & Progress Alignment',
      date: '2026-07-21',
      time: '11:00 AM',
      link: 'https://meet.realtyconnect.in/excavator-align'
    }
  },
  {
    id: 'srv-202',
    requestNumber: 'REQ-2026-0710',
    assetId: 'ast-101',
    assetName: 'Liebherr 280 EC-H Tower Crane',
    assetCode: 'RC-EQ-TOWER-09',
    serviceType: 'Preventive Maintenance',
    priority: 'High',
    status: 'Scheduled',
    description: 'Scheduled quarterly preventive inspection. Checking slewing ring torque, wire ropes wear levels, hoist motor brush telemetry, and safe load limiter sensors.',
    assignedTechnicianName: 'Rohan Sharma',
    assignedTechnicianContact: '+91 98765 43210',
    scheduledDate: '2026-07-22',
    serviceCost: 42000,
    resolutionNotes: '',
    rootCause: '',
    downtimeHours: 0,
    partsUsed: [],
    discussion: [
      { id: 'dis-3', user: 'Rohan Sharma', role: 'Technician', message: 'Need to coordinate with site safety manager for a 4-hour crane block during hoist test.', timestamp: '2026-07-18 09:00 AM' }
    ]
  },
  {
    id: 'srv-203',
    requestNumber: 'REQ-2026-0715',
    assetId: 'ast-105',
    assetName: 'Daikin 2.0 Ton VRV Air Conditioner',
    assetCode: 'RC-OFC-AC-08',
    serviceType: 'AMC Service',
    priority: 'Low',
    status: 'Completed',
    description: 'Routine quarterly cleaning and gas charge check under Daikin corporate AMC contract.',
    assignedTechnicianName: 'Elite Coolers Representative',
    assignedTechnicianContact: 'service@elitecoolers.in',
    scheduledDate: '2026-07-15',
    completedDate: '2026-07-15',
    serviceCost: 0, // Covered under AMC
    resolutionNotes: 'Filters scrubbed, condenser coil cleaned with water jet, current draw verified at 9.2A. Gas pressure OK.',
    rootCause: 'Normal operational maintenance',
    downtimeHours: 2,
    partsUsed: [
      { partId: 'sp-303', partName: 'HEPA Office AC Filter', quantity: 3, unitCost: 800 }
    ],
    discussion: [
      { id: 'dis-4', user: 'Pooja Hegde', role: 'Admin Officer', message: 'Service completed quickly. No disruption to Executive Cabin suite.', timestamp: '2026-07-15 03:00 PM' }
    ]
  },
  {
    id: 'srv-204',
    requestNumber: 'REQ-2026-0718',
    assetId: 'ast-104',
    assetName: 'Dell PowerEdge R760 Server',
    assetCode: 'RC-IT-SRV-02',
    serviceType: 'Calibration',
    priority: 'Medium',
    status: 'Completed',
    description: 'Internal temperature telemetry showing spike. Fan controller calibration and thermal compound re-application needed.',
    assignedTechnicianName: 'Sarah D\'Souza',
    assignedTechnicianContact: 'sd@realtyconnect.in',
    scheduledDate: '2026-07-18',
    completedDate: '2026-07-18',
    serviceCost: 3500,
    resolutionNotes: 'Removed dust from heat-pipes, reapplied Noctua NT-H2 thermal compound. Recalibrated fan curve in iDRAC to trigger high speed at 68C.',
    rootCause: 'Dust build-up on exhaust vents restricting heat dissipation.',
    downtimeHours: 0.5,
    partsUsed: [],
    discussion: []
  },
  {
    id: 'srv-205',
    requestNumber: 'REQ-2026-0720',
    assetId: 'ast-106',
    assetName: 'Automatic Sprinkler Control Valve Panel',
    assetCode: 'RC-SFT-FIRE-01',
    serviceType: 'Inspection',
    priority: 'High',
    status: 'Assigned',
    description: 'Local Municipal Fire Inspector visit. Checking compliance certificates and performing manual trigger test on fire pump control panel.',
    assignedTechnicianName: 'Rajesh Koothrapali',
    assignedTechnicianContact: 'rk@realtyconnect.in',
    scheduledDate: '2026-07-25',
    serviceCost: 5000,
    resolutionNotes: '',
    rootCause: '',
    downtimeHours: 0,
    partsUsed: [],
    discussion: []
  }
];

export const INITIAL_AMC_CONTRACTS: AmcContract[] = [
  {
    id: 'amc-301',
    contractNumber: 'AMC-2026-DAIKIN-01',
    contractName: 'Daikin Commercial VRV Maintenance',
    vendorName: 'Elite Coolers & Electricals',
    vendorContact: 'amc@elitecoolers.in',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    serviceFrequency: 'Quarterly',
    cost: 150000,
    coverageDetails: 'All Daikin indoor VRV units (15 units) and 4 outdoor scroll compressors. Includes gas refills, fan motors, PCB repairs, and quarterly deep wash.',
    status: 'Active',
    renewalReminderSent: false,
    linkedAssetIds: ['ast-105']
  },
  {
    id: 'amc-302',
    contractNumber: 'AMC-2026-LIEBHERR-11',
    contractName: 'Liebherr Tower Crane Platinum Care',
    vendorName: 'Global Tech Equipment Ltd',
    vendorContact: 'liebherr-care@globaltech.in',
    startDate: '2025-06-01',
    endDate: '2026-05-31', // Expired
    serviceFrequency: 'Quarterly',
    cost: 450000,
    coverageDetails: 'Slewing gear warranty backup, load indicator safety calibrations, structural weld inspections, hoist motor overhauls.',
    status: 'Expired',
    linkedAssetIds: ['ast-101'],
    renewalReminderSent: true
  },
  {
    id: 'amc-303',
    contractNumber: 'AMC-2026-SCHWING-05',
    contractName: 'Schwing Stetter Heavy Equipment AMC',
    vendorName: 'Global Tech Equipment Ltd',
    vendorContact: 'sales@globaltech-equip.in',
    startDate: '2026-04-15',
    endDate: '2027-04-14',
    serviceFrequency: 'Bi-Annual',
    cost: 280000,
    coverageDetails: 'Hydraulic cylinder inspection, pumping piston lubrication, valve box seals replacement, control system firmware validation.',
    status: 'Active',
    linkedAssetIds: ['ast-107'],
    renewalReminderSent: false
  }
];

export const SPARE_PARTS_INVENTORY = [
  { id: 'sp-301', name: 'Hydraulic Hose kit', stock: 12, unitCost: 4500, category: 'Hydraulics' },
  { id: 'sp-302', name: 'CAT Diesel Filter HF-82', stock: 24, unitCost: 1200, category: 'Filters' },
  { id: 'sp-303', name: 'HEPA Office AC Filter', stock: 45, unitCost: 800, category: 'HVAC' },
  { id: 'sp-304', name: 'Vibrator Needle 40mm', stock: 8, unitCost: 3500, category: 'Tools' },
  { id: 'sp-305', name: 'UPS Redundant Power Supply', stock: 3, unitCost: 14500, category: 'Electrical' },
  { id: 'sp-306', name: 'Slewing Gear Lubricant L-20', stock: 15, unitCost: 5500, category: 'Lubricants' }
];

export const PROJECTS_ROSTER = [
  { id: 'proj-1', name: 'Signature Global Park (Phase 1)' },
  { id: 'proj-2', name: 'Metro Line 3 Phase 1' },
  { id: 'proj-3', name: 'Apex Premium Tower (Commercial)' },
  { id: 'proj-4', name: 'Bandra Reclamation Seafront' }
];

export const DEPARTMENTS_LIST = [
  'Construction',
  'Safety & MEP',
  'Logistics',
  'IT Support',
  'Administration',
  'Engineering',
  'Procurement',
  'Finance'
];

export const EMPLOYEES_ROSTER = [
  { id: 'emp-201', name: 'Anand Deshmukh', role: 'Project Manager', dept: 'Construction' },
  { id: 'emp-202', name: 'Deepak Kumar', role: 'Machinery Supervisor', dept: 'Construction' },
  { id: 'emp-203', name: 'Rajesh Yadav', role: 'Logistics Supervisor', dept: 'Logistics' },
  { id: 'emp-204', name: 'Sarah D\'Souza', role: 'Lead IT Systems Analyst', dept: 'IT Support' },
  { id: 'emp-205', name: 'Pooja Hegde', role: 'Admin Officer', dept: 'Administration' },
  { id: 'emp-206', name: 'Rajesh Koothrapali', role: 'Safety Compliance Officer', dept: 'Safety & MEP' }
];

export const APPROVED_VENDORS = [
  { id: 'vnd-501', name: 'Global Tech Equipment Ltd', rating: 4.8, category: 'Heavy Machinery' },
  { id: 'vnd-502', name: 'Elite Coolers & Electricals', rating: 4.6, category: 'HVAC Services' },
  { id: 'vnd-503', name: 'SafeGuard Fire Solutions', rating: 4.9, category: 'Fire Suppression' },
  { id: 'vnd-504', name: 'Godrej Commercial Dealers', rating: 4.5, category: 'Furniture' }
];
