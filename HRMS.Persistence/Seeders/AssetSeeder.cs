using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using HRMS.Domain.Entities.Asset;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Persistence.Seeders;

public static class AssetSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.Assets.Any()) return;

        var tenant = context.Tenants.FirstOrDefault(t => !t.IsDeleted);
        var tenantId = tenant?.Id ?? Guid.Parse("11111111-1111-1111-1111-111111111111");

        var employees = context.Employees.Where(e => !e.IsDeleted).Take(50).ToList();
        var departments = context.Departments.Where(d => !d.IsDeleted).ToList();
        var branches = context.Branches.Where(b => !b.IsDeleted).ToList();

        // 1. SEED 10 CATEGORIES
        var categories = new List<AssetCategory>
        {
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Laptops", Code = "LAP", AssetType = "Hardware", DepreciationMethod = "StraightLine", UsefulLifeMonths = 36, RequiresSerialNumber = true, RequiresAssignment = true, RequiresApproval = true, IsActive = true, Description = "Enterprise developer & management laptops" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Desktops & Workstations", Code = "DSK", AssetType = "Hardware", DepreciationMethod = "StraightLine", UsefulLifeMonths = 48, RequiresSerialNumber = true, RequiresAssignment = true, RequiresApproval = true, IsActive = true, Description = "High-performance fixed engineering workstations" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Monitors & Displays", Code = "MON", AssetType = "Hardware", DepreciationMethod = "StraightLine", UsefulLifeMonths = 48, RequiresSerialNumber = true, RequiresAssignment = true, RequiresApproval = false, IsActive = true, Description = "4K and Ultrawide workstation displays" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Mobile Phones", Code = "MOB", AssetType = "Hardware", DepreciationMethod = "StraightLine", UsefulLifeMonths = 24, RequiresSerialNumber = true, RequiresAssignment = true, RequiresApproval = true, IsActive = true, Description = "Corporate executive and on-call mobile devices" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Network Equipment", Code = "NET", AssetType = "Hardware", DepreciationMethod = "DecliningBalance", UsefulLifeMonths = 60, RequiresSerialNumber = true, RequiresAssignment = false, RequiresApproval = true, IsActive = true, Description = "Routers, managed switches, and access points" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Servers & Cloud Hardware", Code = "SRV", AssetType = "Hardware", DepreciationMethod = "StraightLine", UsefulLifeMonths = 60, RequiresSerialNumber = true, RequiresAssignment = false, RequiresApproval = true, IsActive = true, Description = "Rackmount servers and storage arrays" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Office Furniture", Code = "FUR", AssetType = "Furniture", DepreciationMethod = "StraightLine", UsefulLifeMonths = 84, RequiresSerialNumber = false, RequiresAssignment = true, RequiresApproval = false, IsActive = true, Description = "Ergonomic desks and task chairs" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Fleet Vehicles", Code = "VEH", AssetType = "Vehicle", DepreciationMethod = "DecliningBalance", UsefulLifeMonths = 60, RequiresSerialNumber = true, RequiresAssignment = true, RequiresApproval = true, IsActive = true, Description = "Corporate logistics and executive vehicles" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Printers & Scanners", Code = "PRN", AssetType = "Equipment", DepreciationMethod = "StraightLine", UsefulLifeMonths = 48, RequiresSerialNumber = true, RequiresAssignment = false, RequiresApproval = false, IsActive = true, Description = "Multifunction network printers" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, Name = "Audio / Visual Equipment", Code = "AV", AssetType = "Equipment", DepreciationMethod = "StraightLine", UsefulLifeMonths = 36, RequiresSerialNumber = true, RequiresAssignment = false, RequiresApproval = true, IsActive = true, Description = "Conference room video bars, microphones, and TVs" }
        };
        context.AssetCategories.AddRange(categories);
        context.SaveChanges();

        // 2. SEED 8 VENDORS
        var vendors = new List<AssetVendor>
        {
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Apple Enterprise Direct", VendorCode = "VND-APPL", ContactPerson = "Sarah Jenkins", Email = "enterprise-orders@apple.com", Phone = "+1-800-692-7753", Address = "1 Infinite Loop, Cupertino, CA", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Dell Technologies Global", VendorCode = "VND-DELL", ContactPerson = "Michael Chang", Email = "commercial-sales@dell.com", Phone = "+1-800-456-3355", Address = "1 Dell Way, Round Rock, TX", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "CDW Enterprise Solutions", VendorCode = "VND-CDW", ContactPerson = "Robert Brooks", Email = "procurement@cdw.com", Phone = "+1-847-465-6000", Address = "200 N Milwaukee Ave, Vernon Hills, IL", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Lenovo Corporate Direct", VendorCode = "VND-LNV", ContactPerson = "Elena Rostova", Email = "enterprise@lenovo.com", Phone = "+1-855-253-6686", Address = "8001 Development Dr, Morrisville, NC", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Cisco Systems Global", VendorCode = "VND-CSCO", ContactPerson = "David Kim", Email = "partner-supply@cisco.com", Phone = "+1-408-526-4000", Address = "170 W Tasman Dr, San Jose, CA", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Herman Miller Commercial", VendorCode = "VND-HMIL", ContactPerson = "Jessica Miller", Email = "b2b@hermanmiller.com", Phone = "+1-888-798-0202", Address = "855 E Main Ave, Zeeland, MI", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Samsung Electronics B2B", VendorCode = "VND-SMSG", ContactPerson = "Alex Park", Email = "b2b.support@samsung.com", Phone = "+1-800-726-7864", Address = "85 Challenger Rd, Ridgefield Park, NJ", Status = "Active" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, VendorName = "Insight Direct USA", VendorCode = "VND-INST", ContactPerson = "Amanda Taylor", Email = "gov-ed@insight.com", Phone = "+1-800-467-4448", Address = "6820 S Harl Ave, Tempe, AZ", Status = "Active" }
        };
        context.AssetVendors.AddRange(vendors);
        context.SaveChanges();

        // 3. SEED 8 LOCATIONS
        var defaultBranch = branches.FirstOrDefault();
        var locations = new List<AssetLocation>
        {
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "HQ - 4th Floor IT Depot", Code = "LOC-HQ-FL04-DEPOT", Building = "Tower A", Floor = "4th Floor", Room = "Room 402", StorageArea = "Rack Shelf C-01", Description = "Primary deployment center and staging lab" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "HQ - Executive Floor 12", Code = "LOC-HQ-FL12-EXEC", Building = "Tower A", Floor = "12th Floor", Room = "Suite 1200", StorageArea = "Executive Lockers", Description = "C-suite hardware allocation" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "HQ - Ground Floor Central Storage", Code = "LOC-HQ-FL01-STOR", Building = "Tower B", Floor = "Ground Floor", Room = "Warehouse G-10", StorageArea = "Pallet Bay 04", Description = "Bulk unassigned inventory and incoming freight" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "NYC Branch - Tech Lab", Code = "LOC-NYC-FL02-LAB", Building = "Midtown Center", Floor = "2nd Floor", Room = "Room 214", StorageArea = "Cabinet B", Description = "East Coast engineering hardware hub" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "Austin Tech Hub - Floor 3", Code = "LOC-ATX-FL03-DEV", Building = "Domain Gateway", Floor = "3rd Floor", Room = "Open Plan Dev", StorageArea = "Locker Bank 3A", Description = "Austin software development asset pool" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "London Office - Room 301", Code = "LOC-LDN-FL03-R301", Building = "Canary Wharf Tower", Floor = "3rd Floor", Room = "Room 301", StorageArea = "Server Closet", Description = "UK & EMEA regional inventory" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "Singapore APAC Data Center", Code = "LOC-SIN-DC01", Building = "Equinix SG2", Floor = "Colo 2", Room = "Cage 14", StorageArea = "Rack 12-14", Description = "APAC core infrastructure" },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, BranchId = defaultBranch?.Id, Name = "Bangalore R&D Server Room", Code = "LOC-BLR-SRV01", Building = "EcoWorld Tower 4", Floor = "Basement 1", Room = "Secure DC", StorageArea = "Rack A-08", Description = "India product development infrastructure" }
        };
        context.AssetLocations.AddRange(locations);
        context.SaveChanges();

        // 4. SEED 12 MODELS
        var catLap = categories.First(c => c.Code == "LAP").Id;
        var catDsk = categories.First(c => c.Code == "DSK").Id;
        var catMon = categories.First(c => c.Code == "MON").Id;
        var catMob = categories.First(c => c.Code == "MOB").Id;
        var catNet = categories.First(c => c.Code == "NET").Id;
        var catSrv = categories.First(c => c.Code == "SRV").Id;
        var catFur = categories.First(c => c.Code == "FUR").Id;

        var models = new List<AssetModel>
        {
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catLap, Manufacturer = "Apple", ModelName = "MacBook Pro 16\" M3 Max", ModelNumber = "MUW63LL/A", Specifications = "16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 36 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catLap, Manufacturer = "Apple", ModelName = "MacBook Air 15\" M3", ModelNumber = "MXD43LL/A", Specifications = "8-core CPU, 10-core GPU, 16GB Unified Memory, 512GB SSD", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 36 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catLap, Manufacturer = "Dell", ModelName = "Latitude 5450 Enterprise", ModelNumber = "5450-G2", Specifications = "Intel Core Ultra 7 165U, 32GB DDR5, 1TB NVMe, 14\" FHD Touch", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 36 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catLap, Manufacturer = "Lenovo", ModelName = "ThinkPad X1 Carbon Gen 12", ModelNumber = "21HM0004US", Specifications = "Intel Core Ultra 7 155H, 32GB LPDDR5X, 1TB PCIe Gen4, 14\" 2.8K OLED", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 36 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catDsk, Manufacturer = "Dell", ModelName = "Precision 7960 Tower Workstation", ModelNumber = "P7960T", Specifications = "Intel Xeon w9-3495X, 128GB ECC RAM, NVIDIA RTX 6000 Ada 48GB", WarrantyPeriodMonths = 48, DefaultUsefulLifeMonths = 48 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catMon, Manufacturer = "Dell", ModelName = "UltraSharp 27\" 4K USB-C Hub Monitor", ModelNumber = "U2723QE", Specifications = "27-inch 4K IPS Black, 90W USB-C PD, RJ45 Ethernet, 98% DCI-P3", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 48 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catMon, Manufacturer = "Apple", ModelName = "Studio Display 27\" 5K", ModelNumber = "MK0U3LL/A", Specifications = "5K Retina display, 12MP Ultra Wide camera, 6-speaker sound system", WarrantyPeriodMonths = 36, DefaultUsefulLifeMonths = 48 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catMob, Manufacturer = "Apple", ModelName = "iPhone 16 Pro 256GB", ModelNumber = "MYNV3LL/A", Specifications = "A18 Pro chip, 6.3\" Super Retina XDR, Titanium finish, USB-C 3.0", WarrantyPeriodMonths = 24, DefaultUsefulLifeMonths = 24 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catMob, Manufacturer = "Samsung", ModelName = "Galaxy S24 Ultra Enterprise Edition", ModelNumber = "SM-S928U", Specifications = "Snapdragon 8 Gen 3, 12GB RAM, 512GB Storage, S-Pen included", WarrantyPeriodMonths = 24, DefaultUsefulLifeMonths = 24 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catNet, Manufacturer = "Cisco", ModelName = "Catalyst 9300 48-Port PoE+ Switch", ModelNumber = "C9300-48P-A", Specifications = "48 ports 10/100/1000 PoE+, Network Advantage, Cisco DNA Premier", WarrantyPeriodMonths = 60, DefaultUsefulLifeMonths = 60 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catSrv, Manufacturer = "Dell", ModelName = "PowerEdge R760 Rack Server", ModelNumber = "PER760", Specifications = "Dual Intel Xeon Platinum 8480+, 512GB DDR5, 8x 3.84TB NVMe SSD", WarrantyPeriodMonths = 60, DefaultUsefulLifeMonths = 60 },
            new() { Id = Guid.NewGuid(), TenantId = tenantId, CategoryId = catFur, Manufacturer = "Herman Miller", ModelName = "Aeron Chair Size B", ModelNumber = "AER1B23DW", Specifications = "PostureFit SL, Fully Adjustable Arms, Standard Carpet Castors, Mineral", WarrantyPeriodMonths = 144, DefaultUsefulLifeMonths = 84 }
        };
        context.AssetModels.AddRange(models);
        context.SaveChanges();

        // 5. SEED 120+ REALISTIC ASSETS
        var rnd = new Random(42);
        var assets = new List<Asset>();
        var assignments = new List<AssetAssignment>();
        var transfers = new List<AssetTransfer>();
        var maintenances = new List<AssetMaintenance>();
        var returns = new List<AssetReturn>();
        var incidents = new List<AssetIncident>();
        var disposals = new List<AssetDisposal>();
        var warranties = new List<AssetWarranty>();

        var defaultVendor = vendors.First();
        var defaultLocation = locations.First();
        var defaultDepartment = departments.FirstOrDefault();

        // Seed definitions table
        var sampleData = new[]
        {
            ("MacBook Pro 16\" M3 Max", catLap, models[0].Id, "Apple", 3499m, "MUW63", vendors[0].Id),
            ("MacBook Air 15\" M3", catLap, models[1].Id, "Apple", 1499m, "MXD43", vendors[0].Id),
            ("Dell Latitude 5450", catLap, models[2].Id, "Dell", 1680m, "DL5450", vendors[1].Id),
            ("Lenovo ThinkPad X1 Carbon", catLap, models[3].Id, "Lenovo", 1920m, "TPX1", vendors[3].Id),
            ("Dell Precision 7960 Workstation", catDsk, models[4].Id, "Dell", 4850m, "DP7960", vendors[1].Id),
            ("Dell UltraSharp 27\" 4K", catMon, models[5].Id, "Dell", 620m, "U2723", vendors[1].Id),
            ("Apple Studio Display 27\"", catMon, models[6].Id, "Apple", 1599m, "MK0U3", vendors[0].Id),
            ("iPhone 16 Pro 256GB", catMob, models[7].Id, "Apple", 1099m, "IP16P", vendors[0].Id),
            ("Samsung Galaxy S24 Ultra", catMob, models[8].Id, "Samsung", 1299m, "S24U", vendors[6].Id),
            ("Cisco Catalyst 9300 Switch", catNet, models[9].Id, "Cisco", 4200m, "C9300", vendors[4].Id),
            ("Dell PowerEdge R760 Server", catSrv, models[10].Id, "Dell", 8900m, "R760", vendors[1].Id),
            ("Herman Miller Aeron Chair", catFur, models[11].Id, "Herman Miller", 1495m, "AERON", vendors[5].Id)
        };

        int assetTagSeq = 100;

        for (int i = 0; i < 125; i++)
        {
            var template = sampleData[i % sampleData.Length];
            assetTagSeq++;
            var assetId = Guid.NewGuid();
            var tag = $"AST-2026-{assetTagSeq:D5}";
            var serial = $"{template.Item4.ToUpper().Substring(0, 3)}-{rnd.Next(10000000, 99999999)}";
            var purchaseDate = DateTime.UtcNow.AddMonths(-rnd.Next(1, 30));
            var price = template.Item5;
            var loc = locations[rnd.Next(locations.Count)];
            var dept = departments.Count > 0 ? departments[rnd.Next(departments.Count)] : null;
            var emp = employees.Count > 0 ? employees[rnd.Next(employees.Count)] : null;

            // Status distribution: 65% Assigned, 15% Available, 8% UnderMaintenance, 4% Lost/Damaged, 4% Disposed, 4% Retired
            string status;
            string condition = "Good";
            EmployeeEntity? custodian = null;

            if (i < 78) // Assigned
            {
                status = "Assigned";
                condition = rnd.Next(10) > 2 ? "Good" : (rnd.Next(2) == 0 ? "New" : "Fair");
                custodian = emp;
            }
            else if (i < 100) // Available
            {
                status = "Available";
                condition = rnd.Next(10) > 3 ? "Good" : "New";
                custodian = null;
            }
            else if (i < 110) // UnderMaintenance
            {
                status = "UnderMaintenance";
                condition = "Fair";
                custodian = null;
            }
            else if (i < 115) // Damaged or Lost
            {
                status = i % 2 == 0 ? "Damaged" : "Lost";
                condition = "Damaged";
                custodian = null;
            }
            else if (i < 120) // Retired
            {
                status = "Retired";
                condition = "Poor";
                custodian = null;
            }
            else // Disposed
            {
                status = "Disposed";
                condition = "Poor";
                custodian = null;
            }

            // Warranty dates: deliberately seed a few with warranty expiring in 7 days, 30 days, or expired
            DateTime? warEnd = null;
            if (i % 10 == 1)
                warEnd = DateTime.UtcNow.AddDays(5); // Expiring in 7 days!
            else if (i % 10 == 2)
                warEnd = DateTime.UtcNow.AddDays(20); // Expiring in 30 days!
            else if (i % 10 == 3)
                warEnd = DateTime.UtcNow.AddDays(-15); // Expired!
            else
                warEnd = purchaseDate.AddMonths(36);

            var usefulLife = 36;
            var salvage = Math.Round(price * 0.10m, 2);
            var monthsElapsed = Math.Max(1, (int)((DateTime.UtcNow.Year - purchaseDate.Year) * 12 + DateTime.UtcNow.Month - purchaseDate.Month));
            var depPerMonth = (price - salvage) / usefulLife;
            var currentBook = Math.Max(salvage, price - (depPerMonth * Math.Min(monthsElapsed, usefulLife)));

            var asset = new Asset
            {
                Id = assetId,
                TenantId = tenantId,
                AssetTag = tag,
                AssetName = $"{template.Item1} #{i + 1}",
                CategoryId = template.Item2,
                ModelId = template.Item3,
                Manufacturer = template.Item4,
                SerialNumber = serial,
                Barcode = tag,
                QrCode = $"https://hrms.enterprise.internal/assets/verify/{tag}",
                Description = $"Enterprise assigned asset ({template.Item1}). Equipped with corporate endpoint security and fleet telemetry.",
                PurchaseDate = purchaseDate,
                PurchasePrice = price,
                Currency = "USD",
                VendorId = template.Item7,
                InvoiceNumber = $"INV-202{purchaseDate.Year % 10}-{rnd.Next(10000, 99999)}",
                PoNumber = $"PO-202{purchaseDate.Year % 10}-{rnd.Next(1000, 9999)}",
                WarrantyStartDate = purchaseDate,
                WarrantyEndDate = warEnd,
                Status = status,
                Condition = condition,
                LocationId = loc.Id,
                DepartmentId = dept?.Id,
                CurrentCustodianEmployeeId = custodian?.Id,
                UsefulLifeMonths = usefulLife,
                DepreciationMethod = "StraightLine",
                SalvageValue = salvage,
                CurrentBookValue = Math.Round(currentBook, 2),
                LastAuditDate = DateTime.UtcNow.AddMonths(-3),
                NextAuditDate = DateTime.UtcNow.AddMonths(3),
                CreatedAt = purchaseDate,
                Notes = $"Verified on inventory ingest. Asset Tag {tag} affixed."
            };

            assets.Add(asset);

            // Create Warranty record
            warranties.Add(new AssetWarranty
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                AssetId = asset.Id,
                WarrantyProvider = $"{template.Item4} Care / Enterprise Service",
                StartDate = purchaseDate,
                EndDate = warEnd.Value,
                WarrantyType = "Manufacturer",
                CoverageDetails = "Full parts and labor on-site next business day with accidental damage protection.",
                ContractNumber = $"WAR-{rnd.Next(100000, 999999)}",
                SupportPhone = "+1-800-555-0199",
                SupportEmail = "support@enterprise-hardware.internal",
                Status = warEnd.Value < DateTime.UtcNow ? "Expired" : (warEnd.Value <= DateTime.UtcNow.AddDays(30) ? "ExpiringSoon" : "Active")
            });

            // If Assigned, create Assignment record
            if (status == "Assigned" && custodian != null)
            {
                assignments.Add(new AssetAssignment
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    AssetId = asset.Id,
                    EmployeeId = custodian.Id,
                    DepartmentId = dept?.Id,
                    LocationId = loc.Id,
                    AssignedDate = purchaseDate.AddDays(rnd.Next(5, 20)),
                    ExpectedReturnDate = DateTime.UtcNow.AddMonths(rnd.Next(6, 24)),
                    ConditionAtHandover = condition,
                    AccessoriesJson = JsonSerializer.Serialize(new[] { "Power Adapter", "USB-C Braided Cable", "Laptop Sleeve", "Logitech Mouse" }),
                    HandoverNotes = "Delivered during onboarding orientation. Checked serial and condition.",
                    AcknowledgementStatus = i % 5 == 0 ? "Pending" : "Acknowledged",
                    AcknowledgementDate = i % 5 == 0 ? null : DateTime.UtcNow.AddDays(-10),
                    DigitalSignature = i % 5 == 0 ? string.Empty : $"{custodian.FirstName} {custodian.LastName} [DIGITAL-VERIFIED]",
                    AssignedBy = "HR IT Operations",
                    Status = "Active"
                });
            }

            // Create some past Transfer records for realism
            if (i % 7 == 0 && employees.Count > 2)
            {
                var fromEmp = employees[0];
                var toEmp = employees[1];
                transfers.Add(new AssetTransfer
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    AssetId = asset.Id,
                    FromEmployeeId = fromEmp.Id,
                    ToEmployeeId = toEmp.Id,
                    FromLocationId = locations[0].Id,
                    ToLocationId = locations[1].Id,
                    TransferDate = DateTime.UtcNow.AddMonths(-2),
                    ReceivedDate = DateTime.UtcNow.AddMonths(-2).AddDays(1),
                    InitiatedBy = "HR Asset Manager",
                    ApprovedBy = "Department Director",
                    Reason = "Cross-functional team reassignment",
                    Condition = "Good",
                    Status = "Received",
                    Comments = "Asset cleaned and sanitized prior to transfer."
                });
            }

            // Create Maintenance records for some assets
            if (status == "UnderMaintenance" || i % 6 == 0)
            {
                maintenances.Add(new AssetMaintenance
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    MaintenanceNumber = $"MNT-2026-{rnd.Next(1000, 9999)}",
                    AssetId = asset.Id,
                    MaintenanceType = i % 3 == 0 ? "Corrective" : "Preventive",
                    ServiceProvider = "Dell FastTrack IT Service Center",
                    StartDate = DateTime.UtcNow.AddDays(-rnd.Next(2, 30)),
                    CompletionDate = status == "UnderMaintenance" ? null : DateTime.UtcNow.AddDays(-1),
                    Issue = i % 3 == 0 ? "Display flickering on external thunderbolt dock" : "Annual thermal paste reapplication and dust blowout",
                    Diagnosis = "Hardware diagnostic confirmed port wear; motherboard connector replaced under warranty",
                    WorkPerformed = "Motherboard sub-assembly replaced; BIOS updated to version 1.14.2",
                    Cost = i % 3 == 0 ? 0m : 120m,
                    WarrantyCovered = i % 3 == 0,
                    TechnicianName = "Marcus Vance",
                    Status = status == "UnderMaintenance" ? "InProgress" : "Completed"
                });
            }

            // Create Returns for some past assignments
            if (i % 9 == 0 && custodian != null)
            {
                returns.Add(new AssetReturn
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    ReturnNumber = $"RET-2026-{rnd.Next(1000, 9999)}",
                    AssetId = asset.Id,
                    EmployeeId = custodian.Id,
                    ReturnDate = DateTime.UtcNow.AddDays(-rnd.Next(5, 60)),
                    Condition = "Good",
                    AccessoriesReturnedJson = JsonSerializer.Serialize(new[] { "Power Adapter", "USB-C Cable" }),
                    MissingAccessoriesJson = JsonSerializer.Serialize(new string[] { }),
                    Status = "Completed",
                    InspectionNotes = "Device returned in pristine cosmetic shape. Factory wiped.",
                    InspectedBy = "Senior IT Technician",
                    ProcessedBy = "HR Asset Administrator",
                    ResultingAssetStatus = "Available"
                });
            }

            // Create Incidents for lost or damaged assets
            if (status is "Lost" or "Damaged")
            {
                incidents.Add(new AssetIncident
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    IncidentNumber = $"INC-2026-{rnd.Next(1000, 9999)}",
                    AssetId = asset.Id,
                    EmployeeId = emp?.Id,
                    IncidentType = status == "Lost" ? "Lost" : "Damage",
                    IncidentDate = DateTime.UtcNow.AddDays(-12),
                    ReportedDate = DateTime.UtcNow.AddDays(-11),
                    Severity = status == "Lost" ? "Critical" : "High",
                    EstimatedLoss = status == "Lost" ? price : 450m,
                    Description = status == "Lost" ? "Employee reported laptop bag stolen from locked vehicle trunk during travel" : "Spilled coffee over keyboard during strategy meeting; motherboard shorted",
                    Resolution = status == "Lost" ? "Remote wiped via Intune MDM. Police report filed #POL-2026-9912. Insurance claim submitted." : "Sent to OEM service center; repair parts requisitioned.",
                    Status = "Resolved",
                    ResolvedBy = "IT Security Director"
                });
            }

            // Create Disposals
            if (status == "Disposed")
            {
                disposals.Add(new AssetDisposal
                {
                    Id = Guid.NewGuid(),
                    TenantId = tenantId,
                    DisposalNumber = $"DSP-2026-{rnd.Next(1000, 9999)}",
                    AssetId = asset.Id,
                    DisposalDate = DateTime.UtcNow.AddDays(-15),
                    DisposalReason = "EndOfUsefulLife",
                    DisposalMethod = "Recycling",
                    SaleValue = 150m,
                    BuyerVendorName = "GreenTech Electronics Recycling LLC",
                    ApprovedBy = "Chief Technology Officer",
                    ApprovalDate = DateTime.UtcNow.AddDays(-16),
                    Status = "Completed",
                    Notes = "DOD 5220.22-M 7-pass storage wipe certificate on file."
                });
            }
        }

        context.Assets.AddRange(assets);
        context.AssetWarranties.AddRange(warranties);
        context.AssetAssignments.AddRange(assignments);
        context.AssetTransfers.AddRange(transfers);
        context.AssetMaintenances.AddRange(maintenances);
        context.AssetReturns.AddRange(returns);
        context.AssetIncidents.AddRange(incidents);
        context.AssetDisposals.AddRange(disposals);
        context.SaveChanges();

        // 6. SEED 12 ASSET REQUESTS INTEGRATED WITH WORKFLOW
        var reqCategories = categories.Take(4).ToList();
        for (int r = 0; r < 12; r++)
        {
            var emp = employees[r % employees.Count];
            var cat = reqCategories[r % reqCategories.Count];
            var reqNum = $"ARQ-2026-{100 + r:D4}";
            var status = r switch
            {
                < 4 => "PendingApproval",
                < 7 => "Approved",
                < 10 => "Fulfilled",
                _ => "Rejected"
            };

            var wfReq = new ApprovalRequest
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                RequestNumber = reqNum,
                RequesterId = emp.Id.ToString(),
                RequesterName = $"{emp.FirstName} {emp.LastName}",
                RequesterEmail = emp.Email,
                Department = emp.Department?.Name ?? "Engineering",
                Module = "Asset",
                EntityType = "AssetRequest",
                Status = status == "PendingApproval" ? "Pending" : status,
                Priority = r % 3 == 0 ? "High" : (r % 2 == 0 ? "Urgent" : "Normal"),
                Summary = $"Requisition of {cat.Name} for project onboarding",
                SubmittedAt = DateTime.UtcNow.AddDays(-r * 2)
            };
            context.ApprovalRequests.Add(wfReq);

            var assetReq = new AssetRequest
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                RequestNumber = reqNum,
                EmployeeId = emp.Id,
                CategoryId = cat.Id,
                Quantity = 1,
                Reason = r % 2 == 0 ? "New hire workstation allocation" : "Upgrade from obsolete 2021 hardware",
                RequiredDate = DateTime.UtcNow.AddDays(r * 3),
                Priority = wfReq.Priority,
                Status = status,
                ApprovalRequestId = wfReq.Id,
                ApproverComments = status == "Approved" || status == "Fulfilled" ? "Approved per Q1 department equipment budget" : (status == "Rejected" ? "Rejected: Please request hardware refresh next quarter" : string.Empty),
                ReviewedBy = status != "PendingApproval" ? "IT Asset Manager" : string.Empty,
                ReviewedAt = status != "PendingApproval" ? DateTime.UtcNow.AddDays(-1) : null,
                CreatedAt = DateTime.UtcNow.AddDays(-r * 2)
            };

            context.AssetRequests.Add(assetReq);
        }

        // 7. SEED AUDIT CAMPAIGN
        var audit = new AssetAudit
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AuditCode = "AUD-2026-Q1-001",
            Name = "Q1 2026 Enterprise Hardware & Physical Asset Verification",
            LocationId = locations[0].Id,
            DepartmentId = departments.FirstOrDefault()?.Id,
            StartDate = DateTime.UtcNow.AddDays(-14),
            EndDate = DateTime.UtcNow.AddDays(-2),
            AssignedAuditorEmployeeId = employees.FirstOrDefault()?.Id,
            Status = "Completed",
            TotalAssetsCount = 30,
            VerifiedCount = 27,
            MissingCount = 1,
            DiscrepancyCount = 2,
            SummaryNotes = "Annual physical asset audit completed across Main Depot and Engineering floors. 90% verified on first scan."
        };

        var auditAssets = assets.Take(30).ToList();
        foreach (var a in auditAssets)
        {
            audit.Items.Add(new AssetAuditItem
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                AuditId = audit.Id,
                AssetId = a.Id,
                ExpectedLocationId = a.LocationId,
                ActualLocationId = a.LocationId,
                ExpectedEmployeeId = a.CurrentCustodianEmployeeId,
                ActualEmployeeId = a.CurrentCustodianEmployeeId,
                ExpectedCondition = a.Condition,
                ActualCondition = a.Condition,
                Status = a.Status == "Lost" ? "Missing" : (a.Condition == "Damaged" ? "Damaged" : "Verified"),
                VerificationDate = DateTime.UtcNow.AddDays(-5),
                VerifiedBy = "Lead IT Asset Auditor",
                ScannedViaQr = true
            });
        }
        context.AssetAudits.Add(audit);

        context.SaveChanges();
    }
}
